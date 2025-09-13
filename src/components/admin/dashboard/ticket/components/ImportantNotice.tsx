import type React from "react";

const ImportantNotice: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
      <p className="text-sm font-medium text-yellow-800">
        <span className="font-bold">Important:</span> Passenger should report at
        terminal half an hour (30 mins) before departure time.
      </p>
    </div>
  );
};

export default ImportantNotice;