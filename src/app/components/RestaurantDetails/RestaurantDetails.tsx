"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { setSelectedRestaurant, closeRestaurantDetails, setSnapPositionDetails } from "@/src/redux/slices/restaurantsSlice";
import { IoClose } from "react-icons/io5";
import { FaRegCopy, FaGoogle, FaSeedling, FaLeaf } from "react-icons/fa";
import { FaLocationDot, FaEarthAmericas, FaMoneyBills } from "react-icons/fa6";
import { LuWheatOff } from "react-icons/lu";
import { FiCheck } from "react-icons/fi";

const RestaurantDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const restaurantSlug = searchParams.get("restaurant");
  const dispatch = useDispatch();

  const detailsSheetRef = useRef<SheetRef>(null);
  const [copied, setCopied] = useState(false);

  const handleSnap = (snapIndex: number) => {
    dispatch(setSnapPositionDetails(snapIndex));
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const restaurants = useSelector((state: RootState) => state.restaurants.restaurant);
  const selectedRestaurant = useSelector((state: RootState) => state.restaurants.selectedRestaurant);
  const isRestaurantDetailsOpen = useSelector((state: RootState) => state.restaurants.isRestaurantDetailsOpen);
  const snapPositionDetails = useSelector((state: RootState) => state.restaurants.snapPositionDetails);

  useEffect(() => {
    // Check if the 'restaurant' parameter exists in the URL and if the restaurant list is available
    if (restaurantSlug && restaurants.length > 0) {
      const encodedSlug = restaurantSlug.replace(/ /g, "+");
      // Search for a restaurant by name or slug
      const selected = restaurants.find((res) => res.slug === encodedSlug || res.name === encodedSlug);

      if (selected) {
        dispatch(setSelectedRestaurant(selected));
      }
    }
  }, [restaurantSlug, dispatch, restaurants]);

  useEffect(() => {
    if (selectedRestaurant) {
      router.push(`?restaurant=${selectedRestaurant.slug}`);

      // Reset the sheet to snap point 1 when a new restaurant is selected
      if (detailsSheetRef.current) {
        detailsSheetRef.current.snapTo(1); // This ensures the sheet view resets to the middle position
      }
    }
  }, [selectedRestaurant, router]);

  const handleCloseDetails = () => {
    router.push(pathname);
    dispatch(closeRestaurantDetails());
  };

  return (
    <>
      <Sheet ref={detailsSheetRef} isOpen={isRestaurantDetailsOpen} onSnap={handleSnap} onClose={() => {}} snapPoints={[0.95, 0.5, 100]} initialSnap={snapPositionDetails}>
        <Sheet.Container>
          <Sheet.Header />
          {selectedRestaurant ? (
            <Sheet.Content style={{ paddingBottom: detailsSheetRef.current?.y }} key={selectedRestaurant.id}>
              <div className="flex flex-col px-4 pb-4 space-y-1">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-medium animate-fadeIn">{selectedRestaurant.name}</h2>
                  <div className="flex space-x-1">
                    <button onClick={handleCopyClick} className="w-6 h-6 p-[5px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition">
                      {copied ? <FiCheck className="text-primaryGreen" /> : <FaRegCopy size="100%" />}
                    </button>
                    {selectedRestaurant.googleMapsLink && (
                      <Link href={selectedRestaurant.googleMapsLink} target="_blank" rel="noopener noreferrer" className="w-6 h-6 p-[5px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition">
                        <FaGoogle size="100%" />
                      </Link>
                    )}
                    {selectedRestaurant.link && (
                      <Link href={selectedRestaurant.link} target="_blank" rel="noopener noreferrer" className="w-6 h-6 p-[5px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition">
                        <FaEarthAmericas size="100%" />
                      </Link>
                    )}
                    <button onClick={handleCloseDetails} className="w-6 h-6 p-[3px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition">
                      <IoClose size="100%" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-mediumGray flex items-center space-x-2 animate-fadeIn">
                  {selectedRestaurant.categories && (
                    <span className="flex items-center">
                      <span>{selectedRestaurant.categories}</span>
                    </span>
                  )}
                  {selectedRestaurant.price && (
                    <span className="flex items-center space-x-2">
                      <span>•</span>
                      <span>{selectedRestaurant.price}</span>
                    </span>
                  )}
                  {selectedRestaurant.dietaryStyles && selectedRestaurant.dietaryStyles.length > 0 && (
                    <>
                      {selectedRestaurant.dietaryStyles.map((category) => {
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
              </div>
              <Sheet.Scroller>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col px-4 space-y-4">
                    <div className="bg-lightGray flex items-center justify-center text-gray-500 font-bold text-2xl overflow-hidden relative rounded-xl " style={{ aspectRatio: "16 / 9" }}>
                      {selectedRestaurant.image ? <Image src={selectedRestaurant.image.url} alt={selectedRestaurant.name} className="object-cover animate-fadeIn" fill key={selectedRestaurant.image?.url} /> : <span>No media</span>}
                    </div>
                  </div>
                  <div className="flex flex-col text-mediumGray text-sm border-b border-lightGray">
                    <div className="flex items-center space-x-4 p-4 border-t border-lightGray">
                      <FaLocationDot className="text-secondaryYellow flex-shrink-0" />
                      {selectedRestaurant?.address ? <span>{selectedRestaurant.address}</span> : <span className="text-gray-500">Brak adresu</span>}
                    </div>
                    <div className="flex items-center space-x-4 p-4 border-t border-lightGray">
                      <FaMoneyBills className="text-secondaryYellow flex-shrink-0" />
                      {selectedRestaurant?.price ? <span>{selectedRestaurant.price}</span> : <span className="text-gray-500">Brak informacji o cenach</span>}
                    </div>
                    <Link href={selectedRestaurant?.link || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 border-t border-lightGray">
                      <FaEarthAmericas className="text-secondaryYellow flex-shrink-0" />
                      {selectedRestaurant?.link ? <span className="truncate underline">{selectedRestaurant.link}</span> : <span className="text-gray-500">Brak linku</span>}
                    </Link>
                    <Link href={selectedRestaurant?.googleMapsLink || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 border-t border-lightGray">
                      <FaGoogle className="text-secondaryYellow flex-shrink-0" />
                      {selectedRestaurant?.googleMapsLink ? <span className="truncate underline">{selectedRestaurant.googleMapsLink}</span> : <span className="text-gray-500 un">Brak linku</span>}
                    </Link>
                  </div>
                </div>
              </Sheet.Scroller>
            </Sheet.Content>
          ) : null}
        </Sheet.Container>
      </Sheet>
      {snapPositionDetails === 0 && <div className="fixed inset-0 w-full h-full bg-black/20 z-10"></div>}
    </>
  );
};

export default RestaurantDetails;
