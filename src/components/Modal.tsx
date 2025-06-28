
import React from 'react';
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg flex flex-col items-center">
        <div className="w-[250px] h-[250px] flex items-center justify-center border border-gray-200">
          {imageUrl ? (
            <Image
              width={250}
              height={250}
              src={imageUrl}
              alt="Event"
              className="object-contain w-full h-full"
            />
          ) : (
            <p className="text-gray-500">No image available</p>
          )}
        </div>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;