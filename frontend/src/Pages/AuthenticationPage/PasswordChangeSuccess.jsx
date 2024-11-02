import passChanged from "/images/pass-changed.jpg";

export default function PasswordChangeSuccess() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-96px)] flex-col">
      <img className="w-[450px]" src={passChanged} alt="" />
      <h5 className="text-3xl text-center">Password Changed Successfully</h5>
      <button className="bg-black text-white text-lg font-medium py-3 px-12 mt-16">
        Continue
      </button>
    </div>
  );
}
