"use client";
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import AdminHistoryCard from './AdminHistoryCard';

const AdminHistory = () => {

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRef = collection(db, "TempEvents");
      const snapshot = await getDocs(eventsRef);
      const Events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // const nonPendingEvents = Events.filter((e: any) => (e.Status !== "pending"));
      setEvents(Events);
      console.log(Events);
    }
    fetchEvents();
  },[]);


  return (
    <>
      {events.map(event => (
          <AdminHistoryCard
          id={event.id}
          eventName={event["Event Name"]}
          committeeName={event["Committee Name"]}
          eventDate={event["Event Date"]}
          eventTime={event["Event Time"]}
          eventLocation={event["Event Location"]}
          eventDescription={event["Event description"]}
          eventRegistrationUrl={event["Event registration url"]}
          imageUrl={event["Image url"]}
          status={event.Status}
          />
    ))}
    </>
  )
}

export default AdminHistory