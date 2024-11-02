import React from "react";

export default function ShareModal({
  isOpen,
  onClose,
  userImg,
  userName,
  userEmail,
  shareMessage,
  handleShareMessageChange,
  handleShareClick,
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={() => {
        onClose();
      }}
      className="fixed top-0 left-0 w-screen h-screen bg-[#00000056] z-50 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-4 h-[230px] w-[95%] md:w-[700px] lg:w-[800px] bg-white rounded-md absolute right-[50%] translate-x-1/2 bottom-[65px] top-[12%] flex flex-col z-10 "
      >
        <div className="flex gap-2 items-center">
          <img className="w-10 rounded-full" src={userImg} alt="User" />
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-gray-600 text-sm">{userEmail}</p>
          </div>
        </div>
        <form>
          <textarea
            style={{ resize: "none" }}
            className="border rounded outline-none w-full mt-2 px-2 py-2"
            rows={4}
            value={shareMessage}
            onChange={handleShareMessageChange}
            placeholder="Say something about this..."
          ></textarea>
          <div className="w-full flex justify-end mt-1 items-center gap-4">
            <button
              type="button"
              className="bg-black text-white py-1 px-4 rounded-full text-sm"
              onClick={() => {
                handleShareClick();
              }}
            >
              Share Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
