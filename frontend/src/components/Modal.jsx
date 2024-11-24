const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            aria-hidden="true"
            onClick={onClose}
          ></div>

          {/* Modal */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-black font-semibold hover:text-gray-700 focus:outline-none"
              onClick={onClose}
              aria-label="Close modal"
            >
              &times; {/* Using "&times;" for the close icon */}
            </button>

            {/* Modal Content */}
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
