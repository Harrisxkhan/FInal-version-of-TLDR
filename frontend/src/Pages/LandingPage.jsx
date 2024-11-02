import Container from "../Components/Shared/Container";
import { MdNavigateNext } from "react-icons/md";
import { IoSparklesOutline } from "react-icons/io5";
import hero from "/images/hero.jpg";
import "./Hero.css";
// import ContactPage from "../Pages/Contact";
import { Link } from "react-router-dom";
import AboutPage from "./About";

export default function LandingPage() {
  return (
    <Container>
      <div className="hero h-[calc(100vh-96px)] px-3 md:px-0">
        <div className="order-2 md:order-1 md:flex-1 md:pr-4 lg:pl-8">
          <IoSparklesOutline size={36} className="mb-4 md:mb-8" />
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-bold mb-4 md:mb-8">
            Contribute Your Expertise: Write and Share AI Papers
          </h1>
          <p className="text-lg pr-4 md:pr-8 lg:pr-16">
            Contribute your insights, Publish papers. Shape AI&apos;s future.
            Start sharing on AI Synopsis Hub now.
          </p>
          <div className="md:mt-8 mt-4 lg:flex gap-8 mb-4 md:mb-0">
            <Link to="/sign-up">
              <button className="group hover:bg-black bg-gray-800 transition duration-150 text-white py-2 md:py-3 px-12 flex md:mb-4 lg:mb-0 items-center gap-1 w-full lg:w-auto justify-center">
                <p className="md:text-[16px] font-medium">GET STARTED</p>
                <MdNavigateNext
                  size={26}
                  className="font-medium transform transition-transform duration-300 group-hover:translate-x-2"
                />
              </button>
            </Link>
            <Link to="/about">
              <button className="border-2 w-full lg:w-auto text-[16px] font-medium border-black py-2 md:py-3 px-12 mt-4 md:mt-0">
                LEARN MORE
              </button>
            </Link>
          </div>
        </div>
        <div className="hero-img order-1 md:order-2 md:flex-1 flex justify-center">
          <img className="w-[80%] mx-auto md:m-0" src={hero} alt="hero image" />
        </div>
      </div>
    </Container>
  );
}
