"use client";

import { Sheet, type SheetRef } from "react-modal-sheet";
import { useState, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";

const snapPoints = [0.95, 0.4, 100];
const initialSnap = 1;

const BottomBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const sheetRef = useRef<SheetRef>(null);
  const snapTo = (i: number) => sheetRef.current?.snapTo(i);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Sheet ref={sheetRef} isOpen={true} onClose={() => {}} snapPoints={snapPoints} initialSnap={initialSnap}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content style={{ paddingBottom: sheetRef.current?.y }} className="px-4">
          <div className="flex items-center space-x-3 pb-5">
            <div className="flex items-center flex-grow bg-veryLightGray rounded-lg px-4 py-2 border-lightGray border">
              <IoSearch className="text-mediumGray" />
              <input type="text" placeholder="Wyszukaj tutaj" className="bg-transparent flex-grow px-2 text-sm text-mediumGray font-medium outline-none" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} onFocus={() => snapTo(0)} />
            </div>
            <button className="flex justify-center items-center bg-secondaryYellow text-bodyText w-10 h-10 rounded-lg shadow-sm">
              <FiFilter className="text-white" />
            </button>
          </div>
          <Sheet.Scroller draggableAt="both">
            {Array.from({ length: 20 })
              .fill(1)
              .map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg min-h-[200px] mb-4 flex items-center justify-center font-bold text-2xl last:mb-0">
                  {i + 1}
                </div>
              ))}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};

export default BottomBar;
