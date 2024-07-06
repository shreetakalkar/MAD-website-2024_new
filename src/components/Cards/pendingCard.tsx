import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon } from "lucide-react";
import testimg from "../../public/images/OnlineTraining.png";

function InputWithLabel({ label, input }: { label: any; input: any }) {
  return (
    <div className="flex flex-col h-[100%]">
      <div className=" h-[35%] text-[0.94rem] xl:text-sm font-[550] pt-[2%]">
        {label}
      </div>
      <div className=" h-[65%] overflow-auto">
        <div
          className={`border-[0.5px] xl:text-sm flex items-center h-[100%]   text-start py-[4.5%] px-[4%]   w-[90%] rounded-lg text-[0.9rem] `}
        >
          {input}
        </div>
      </div>
    </div>
  );
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-neutral-900 p-8 rounded shadow-md">
        <img
          src={imageSrc}
          alt="Previous Pass"
          className="max-w-full max-h-full"
        />
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

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

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  action,
  data,
}) => {
  const [certificateNumber, setCertificateNumber] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-neutral-900 p-8 rounded shadow-md">
        <h2 className="text-xl text-white mb-4">
          {action} Concession Request?
        </h2>
        <div className="mb-4 text-white">
          <strong>Name:</strong> {data.firstName} {data.middleName}{" "}
          {data.lastName}
        </div>
        <div className="mb-4 text-white">
          <strong>From:</strong> {data.from}
        </div>
        <div className="mb-4 text-white">
          <strong>To:</strong> {data.to}
        </div>
        {action === "Approve" ? (
          <div className="mb-4 text-white">
            <label className="block mb-2 ">Certificate Number:</label>
            <input
              type="text"
              placeholder="Enter Cetificate Number..."
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="w-full text-black p-2 border rounded"
            />
          </div>
        ) : null}

        <div className="flex space-x-4">
          {action === "Approve" ? (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={() => onSubmit(certificateNumber)}
            >
              Approve
            </button>
          ) : (
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => onSubmit(certificateNumber)}
            >
              Reject
            </button>
          )}
          {action === "Reject" ? (
            <input
              placeholder="Enter Reason"
              value={data.reason}
              className="w-full p-2 border rounded"
              onChange={(e) => data.setReason(e.target.value)}
            />
          ) : null}
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            Go Back
          </button>
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
  const [modalAction, setModalAction] = useState<"Approve" | "Reject">(
    "Approve"
  );
  const [reason, setReason] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // State for image modal
  const [imageSrc, setImageSrc] = useState(""); // State for image source

  const handleApprove = () => {
    setModalAction("Approve");
    setIsModalOpen(true);
  };

  const handleReject = () => {
    setModalAction("Reject");
    setIsModalOpen(true);
  };

  const handleImageClick = (src: string) => {
    setImageSrc(src);
    setIsImageModalOpen(true);
  };

  const handleSubmit = async (certificateNumber: string) => {
    setIsModalOpen(false);
    let statMessage = reason || "Your Form has been Rejected";
    const currentDate = new Date();

    const updatedConcessionDetailsFields = {
      certificateNumber: certificateNumber,
      status: modalAction === "Approve" ? "serviced" : "rejected",
      lastPassIssued: modalAction === "Approve" ? currentDate : null,
      statusMessage:
        modalAction === "Approve" ? "Your Form has been Approved" : statMessage,
    };

    const updatedConcessionRequestFields = {
      status: modalAction === "Approve" ? "serviced" : "rejected",
      passNum: certificateNumber,
      statusMessage: updatedConcessionDetailsFields.statusMessage,
      notificationTime: currentDate,
      passCollected: {
        date: null,
        collected: "0"
      }
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
      {/* MAYURESH KA COMPONENT */}
      {/* <div className="mx-auto max-w-lg flex flex-col border p-4 rounded shadow">
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
            </div> */}

      <div className="p-[0.8%] flex flex-col rounded-md border-[0.5px] border-[#E2E8F0] w-[50vw] h-[50vh] temp-> ml-[20px] my-[20px]">
        <div className=" h-[18.75%] flex w-[100%]">
          <div className="h-[100%] w-[73%] flex">
            <div className="h-[100%] w-[33.33%]">
              <InputWithLabel label={`First Name`} input={firstName} />
            </div>
            <div className="h-[100%] w-[33.33%]">
              <InputWithLabel label={`Middle Name`} input={middleName} />
            </div>
            <div className="h-[100%] w-[33.33%]">
              <InputWithLabel label={`Last Name`} input={lastName} />
            </div>
          </div>
          <div className="h-[100%] w-[27%]">
            <InputWithLabel
              label={`Certificate Number`}
              input={`ye toh badme denge na ig?`}
            />
          </div>
        </div>
        <div className=" h-[18.75%] flex w-[100%]">
          <div className="flex h-[100%] w-[50%]">
            <div className="h-[100%] w-[50%]">
              <InputWithLabel label={`Gender`} input={gender} />
            </div>
            <div className="h-[100%] w-[50%]">
              <InputWithLabel label={`Date of Birth`} input={dob} />
            </div>
          </div>
          <div className="h-[100%] flex w-[50%]">
            <div className="h-[100%] w-[50%]">
              <InputWithLabel label={`From`} input={from} />
            </div>
            <div className="h-[100%] w-[50%]">
              <InputWithLabel label={`To`} input={to} />
            </div>
          </div>
        </div>
        <div className="h-[18.75%] flex w-[100%]">
          <div className="flex h-[100%] w-[50%]">
            <div className="w-[50%] h-[100%]">
              <InputWithLabel label={`Branch`} input={branch} />
            </div>
            <div className="w-[50%] h-[100%]">
              <InputWithLabel label={`Graduation Year`} input={gradyear} />
            </div>
          </div>
          <div className=" flex h-[100%] w-[50%]">
            <div className="w-[50%] h-[100%]">
              <InputWithLabel label={`Class`} input={travelClass} />
            </div>
            <div className="w-[50%] h-[100%]">
              <InputWithLabel label={`Duration`} input={duration} />
            </div>
          </div>
        </div>
        <div className="h-[18.75%] flex w-[100%]">
          <div className="flex h-[100%] w-[50%]">
            <div className="w-[50%] h-[100%]">
              <InputWithLabel label={`Phone Number`} input={phoneNum} />
            </div>
            <div className="w-[50%] h-[100%]">
              <InputWithLabel label={`Travel Lane`} input={`iska var konsa?`} />
            </div>
          </div>
          <div className=" flex h-[100%] w-[50%]">
            <div
              className="w-[50%] h-[100%] flex flex-col items-center justify-end hover:cursor-pointer"
              onClick={() =>
                handleImageClick("../../public/images/OnlineTraining.png")
              }
            >
              <EyeIcon />
              <div className="2xl:text-sm xl:text-xs text-center">
                Click to view ID
              </div>
            </div>
            <div
              className="w-[50%] h-[100%] flex flex-col items-center justify-end hover:cursor-pointer"
              onClick={() =>
                handleImageClick("../../public/images/OnlineTraining.png")
              }
            >
              <EyeIcon />
              <div className="2xl:text-sm xl:text-xs text-center">
                Click to view prev pass
              </div>
            </div>
          </div>
        </div>
        <div className=" h-[25%] flex w-[100%]">
          <div className=" w-[50%] h-[100%]">
            <InputWithLabel label={`Address`} input={address} />
          </div>
          <div className=" flex w-[50%]">
            <div className="w-[50%] flex items-end  justify-center">
              <button
                className="bg-green-500 w-[80%] h-[50%] text-white bg- py-2 px-4 rounded hover:bg-green-600"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
            <div className="w-[50%]   flex items-end justify-center">
              <button
                className="bg-red-500 text-white  w-[80%] h-[50%] py-2 px-4 rounded hover:bg-red-600"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
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

      {/* Image modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={imageSrc}
      />
    </>
  );
};

export default PendingCard;
