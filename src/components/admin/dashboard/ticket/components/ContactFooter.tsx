import type React from "react";

const ContactFooter: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50 -mx-6 sm:-mx-10 md:-mx-16 px-6 sm:px-10 md:px-16 py-6 rounded-b-lg">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Need Help? Contact Us
        </p>
        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
          <p>
            <span className="font-medium">Email:</span>{" "}
            <a
              href="mailto:info@cochincruiseline.com"
              className="text-gray-700 hover:text-gray-900 underline"
            >
              info@cochincruiseline.com
            </a>
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            <span className="text-gray-700 font-medium">+91 8089021666</span>
          </p>
          <p className="text-gray-500 italic">(Mon to Sat 9:30AM to 5:30PM)</p>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;