import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {


  return (
    <div
      className="flex items-center bg-white border border-gray-300 rounded-xl w-96 mx-auto p-1.5"
    >
      <LuSearch className="text-gray-500" />
      <input
        type="text"
        placeholder="Search here"
        value={value}
        onChange={onChange}
        className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 placeholder:font-light placeholder:text-sm pl-1 w-[80%]"
      />
    </div>
  );
};

export default SearchBar;
