"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";

const BottomBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="absolute bottom-0 w-full bg-white rounded-t-2xl shadow-md px-4 py-3 z-10 flex flex-col gap-2">
      <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto"></div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center flex-grow bg-veryLightGray rounded-lg px-4 py-2 border-lightGray border">
          <IoSearch className="text-mediumGray" />
          <input type="text" placeholder="Wyszukaj tutaj" className="bg-transparent flex-grow px-2 text-sm text-mediumGray font-medium outline-none" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <button className="flex justify-center items-center bg-secondaryYellow text-bodyText w-10 h-10 rounded-lg shadow-sm">
          <FiFilter className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
