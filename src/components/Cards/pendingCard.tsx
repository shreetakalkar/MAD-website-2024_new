import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '@/config/firebase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (certificateNumber: string) => void;
  action: string;
  data: {
    firstName: string;
    middleName: string;
    lastName: string;
    from: string;
    to: string;
    reason: string;
    setReason: React.Dispatch<React.SetStateAction<string>>;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, action, data }) => {
  const [certificateNumber, setCertificateNumber] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-neutral-900 p-8 rounded shadow-md">
        <h2 className="text-xl mb-4">{action} Concession Request?</h2>
        <div className="mb-4">
          <strong>Name:</strong> {data.firstName} {data.middleName} {data.lastName}
        </div>
        <div className="mb-4">
          <strong>From:</strong> {data.from}
        </div>
        <div className="mb-4">
          <strong>To:</strong> {data.to}
        </div>
        {action === 'Approve' ? (<div className="mb-4">
          <label className="block mb-2">Certificate Number:</label>
          <input
            type="text"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>) : null}

        <div className="flex space-x-4">
          {action === 'Approve' ?
            <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => onSubmit(certificateNumber)}>Approve</button> :
            <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={() => onSubmit(certificateNumber)}>Reject</button>
          }
          {action === 'Reject' ? <input placeholder='Enter Reason' value={data.reason} className="w-full p-2 border rounded" onChange={(e) => data.setReason(e.target.value)} /> : null}
          <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={onClose}>Go Back</button>
        </div>
      </div>
    </div>
  );
};


// PendingCard component
interface PendingCardProps {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  from: string;
  to: string;
  travelClass: string;
  duration: string;
  lastPassIssued: string;
  branch: string;
  gradyear: string;
  address: string;
  dob: string;
  ageYears: number;
  ageMonths: number;
  phoneNum: number;
  statusMessage: string;
  onCardUpdate: (id: string) => void;
}

const PendingCard: React.FC<PendingCardProps> = ({
  id,
  firstName,
  middleName,
  lastName,
  gender,
  from,
  to,
  travelClass,
  duration,
  lastPassIssued,
  branch,
  gradyear,
  address,
  dob,
  ageYears,
  ageMonths,
  phoneNum,
  statusMessage,
  onCardUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'Approve' | 'Reject'>('Approve');
  const [reason, setReason] = useState('');

  const handleApprove = () => {
    setModalAction('Approve');
    setIsModalOpen(true);
  };

  const handleReject = () => {
    setModalAction('Reject');
    setIsModalOpen(true);
  };

  const handleSubmit = async (certificateNumber: string) => {
    setIsModalOpen(false);
    let statMessage = reason || 'Your Form has been Rejected';
    const currentDate = new Date();

    const updatedConcessionDetailsFields = {
      certificateNumber: certificateNumber,
      status: modalAction === 'Approve' ? 'serviced' : 'rejected',
      lastPassIssued: modalAction === 'Approve' ? currentDate : null,
      statusMessage: modalAction === 'Approve' ? 'Your Form has been Approved' : statMessage,
    };

    const updatedConcessionRequestFields = {
      status: modalAction === 'Approve' ? 'serviced' : 'rejected',
      passNum: certificateNumber,
      statusMessage: updatedConcessionDetailsFields.statusMessage,
      notificationTime: currentDate,
    };

    try {
      const docRef = doc(db, "ConcessionDetails", id);
      await updateDoc(docRef, updatedConcessionDetailsFields);

      const concessionRequestRef = doc(db, "ConcessionRequest", id);
      await updateDoc(concessionRequestRef, updatedConcessionRequestFields);

      // Update parent component state to remove this card from the list
      onCardUpdate(id);
      console.log("Document successfully updated");
    } catch (error) {
      console.error("Error updating concession request: ", error);
    }
  };

  return (
    <>
      {/* Fetched concession details */}
      <div className="mx-auto max-w-lg flex flex-col border p-4 rounded shadow">
        <h2 className="text-xl mb-4">Railway Concessions</h2>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {firstName} {middleName} {lastName} <span className="text-gray-500">{gender}</span>
          </div>
          <div className="flex justify-between">
            <div>
              <strong>From:</strong> {from}
            </div>
            <div>
              <strong>To:</strong> {to}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <strong>Class:</strong> {travelClass}
            </div>
            <div>
              <strong>Mode:</strong> {duration}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <strong>Date of Issue:</strong> {lastPassIssued}
            </div>
            <div>
              <strong>Branch:</strong> {branch}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <strong>Current Year:</strong> {gradyear}
            </div>
          </div>
          <div>
            <strong>Address:</strong> {address}
          </div>
          <div className="flex justify-between">
            <div>
              <strong>Date of Birth:</strong> {dob}
            </div>
            <div>
              <strong>Age:</strong> {ageYears} Years & {ageMonths} Months
            </div>
          </div>
          <div>
            <strong>Phone Number:</strong> {phoneNum}
          </div>
          <div>
            <strong>Status Message:</strong> {statusMessage}
          </div>
          <div className="flex space-x-2">
            <button className="bg-green-500 text-white bg- py-2 px-4 rounded hover:bg-green-600" onClick={handleApprove}>Approve</button>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={handleReject}>Reject</button>
          </div>
        </div>
      </div>

      {/* Approve/Reject modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        action={modalAction}
        data={{ firstName, middleName, lastName, from, to, reason, setReason }}
      />
    </>
  );
};

export default PendingCard;
