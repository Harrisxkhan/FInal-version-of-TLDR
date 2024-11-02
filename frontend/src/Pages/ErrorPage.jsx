import error from "/images/404.jpg";
import { Link, useLocation } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();
  const errorMessage = location.state?.message || "Oops! Something went wrong.";
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <img className="w-[450px]" src={error} alt="" />
      <h5 className="text-3xl text-center">{errorMessage}</h5>
      <Link to="/sign-in">
        <button className="bg-black text-white text-lg font-medium py-3 px-12 mt-16">
          Go Back
        </button>
      </Link>
    </div>
  );
}