import React from 'react';

function Modal({ isOpen, onClose, title, children, showCopy, copyContent }) {
  if (!isOpen) return null;

  const handleCopy = () => {
    if (copyContent) {
      navigator.clipboard.writeText(copyContent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div className="mb-4 max-h-[60vh] overflow-y-auto">{children}</div>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}

export default Modal; 