import React from 'react';

const Modal = ({ isOpen, onClose, title='', children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        
        {/* Modal Content */}
        <div>{children}</div>
        
        {/* Close Button */}
      {title.includes('QR') && <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>}  
      </div>
    </div>
  );
};

export default Modal;
