import React from "react";
import Image from "next/image";
import SearchIcon from "@/assests/icons/search-icon.svg";

interface SearchBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ input, setInput }) => {
  return (
    <div>
      <form className="flex items-center p-0 w-[25.52vw] h-[2.55vw] relative p-[0.51vw_0.76vw] gap-[0.51vw] border-[0.05vw] border-[#E0E0E9] rounded-[0.78vw] hover:border-very-dark-grayish-blue">
        <Image
          src={SearchIcon}
          className="w-[1.23vw] h-[1.23vw]"
          alt="search icon"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-normal flex justify-center items-start w-full h-[1.23vw] text-[#282833] text-[0.92vw] focus:outline-none placeholder:text-[#9a9aa0] text-[0.92vw]"
          placeholder="Search here"
        />
      </form>
    </div>
  );
};

export default SearchBar;
