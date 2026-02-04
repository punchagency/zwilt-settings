import React from "react";

const Error: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-[50vh]">
      <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2">
        Error loading data
      </p>
    </div>
  );
};

export default Error;
