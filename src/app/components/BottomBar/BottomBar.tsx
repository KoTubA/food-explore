"use client";

import Image from "next/image";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { useState, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa";
import { LuWheatOff } from "react-icons/lu";
import { RootState } from "@/src/redux/store";
import { Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRestaurant, setSnapPosition } from "@/src/redux/slices/restaurantsSlice";
import RestaurantDetails from "@/src/app/components/RestaurantDetails/RestaurantDetails";

const snapPoints = [0.95, 0.5, 100];

const BottomBar = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state: RootState) => state.restaurants.restaurant);
  const isRestaurantDetailsOpen = useSelector((state: RootState) => state.restaurants.isRestaurantDetailsOpen);
  const snapPosition = useSelector((state: RootState) => state.restaurants.snapPosition);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const listSheetRef = useRef<SheetRef>(null);
  const snapToList = (i: number) => {
    dispatch(setSnapPosition(i));
    listSheetRef.current?.snapTo(i);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
  };

  const handleSnap = (index: number) => {
    // When restaurant details are opened (isRestaurantDetailsOpen === true),
    // the sheet closes, triggering onSnap with the highest snap value.
    // Avoid saving this value to preserve the previous snap position.
    if (!isRestaurantDetailsOpen) {
      dispatch(setSnapPosition(index));
    }
  };

  return (
    <>
      {/* Sheet z listą restauracji */}
      <Sheet ref={listSheetRef} isOpen={!isRestaurantDetailsOpen} onClose={() => {}} snapPoints={snapPoints} initialSnap={snapPosition} onSnap={handleSnap}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="flex items-center space-x-3 pb-5 px-4">
              <div className="flex items-center flex-grow bg-veryLightGray rounded-lg px-4 py-2 border-lightGray border">
                <IoSearch className="text-mediumGray" />
                <input type="text" placeholder="Wyszukaj tutaj" className="bg-transparent flex-grow px-2 text-sm text-mediumGray font-medium outline-none" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} onFocus={() => snapToList(0)} />
              </div>
              <button className="flex justify-center items-center bg-secondaryYellow text-bodyText w-10 h-10 rounded-lg shadow-sm" onClick={() => snapToList(0)}>
                <FiFilter className="text-white" />
              </button>
            </div>
            <Sheet.Scroller draggableAt="both" className="flex flex-col">
              {restaurants.length > 0 &&
                restaurants.map((restaurant, index) => (
                  <div key={index} className="flex flex-col space-y-4 border-b border-lightGray px-4 py-4 first:pt-0 last:border-0 cursor-pointer" onClick={() => handleSelectRestaurant(restaurant)}>
                    <div className="bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl overflow-hidden relative rounded-xl" style={{ aspectRatio: "16 / 9" }}>
                      {restaurant.image ? <Image src={restaurant.image.url} alt={restaurant.name} className="object-cover" fill /> : <span># {index + 1}</span>}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <h4 className="text-xl font-light">{restaurant.name}</h4>
                      <div className="text-sm text-mediumGray flex items-center space-x-2">
                        {restaurant.type && (
                          <span className="flex items-center">
                            <span>{restaurant.type}</span>
                          </span>
                        )}
                        {restaurant.price && (
                          <span className="flex items-center space-x-2">
                            <span>•</span>
                            <span>{restaurant.price}</span>
                          </span>
                        )}
                        {restaurant.dietaryStyles && restaurant.dietaryStyles.length > 0 && (
                          <>
                            {restaurant.dietaryStyles.map((category) => {
                              let icon;
                              switch (category) {
                                case "Wegetariańska":
                                  icon = <FaLeaf className="text-primaryGreen" />;
                                  break;
                                case "Wegańska":
                                  icon = <FaSeedling className="text-primaryGreen" />;
                                  break;
                                case "Bezglutenowa":
                                  icon = <LuWheatOff className="text-primaryRed" />;
                                  break;
                                default:
                                  icon = null;
                              }

                              return (
                                <span key={category} className="flex items-center space-x-2">
                                  <span>•</span>
                                  {icon}
                                </span>
                              );
                            })}
                          </>
                        )}
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
      <RestaurantDetails />
    </>
  );
};

export default BottomBar;
