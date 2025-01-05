"use client";

import Image from "next/image";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { useState, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

const snapPoints = [0.95, 0.5, 100];
const initialSnap = 1;

const BottomBar = () => {
  const restaurants = useSelector((state: RootState) => state.restaurants.restaurant);
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
        <Sheet.Content style={{ paddingBottom: sheetRef.current?.y }}>
          <div className="flex items-center space-x-3 pb-5 px-4">
            <div className="flex items-center flex-grow bg-veryLightGray rounded-lg px-4 py-2 border-lightGray border">
              <IoSearch className="text-mediumGray" />
              <input type="text" placeholder="Wyszukaj tutaj" className="bg-transparent flex-grow px-2 text-sm text-mediumGray font-medium outline-none" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} onFocus={() => snapTo(0)} />
            </div>
            <button className="flex justify-center items-center bg-secondaryYellow text-bodyText w-10 h-10 rounded-lg shadow-sm" onClick={() => snapTo(0)}>
              <FiFilter className="text-white" />
            </button>
          </div>
          <Sheet.Scroller draggableAt="both" className="flex flex-col">
            {restaurants.length > 0 &&
              restaurants.map((restaurant, index) => (
                <div key={index} className="flex flex-col space-y-4 border-b border-lightGray px-4 py-4 first:pt-0 last:border-0">
                  <div className="bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl overflow-hidden relative rounded-xl" style={{ aspectRatio: "16 / 9" }}>
                    {restaurant.image ? <Image src={restaurant.image.url} alt={restaurant.name} className="object-cover" fill /> : <span># {index + 1}</span>}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h4 className="text-xl font-light">{restaurant.name}</h4>
                    <div className="text-sm text-mediumGray flex items-center space-x-2">
                      {restaurant.type && <span>{restaurant.type}</span>}
                      {restaurant.type && restaurant.price && <span>•</span>}
                      {restaurant.price && <span>{restaurant.price}</span>}
                    </div>
                    {restaurant.foodCategories && restaurant.foodCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {restaurant.foodCategories.map((category, i) => (
                          <span key={i} className="bg-lightGray text-darkGray text-xs font-medium px-2 py-1 rounded-xl">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};

export default BottomBar;
