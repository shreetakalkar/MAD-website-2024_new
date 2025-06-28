import React from 'react';
import Image from "next/image";

interface PendingEventsCardProps {
  id: string;
  committeeName: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventRegistrationUrl: string;
  imageUrl: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PendingEventsCard: React.FC<PendingEventsCardProps> = ({
  id,
  committeeName,
  eventName,
  eventDescription,
  eventDate,
  eventTime,
  eventLocation,
  eventRegistrationUrl,
  imageUrl,
  onApprove,
  onReject,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-md m-4 min-w-screen">
      <div className="flex justify-between">
        <div className="w-2/3 space-y-4">
          <h2 className="text-2xl font-bold mb-2">{eventName}</h2>
          <p className="mb-2"><strong>Committee:</strong> {committeeName}</p>
          <p className="mb-2"><strong>Date:</strong> {eventDate}</p>
          <p className="mb-2"><strong>Time:</strong> {eventTime}</p>
          <p className="mb-2"><strong>Location:</strong> {eventLocation}</p>
          <p className="mb-2"><strong>Description:</strong> {eventDescription}</p>
          <p className="mb-2">
            <strong>Registration URL:</strong> 
            <a href={eventRegistrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {eventRegistrationUrl}
            </a>
          </p>
        </div>
        <div className="w-1/3">
          <Image width={250} height={250} src={imageUrl} alt="Event" className="w-full h-auto rounded" />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button 
          onClick={() => onApprove(id)} 
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
        >
          Approve
        </button>
        <button 
          onClick={() => onReject(id)} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default PendingEventsCard;
