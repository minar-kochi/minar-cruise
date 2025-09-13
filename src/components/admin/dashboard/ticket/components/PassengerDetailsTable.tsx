import type React from "react";
import SectionTitle from "./SectionTitle";
import { PassengerDetails } from "../cruise-ticket";

interface PassengerDetailsTableProps {
  passengers: PassengerDetails[];
}

const PassengerDetailsTable: React.FC<PassengerDetailsTableProps> = ({
  passengers,
}) => {
  return (
    <div className="mb-6 md:mb-8 overflow-x-auto">
      <SectionTitle title="Passenger Details" />
      <table className="w-full min-w-[300px] border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
            <th className="border-r border-gray-300 p-3 sm:p-4 text-center text-sm sm:text-base font-semibold text-gray-700">
              Sr.No
            </th>
            <th className="border-r border-gray-300 p-3 sm:p-4 text-center text-sm sm:text-base font-semibold text-gray-700">
              First Name
            </th>
            <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-semibold text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-50 transition-colors`}
            >
              <td className="border-r border-gray-200 p-3 sm:p-4 text-center text-sm sm:text-base font-medium">
                {index + 1}
              </td>
              <td className="border-r border-gray-200 p-3 sm:p-4 text-center text-sm sm:text-base font-medium">
                {passenger.firstName}
              </td>
              <td className="p-3 sm:p-4 text-center text-sm sm:text-base">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    passenger.status.toLowerCase() === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {passenger.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerDetailsTable;