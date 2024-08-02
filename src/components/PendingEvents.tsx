"use client";
import React, { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import PendingEventsCard from '@/components/Cards/pendingEventsCard';

const PendingEvents: React.FC = () => {
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      const eventsRef = collection(db, "TempEvents");
      const snapshot = await getDocs(eventsRef);
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(events);
      setPendingEvents(events);
    };

    fetchPendingEvents();
  }, []);

  const handleApprove = async (id: string) => {

    const event = pendingEvents.find(event => event.id === id);
    console.log(event);
    if (event) {
      const addRef = doc(db, "Events", id);
      await setDoc(addRef, {
        committeeName: event["Committee Name"],
        eventName: event["Event Name"],
        eventDescription: event["Event description"],
        eventDate: event["Event Date"],
        eventTime: event["Event Time"],
        eventLocation: event["Event Location"],
        eventRegistrationUrl: event["Event registration url"],
        imageUrl: event["Image url"],
      });
    }
    console.log("Event Added to Events Collection");

    const delRef = doc(db, "TempEvents", id);
    await deleteDoc(delRef);
    console.log("Event Removed from TempEvents Collection");
    setPendingEvents(prevEvents => prevEvents.filter(event => event.id !== id));
};

const handleReject = async (id: string) => {
    const delRef = doc(db, "TempEvents", id);
    await deleteDoc(delRef);
    setPendingEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    console.log("Event Removed from TempEvents Collection");
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4 text-center">Pending Events</h1>
      {pendingEvents.map(event => (
        <PendingEventsCard
          key={event.id}
          id={event.id}
          committeeName={event["Committee Name"]}
          eventName={event["Event Name"]}
          eventDescription={event["Event description"]}
          eventDate={event["Event Date"]}
          eventTime={event["Event Time"]}
          eventLocation={event["Event Location"]}
          eventRegistrationUrl={event["Event registration url"]}
          imageUrl={event["Image url"]}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
};

export default PendingEvents;
