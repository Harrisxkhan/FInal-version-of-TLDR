import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi"; // Outline icons

const AlertBox = ({ type, message, onClose }) => {
  // Define alert styles for white background and black text
  const alertStyles = {
    success: "bg-white text-black border-green-500",
    error: "bg-white text-black border-red-500",
    warning: "bg-white text-black border-yellow-500",
    info: "bg-white text-black border-blue-500",
  };

  const iconStyles = {
    success: <FiCheckCircle className="text-green-500 text-2xl mr-3" />,
    error: <FiAlertCircle className="text-red-500 text-2xl mr-3" />,
    warning: <FiAlertCircle className="text-yellow-500 text-2xl mr-3" />,
    info: <FiInfo className="text-blue-500 text-2xl mr-3" />,
  };

  const openGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <div
        className={`border-l-4 p-6 rounded-md ${alertStyles[type]} w-full max-w-md mx-auto shadow-lg relative`}
        role="alert"
      >
        {/* Icon and Message */}
        <div className="flex items-start">
          {iconStyles[type]}
          <div className="flex-1">
            <p className="text-lg font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-2xl font-bold text-gray-500 hover:text-black"
          >
            <FiX />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={openGmail}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Gmail
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
