import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title = "", children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000ad] bg-opacity-50 flex justify-center items-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative"
      >
        {/* Close Button */}
        {/* {title.includes("QR") && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        )} */}

        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{title}</h2>

        {/* Modal Content */}
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
