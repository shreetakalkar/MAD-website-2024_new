const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment-timezone");
admin.initializeApp();

const debounceTime = 5000; // Debounce time in milliseconds
let debounceTimers = {};

exports.copyConcessionDetailsToHistory = functions.firestore
    .document("ConcessionDetails/{studentId}")
    .onWrite((change, context) => {
      const studentId = context.params.studentId;
      const newData = change.after.exists ? change.after.data() : null;

      if (!newData || newData.status === "unserviced" || newData.status === "rejected") {
        console.log("Unserviced Request. Skipping update to history.");
        return null;
      }

      if (debounceTimers[studentId]) {
        clearTimeout(debounceTimers[studentId]);
      }

      debounceTimers[studentId] = setTimeout(() => {
        const historyRef = admin.firestore().collection("ConcessionHistory").doc("History");
        const concessionRequestRef = admin.firestore().collection("ConcessionRequest").doc(studentId);

        concessionRequestRef.get()
            .then((doc) => {
              if (!doc.exists) {
                console.log(`No concession request found for studentId: ${studentId}.`);
                return null;
              }

              const passNum = doc.data().passNum;
              const updatedData = {...newData, passNum};

              return historyRef.get().then((historyDoc) => {
                if (!historyDoc.exists) {
                // Create the document if it doesn't exist
                  return historyRef.set({
                    history: [updatedData],
                    lastCSVDateUpdated: 0,
                    csvUpdatedDate: [],
                  }).then(() => {
                    console.log("Created new document in ConcessionHistory with initial data.");
                  });
                } else {
                // Update the document if it exists
                  return historyRef.update({
                    history: admin.firestore.FieldValue.arrayUnion(updatedData),
                  }).then(() => {
                    console.log("Updated existing document in ConcessionHistory.");
                  });
                }
              });
            })
            .catch((error) => {
              console.log("Error fetching concession request or updating history:", error);
            })
            .finally(() => {
              delete debounceTimers[studentId];
            });
      }, debounceTime);

      return null;
    });

exports.updateDateofCSV = functions.firestore
    .document("ConcessionHistory/History")
    .onUpdate((change, context) => {
      const newValue = change.after.data();
      const historyLength = newValue.history.length;
      const historyRef = admin.firestore().collection("ConcessionHistory").doc("History");
      const lastCSVDateUpdated = newValue.lastCSVDateUpdated;

      if (historyLength % 100 === 0 && (lastCSVDateUpdated !== (historyLength - 1))) {
        let from;
        let to;
        if (lastCSVDateUpdated == 0) {
          from = lastCSVDateUpdated;
          to = lastCSVDateUpdated + 99;
        } else {
          from = lastCSVDateUpdated + 1;
          to = lastCSVDateUpdated + 100;
        }
        const date = moment().tz("Asia/Kolkata").format("MMMM DD, YYYY [at] hh:mm:ss A [UTC]Z");

        const newCSVEntry = {
          from: from,
          to: to,
          date: date,
        };

        return historyRef.update({
          csvUpdatedDate: admin.firestore.FieldValue.arrayUnion(newCSVEntry),
          lastCSVDateUpdated: to,
        }).then(() => {
          console.log("csvUpdatedDate and lastCSVDateUpdated fields updated successfully.");
        }).catch((error) => {
          console.error("Error updating csvUpdatedDate and lastCSVDateUpdated fields:", error);
        });
      } else {
        console.log("History length is not a multiple of 100. No update performed.");
        return null;
      }
    });

exports.sendNotificationOnNewNotification = functions.firestore
    .document("notifications/{notificationId}")
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const title = newValue.title;
      const message = newValue.message;
      const topic = newValue.topic;
      const attachments = newValue.attachments;

      let imageUrl = null;
      if (attachments) {
        imageUrl = newValue.attachments[0];
      }

      // Create a payload for the notification
      const payload = {
        notification: {
          title: title,
          body: message,
        },
        data: {},
      };

      if (imageUrl) {
        payload.notification.image = imageUrl;
        payload.data.imageUrl = imageUrl;
      }

      let query = admin.firestore().collection("Students ");
      if (topic === "All") {
        // Query for all students
      } else {
        // Parse the topic and build the query based on the available parts
        const topicParts = topic.split("-");
        const gradyear = topicParts[0] || null;
        const Branch = topicParts[1] || null;
        const div = topicParts[2] || null;
        const Batch = topicParts[3] || null;

        if (Batch) {
          query = query.where("gradyear", "==", gradyear).where("Branch", "==", Branch).where("div", "==", div).where("Batch", "==", Batch);
        } else if (div) {
          query = query.where("gradyear", "==", gradyear).where("Branch", "==", Branch).where("div", "==", div);
        } else if (Branch) {
          query = query.where("gradyear", "==", gradyear).where("Branch", "==", Branch);
        } else if (gradyear) {
          query = query.where("gradyear", "==", gradyear);
        }
      }

      // Send notifications to the matched students
      return query.get().then((snapshot) => {
        const promises = [];
        snapshot.forEach((studentDoc) => {
          const fcmToken = studentDoc.data().fcmToken;
          if (fcmToken) {
            const sendNotification = admin.messaging().sendToDevice(fcmToken, payload).then((response) => {
              console.log("Notification sent successfully:", response);
            }).catch((error) => {
              console.log("Error sending notification:", error);
            });
            promises.push(sendNotification);
          }
        });
        return Promise.all(promises);
      });
    });

exports.sendNotificationOnNewEvent = functions.firestore
    .document("Events/{eventId}")
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const eventName = (newValue["Event Name"] || "").toString();
      let eventDescription = (newValue["Event description"] || "").toString();
      const imageUrl = newValue["Image url "] || null;

      // Truncate the description to 100 characters
      const maxDescriptionLength = 100;
      if (eventDescription.length > maxDescriptionLength) {
        eventDescription = eventDescription.substring(0, maxDescriptionLength) + "...";
      }

      // Create a payload for the notification
      const payload = {
        notification: {
          title: eventName,
          body: eventDescription,
        },
        data: {},
      };

      if (imageUrl) {
        payload.notification.image = imageUrl;
        payload.data.imageUrl = imageUrl;
      }

      let query = admin.firestore().collection("Students ");

      // Send notifications to the matched students
      return query.get().then((snapshot) => {
        const promises = [];
        snapshot.forEach((studentDoc) => {
          const fcmToken = studentDoc.data().fcmToken;
          if (fcmToken) {
            const sendNotification = admin.messaging().sendToDevice(fcmToken, payload)
                .then((response) => {
                  console.log("Notification sent successfully:", response);
                })
                .catch((error) => {
                  console.error("Error sending notification:", error);
                });
            promises.push(sendNotification);
          }
        });
        return Promise.all(promises);
      }).catch((error) => {
        console.error("Error fetching students:", error);
      });
    });

exports.sendRailwayNotification = functions.firestore
    .document("ConcessionDetails/{studentId}")
    .onWrite((change, context) => {
      const studentId = context.params.studentId;
      const newData = change.after.exists ? change.after.data() : null;

      const status = newData.status;
      let title;
      let message;
      let imageUrl;

      if (status==="serviced") {
        title = "Railway Concession Application Accepted";
        message = "Your Railway Concession Application has been accepted, please collect the slip from the office";
        imageUrl = "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/RailwayNotification%2Fapproved.png?alt=media&token=0fa86b26-bcf5-4bd5-95cf-d4f6ec2b028c";
      } else if (status==="rejected") {
        title = "Railway Concession Application Rejected";
        message = "Your Railway Concession Application has been rejected, please contact office for further enquiry";
        imageUrl = "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/RailwayNotification%2Frejected.png?alt=media&token=492ef29c-45f5-4c01-87d7-208305e07dde";
      } else {
        console.log("No Notiofication was Sent as Req wasnt Serviced or Rejected");
        return;
      }

      // Create a payload for the notification
      const payload = {
        notification: {
          title: title,
          body: message,
          image: imageUrl,
        },
        data: {
          imageUrl: imageUrl,
        },
      };

      // Query the Students collection to get the student document by ID
      const studentDocRef = admin.firestore().collection("Students ").doc(studentId);

      return studentDocRef.get().then((studentDoc) => {
        if (!studentDoc.exists) {
          console.log(`No student found with ID: ${studentId}`);
          return null;
        }

        const studentData = studentDoc.data();
        const fcmToken = studentData.fcmToken;

        if (fcmToken) {
          return admin.messaging().sendToDevice(fcmToken, payload)
              .then((response) => {
                console.log("Notification sent successfully:", response);
              })
              .catch((error) => {
                console.error("Error sending notification:", error);
              });
        } else {
          console.log(`No FCM token found for student with ID: ${studentId}`);
          return null;
        }
      }).catch((error) => {
        console.error("Error fetching student:", error);
      });
    });

exports.sendCollectedNotification = functions.firestore
    .document("ConcessionRequest/{studentId}")
    .onWrite((change, context) => {
      const studentId = context.params.studentId;
      const newData = change.after.exists ? change.after.data() : null;

      const collected = newData.passCollected.collected;
      const status = newData.status;
      let title;
      let message;
      let imageUrl;

      if (collected==="1" && status==="serviced") {
        title = "Railway Concession Collected";
        message = "You have collected your Railway Pass just now";
        imageUrl = "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/RailwayNotification%2Fcollected.png?alt=media&token=27b8b9ec-f5a9-4e0a-991f-f437605eeff4";
      } else {
        console.log("Pass Not Collected");
        return null;
      }

      // Create a payload for the notification
      const payload = {
        notification: {
          title: title,
          body: message,
          image: imageUrl,
        },
        data: {
          imageUrl: imageUrl,
        },
      };

      // Query the Students collection to get the student document by ID
      const studentDocRef = admin.firestore().collection("Students ").doc(studentId);

      return studentDocRef.get().then((studentDoc) => {
        if (!studentDoc.exists) {
          console.log(`No student found with ID: ${studentId}`);
          return null;
        }

        const studentData = studentDoc.data();
        const fcmToken = studentData.fcmToken;

        if (fcmToken) {
          return admin.messaging().sendToDevice(fcmToken, payload)
              .then((response) => {
                console.log("Notification sent successfully:", response);
              })
              .catch((error) => {
                console.error("Error sending notification:", error);
              });
        } else {
          console.log(`No FCM token found for student with ID: ${studentId}`);
          return null;
        }
      }).catch((error) => {
        console.error("Error fetching student:", error);
      });
    });

exports.checkPassExpirations = functions.pubsub.schedule("every day 00:00").timeZone("Asia/Kolkata").onRun(async (context) => {
  const now = admin.firestore.Timestamp.now().toDate();
  const todayDate = new Date(now);
  // ------------------------------------------------ //
  const options = {timeZone: "Asia/Kolkata", hour12: true};
  console.log("todayDate: ", todayDate.toLocaleString("en-IN", options));
  // 05:30 Hrs before the time of notification, some GMT IST Issue
  todayDate.setUTCHours(18, 30, 0, 0);

  try {
    const concessionDetailsSnapshot = await admin.firestore().collection("ConcessionDetails").get();

    const notifications = [];

    concessionDetailsSnapshot.forEach(async (doc) => {
      const data = doc.data();
      const lastPassIssued = data.lastPassIssued.toDate();
      lastPassIssued.setUTCHours(18, 30, 0, 0);
      // ------------------------------------------------ //
      console.log("lastPassIssued: ", lastPassIssued.toLocaleString("en-IN", options));
      const duration = data.duration;
      const status = data.status;

      if (status==="serviced") {
        let passEndDate;

        if (duration === "Monthly") {
          passEndDate = new Date(lastPassIssued);
          passEndDate.setMonth(passEndDate.getMonth() + 1);
          passEndDate.setDate(passEndDate.getDate() - 1);
        } else if (duration === "Quarterly") {
          passEndDate = new Date(lastPassIssued);
          passEndDate.setMonth(passEndDate.getMonth() + 3);
          passEndDate.setDate(passEndDate.getDate() - 1);
        }

        if ((passEndDate-todayDate)<=(3*24*60*60*1000)) {
          // Fetch the student"s token
          const studentDoc = await admin.firestore().collection("Students ").doc(doc.id).get();
          if (studentDoc.exists) {
            const studentData = studentDoc.data();
            const token = studentData.fcmToken;

            const formattedPassEndDate = passEndDate.toLocaleDateString("en-GB");
            let body;

            if ((passEndDate-todayDate)===0) {
              body = "Your pass has expired today. Please renew it on our app";
            } else if ((passEndDate-todayDate)<0) {
              body = `Your pass had expired on ${formattedPassEndDate}. Please renew it using our app.`;
            } else {
              body = `Your pass is expiring on ${formattedPassEndDate}. Please renew it in time.`;
            }

            // ------------------------------------------------ //
            console.log("passEndDate: ", passEndDate.toLocaleString("en-IN", options));

            // ------------------------------------------------ //
            console.log("passEndDate-todayDate: ", passEndDate-todayDate);
            // Prepare the notification payload
            const payload = {
              notification: {
                title: "Pass Expiration Alert",
                body: body,
                image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/RailwayNotification%2Fexpired.png?alt=media&token=c4b98742-575b-42e2-a9c2-7233798b924c",
              },
              data: {
                passEndDate: formattedPassEndDate,
                imageUrl: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/RailwayNotification%2Fexpired.png?alt=media&token=c4b98742-575b-42e2-a9c2-7233798b924c",
              },
            };

            console.log("User Added: ", data.id);
            notifications.push(admin.messaging().sendToDevice(token, payload));
          }
        } else {
          console.log("Request Has time to Expire: ", doc.id);
        }
      } else {
        console.log("Request Not Serviced: ", doc.id);
      }
    });

    await Promise.all(notifications);
    console.log("All notifications sent successfully");
  } catch (error) {
    console.error("Error checking pass expirations:", error);
  }

  return null;
});

exports.fromNotesToNotification = functions.firestore
    .document("Notes/{noteId}")
    .onWrite((change, context) => {
      const noteId = context.params.noteId;

      if (debounceTimers[noteId]) {
        clearTimeout(debounceTimers[noteId]);
      }

      debounceTimers[noteId] = setTimeout(() => {
        const newValue = change.after.exists ? change.after.data() : null;
        if (!newValue) {
          console.log("Document was deleted, no notification to send.");
          return null;
        }

        const professorName = newValue.professor_name;
        const subject = newValue.subject;
        const title = newValue.title;
        const branch = newValue.target_classes[0].branch;
        const year = newValue.target_classes[0].year;
        const div = newValue.target_classes[0].division;
        const time = newValue.time;

        let gradyear;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        if (currentMonth >= 6) {
          if (year === "FE") {
            gradyear = currentYear + 4;
          } else if (year === "SE") {
            gradyear = currentYear + 3;
          } else if (year === "TE") {
            gradyear = currentYear + 2;
          } else if (year === "BE") {
            gradyear = currentYear + 1;
          }
        } else if (currentMonth <= 5) {
          if (year === "FE") {
            gradyear = currentYear + 3;
          } else if (year === "SE") {
            gradyear = currentYear + 2;
          } else if (year === "TE") {
            gradyear = currentYear + 1;
          } else if (year === "BE") {
            gradyear = currentYear;
          }
        }

        const notification = {
          // attachments: [],
          message: `${professorName} has sent ${title} Notes`,
          notificationTime: time,
          senderName: professorName,
          sentBy: professorName,
          title: subject + " Notes",
          topic: gradyear + "-" + branch + "-" + div,
        };

        return admin.firestore().collection("notifications").add(notification)
            .then(() => {
              console.log("Notes Notification was created successfully");
              return null;
            })
            .catch((error) => {
              console.error("Error creating notification: ", error);
              throw new Error("Notes Notification failed");
            });
      }, debounceTime);

      return null;
    });
