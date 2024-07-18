import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon } from "lucide-react";
import testimg from "../../public/images/OnlineTraining.png";

const currentUserYear = (gradyear: string) => {
  // const gradYearList = useGradYear();
  // console.log(gradYearList);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const gradYear = parseInt(gradyear);

  if (
    (currentMonth >= 6 && gradYear == currentYear + 4) ||
    (currentMonth <= 5 && gradYear == currentYear + 3)
  ) {
    return "FE";
  } else if (
    (currentMonth >= 6 && gradYear == currentYear + 3) ||
    (currentMonth <= 5 && gradYear == currentYear + 2)
  ) {
    return "SE";
  } else if (
    (currentMonth >= 6 && gradYear == currentYear + 2) ||
    (currentMonth <= 5 && gradYear == currentYear + 1)
  ) {
    return "TE";
  } else if (
    (currentMonth >= 6 && gradYear == currentYear + 1) ||
    (currentMonth <= 5 && gradYear == currentYear)
  ) {
    return "BE";
  }
};

function InputWithLabel({ label, input }: { label: any; input: any }) {
  return (
    <div className="flex flex-col h-[100%]">
      <div className=" h-[35%] text-[0.94rem] xl:text-sm font-[550] pt-1">
        {label}
      </div>
      <div className=" h-[65%] overflow-auto">
        <div
          className={`border-[0.5px] xl:text-sm flex items-center h-[80%] leading-none   text-start py-[2%] px-[4%]   w-[90%] rounded-lg text-[0.9rem] `}
        >
          {input}
        </div>
      </div>
    </div>
  );
}
//ignore
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
    duration: string;
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className={`p-8 rounded-lg shadow-xl w-full max-w-md ${action==="Approve" ? "bg-green-100" : action==="Reject" ? "bg-red-100" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {action} Concession Request
        </h2>
        <div className="mb-4 text-gray-700">
          <p><strong>Name:</strong> {data.firstName} {data.middleName} {data.lastName}</p>
        </div>
        <div className="mb-4 text-gray-700">
          <p><strong>From:</strong> {data.from}</p>
        </div>
        <div className="mb-4 text-gray-700">
          <p><strong>Duration:</strong> {data.duration}</p>
        </div>
        {action === "Approve" && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2"><strong>Certificate Number:</strong></label>
            <input
              type="text"
              placeholder="Enter Certificate Number..."
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {action === "Reject" && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2"><strong>Reason:</strong></label>
            <input
              type="text"
              placeholder="Enter Reason..."
              value={data.reason}
              onChange={(e) => data.setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}
        <div className="flex justify-between items-center">
          <button
            className={`w-1/3 py-2 px-4 rounded-lg text-white ${action === "Approve" ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            onClick={() => onSubmit(certificateNumber)}
          >
            {action}
          </button>
          <button
            className="w-1/3 py-2 px-4 rounded-lg text-white bg-gray-600 hover:bg-gray-700"
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
  travelLane: string;
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
  idCardURL: string;
  idCardURL2: string;
  previousPassURL: string;
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
  travelLane,
  duration,
  branch,
  gradyear,
  address,
  dob,
  phoneNum,
  idCardURL,
  idCardURL2,
  previousPassURL,
  onCardUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"Approve" | "Reject">(
    "Approve"
  );
  const [reason, setReason] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // State for image modal
  const [imageSrc, setImageSrc] = useState(""); // State for image source

  const currentYear = currentUserYear(gradyear);

  const handleApprove = () => {
    setModalAction("Approve");
    setIsModalOpen(true);
  };

  const handleReject = () => {
    setModalAction("Reject");
    setIsModalOpen(true);
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

    let passCollected = null;

    if (modalAction=="Approve") {
      passCollected = {
        date: null,
        collected: "0",
      }
    }

    const updatedConcessionRequestFields = {
      status: modalAction === "Approve" ? "serviced" : "rejected",
      passNum: certificateNumber,
      statusMessage: updatedConcessionDetailsFields.statusMessage,
      notificationTime: currentDate,
      passCollected: passCollected,
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


      {/* <div className="p-[0.8%] flex rounded-md border-[2px] border-[#E2E8F0] w-[90vw] h-[90vh] temp-> ml-[20px] my-[20px]">
        <div className="flex flex-col w-1/2 h-full">
          <div className="h-[100%] w-[100%] flex flex-col  ">
            <div className="h-[14.2857142857%] flex w-[100%] "> 
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Name`} input={firstName}/>
              </div>
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Middle Name`} input={middleName} />
              </div>
            </div>
            <div className="h-[14.2857142857%] flex w-[100%] ">
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Last Name`} input={lastName} />
              </div>
              <div className="w-[50%] h-full">
                {" "}
                <InputWithLabel label={`Phone Number`} input={phoneNum} />

              </div>
            </div>
            <div className="h-[14.2857142857%] flex w-[100%] ">
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Gender`} input={gender} />
              </div>
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Date of Birth`} input={dob} />
              </div>
            </div>
            <div className="h-[14.2857142857%] flex w-[100%] ">
              <div className="w-[50%] h-full">
                <InputWithLabel label={`From`} input={from} />
              </div>
              <div className="w-[50%] h-full">
                <InputWithLabel label={`To`} input={to} />
              </div>
            </div>
            <div className="h-[14.2857142857%] flex w-[100%] ">
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Branch`} input={branch} />
              </div>
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Graduation Year`} input={currentYear} />
              </div>
            </div>
            <div className="h-[14.2857142857%] flex w-[100%] ">
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Class`} input={travelClass} />
              </div>
              <div className="w-[50%] h-full">
                <InputWithLabel label={`Duration`} input={duration} />
              </div>
            </div>
            <div className="h-[14.2857142857%] flex w-[100%] ">

              <div className="w-[100%] h-full">
                <InputWithLabel label={`Travel Lane`} input={travelLane} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/2 h-full">
          <div className="h-[100%] w-[100%] flex flex-col  ">
            <div className="h-[28.5714285714%] w-[100%] ">
              <div className="w-full h-full">
                <InputWithLabel label={`Address`} input={address} />
              </div>
            </div>
            <div className="h-[57.1428571429%] w-[100%] ">
              <div className="w-full h-full border-[0.5px] rounded-lg overflow-auto remove-scroller flex flex-col items-center">
                <div className="my-2">
                  <img src={idCardURL} alt="idCarUrl" />
                </div>
                <div className="my-2">
                  <img src={idCardURL2} alt="idCarUrl2" />
                </div>
                <div className="my-2">
                  <img src={previousPassURL} alt="previousPassUrl" />
                </div>
              </div>
            </div>
            <div className="h-[14.2857142857%] flex w-[100%]">
              <div className="w-[50%] flex items-center  justify-center">
              <button
                className="bg-green-500 w-4/5 h-12 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200"
                onClick={handleApprove}
              >
                Approve
              </button>
              </div>
              <div className="w-[50%]   flex items-center justify-center">
              <button
                className="bg-red-500 w-4/5 h-12 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all duration-200"
                onClick={handleReject}
              >
                Reject
              </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      
      <div className="p-[0.8%] flex rounded-md border-[2px] border-[#E2E8F0] w-[95vw] h-[90vh] temp-> ml-[20px] my-[20px]">
        <div className="w-[70%] h-full flex flex-col">
          <div className=" flex h-[20%]">
            <div className="h-full w-1/2 ">
              <InputWithLabel label={`Name`} input={`${lastName} ${firstName} ${middleName}`} />
            </div>
            <div className="h-full w-1/2 flex ">
              <div className="h-full w-1/2 ">
                <InputWithLabel label={`DOB`} input={dob} />
              </div>
              <div className="h-full w-1/2">
                <InputWithLabel label={`Gender`} input={gender} />
              </div>
            </div>

          </div>
          <div className=" flex h-[20%]">
            <div className="h-full w-1/2 flex ">
              <div className="h-full w-1/2 ">
                <InputWithLabel label={`From`} input={from} />
              </div>
              <div className="h-full w-1/2">
                <InputWithLabel label={`To`} input={to} />
              </div>
            </div>
            <div className="h-full w-1/2 flex ">
              <div className="h-full w-1/2 ">
                <InputWithLabel label={`Class`} input={travelClass} />
              </div>
              <div className="h-full w-1/2">
                <InputWithLabel label={`Duration`} input={duration} />
              </div>
            </div>

          </div>
          <div className=" flex h-[20%]">
            <div className="h-full w-1/2 flex ">
              <div className="h-full w-1/2 ">
                <InputWithLabel label={`Branch`} input={branch} />
              </div>
              <div className="h-full w-1/2">
                <InputWithLabel label={`Graduation Year`} input={gradyear} />
              </div>
            </div>
            <div className="h-full w-1/2 flex ">
              <div className="h-full w-1/2 ">
                <InputWithLabel label={`Phone Number`} input={phoneNum} />
              </div>
              <div className="h-full w-1/2">
                <InputWithLabel label={`Travel Lane`} input={travelLane} />
              </div>
            </div>
          </div>
          <div className="h-[40%] flex ">
            <div className="h-full w-1/2">
              <InputWithLabel label={`Address`} input={address} />
            </div>
            <div className="h-full w-1/2 flex flex-col">
              <div className="w-full h-1/2 flex items-end justify-center">
                <button
                  className="bg-green-500 w-4/5 h-12 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200"
                  onClick={handleApprove}
                  >
                  Approve
                </button>
              </div>
              <div className="w-full h-1/2 flex items-center justify-center">
                <button
                  className="bg-red-500 w-4/5 h-12 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all duration-200"
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>



        </div>
        <div className="w-[30%] h-full flex flex-col  overflow-auto">
          <div className="m-2 h-[33.333%]">
            <img className="rounded-lg" src={idCardURL} alt="idCarUrl" />
          </div>
          <div className="m-2 h-[33.333%]">
            <img className="rounded-lg" src={idCardURL2} alt="idCarUrl2" />
          </div>
          <div className="m-2 h-[33.333%]">
            <img className="rounded-lg" src={previousPassURL} alt="previousPassUrl" />
          </div>
        </div>
      </div>

      {/* Approve/Reject modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        action={modalAction}
        data={{ firstName, middleName, lastName, from, duration, reason, setReason }}
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
