import React from "react";
import { FaRegFileAlt, FaRegCommentDots } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Insights and Analysis",
    description: "Gain valuable insights and understand key themes effortlessly.",
    icon: <FaRegFileAlt className="text-4xl mb-4 text-gray-700" />,
  },
  {
    title: "Publish Your Papers",
    description: "Contribute your research and insights to shape AI's future.",
    icon: <FaRegCommentDots className="text-4xl mb-4 text-gray-700" />,
  },
  {
    title: "User-Friendly Interface",
    description: "Navigate seamlessly through our platform with a clean design.",
    icon: <FiUsers className="text-4xl mb-4 text-gray-700" />,
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md p-8 mt-8 max-w-4xl w-full rounded-lg">
        <h1 className="text-4xl mb-6 text-center font-bold">About TldrAi</h1>
        <p className="mb-6 text-lg">
          TLDR AI is a platform for sharing concise insights and summaries of AI research. Users can create titles and outline key points for the AI papers they’ve read, making it easier for others to grasp the core ideas quickly. Join us to contribute your insights, explore published summaries, and support a community committed to advancing understanding in AI. Start sharing your knowledge on TLDR AI today!
        </p>

        <h2 className="text-3xl mb-4 font-semibold text-center">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-200 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              {service.icon}
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Link to="/contact" className="text-gray-800 hover:underline">
            Contact Us
          </Link>
          <Link to="/privacy-policy" className="text-gray-800 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
