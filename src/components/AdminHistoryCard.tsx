import React from 'react';

interface AdminHistoryCardProps {
  id: string;
  eventName: string;
  committeeName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
  eventRegistrationUrl: string;
  imageUrl: string;
  status: string;
}

const AdminHistoryCard: React.FC<AdminHistoryCardProps> = ({
  id,
  eventName,
  committeeName,
  eventDate,
  eventTime,
  eventLocation,
  eventDescription,
  eventRegistrationUrl,
  imageUrl,
  status,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-md m-4 min-w-screen">
      <div className="flex justify-between">
        <div className="w-2/3 space-y-6">
          <h2 className="text-3xl font-bold mb-2">{eventName}</h2>
          <p className="mb-2 text-lg"><strong>Committee: </strong> {committeeName}</p>
          <p className="mb-2 text-lg"><strong>Date: </strong> {eventDate}</p>
          <p className="mb-2 text-lg"><strong>Time: </strong> {eventTime}</p>
          <p className="mb-2 text-lg"><strong>Location: </strong> {eventLocation}</p>
          <p className="mb-2 text-lg"><strong>Description: </strong> {eventDescription}</p>
          <p className="mb-2 text-lg">
            <strong>Registration URL:</strong> 
            <a href={eventRegistrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {eventRegistrationUrl}
            </a>
          </p>
          <p className="mb-2"><strong>Status:</strong> <span className={`capitalize ${status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{status}</span></p>
        </div>
        <div className="w-1/3">
          <img src={imageUrl} alt="Event" className="w-full h-auto rounded" />
        </div>
      </div>
    </div>
  );
};

export default AdminHistoryCard;