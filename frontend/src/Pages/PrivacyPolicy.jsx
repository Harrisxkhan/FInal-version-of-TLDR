import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md p-8 max-w-3xl w-full rounded-lg mt-8">
        <h1 className="text-4xl mb-6 text-center font-bold">Privacy Policy</h1>
        <p className="mb-4">Effective date: [Insert Date]</p>

        <p className="mb-4">
          At TldrAi, we value your privacy and are committed to protecting your
          personal information. This Privacy Policy outlines how we collect,
          use, disclose, and safeguard your information when you visit our
          website.
        </p>

        <h2 className="text-2xl mb-4 font-semibold">Information We Collect</h2>
        <p className="mb-4">
          We may collect the following types of information:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Personal Information: Such as your name, email address, and contact
            details.
          </li>
          <li>
            Usage Data: Information about how you use our website, including
            your IP address, browser type, and access times.
          </li>
        </ul>

        <h2 className="text-2xl mb-4 font-semibold">
          How We Use Your Information
        </h2>
        <p className="mb-4">
          We use the collected information for various purposes, including:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>To provide and maintain our service.</li>
          <li>To notify you about changes to our service.</li>
          <li>
            To allow you to participate in interactive features when you choose
            to do so.
          </li>
          <li>To provide customer support.</li>
          <li>
            To gather analysis or valuable information so that we can improve
            our service.
          </li>
          <li>To monitor the usage of our service.</li>
          <li>To detect, prevent, and address technical issues.</li>
        </ul>

        <h2 className="text-2xl mb-4 font-semibold">Data Retention</h2>
        <p className="mb-4">
          We will retain your personal information only for as long as is
          necessary for the purposes set out in this Privacy Policy. We will
          retain and use your personal information to the extent necessary to
          comply with our legal obligations.
        </p>

        <h2 className="text-2xl mb-4 font-semibold">Disclosure of Data</h2>
        <p className="mb-4">
          We may disclose personal information that we collect, or you provide:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>To comply with a legal obligation.</li>
          <li>To protect and defend the rights or property of TldrAi.</li>
          <li>
            To prevent or investigate possible wrongdoing in connection with the
            service.
          </li>
          <li>
            To protect the personal safety of users of the service or the
            public.
          </li>
        </ul>

        <h2 className="text-2xl mb-4 font-semibold">
          Your Data Protection Rights
        </h2>
        <p className="mb-4">
          Depending on your location, you may have the following data protection
          rights:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            The right to access, update, or delete the information we have on
            you.
          </li>
          <li>
            The right to rectification if your information is inaccurate or
            incomplete.
          </li>
          <li>The right to object to our processing of your personal data.</li>
          <li>
            The right to request that we restrict the processing of your
            personal data.
          </li>
          <li>The right to data portability.</li>
        </ul>

        <h2 className="text-2xl mb-4 font-semibold">
          Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="text-2xl mb-4 font-semibold">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <p>
          Email:{" "}
          <Link to="/contact" className="text-blue-500 underline">
          tldrai098@gmail.com
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
