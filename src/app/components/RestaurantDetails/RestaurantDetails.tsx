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
import { CiImageOff } from "react-icons/ci";
import useWindowSize from "@/src/hooks/useWindowSize";

const RestaurantDetails = () => {
  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= 768;

  const snapPoints = isLargeScreen ? [1] : [0.95, 0.5, 86];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const restaurantSlug = searchParams.get("restaurant");
  const dispatch = useDispatch();
  // Tracks if the effect has run once, ensuring the logic only executes when the slug is set for the first time
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [copied, setCopied] = useState(false);
  const detailsSheetRef = useRef<SheetRef>(null);

  const snapToList = (i: number) => {
    detailsSheetRef.current?.snapTo(i);
  };

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
  const selectedRestaurant = useSelector((state: RootState) => state.restaurants.selectedRestaurant.data);
  const isRestaurantDetailsOpen = useSelector((state: RootState) => state.restaurants.isRestaurantDetailsOpen);
  const snapPositionDetails = useSelector((state: RootState) => state.restaurants.snapPositionDetails);

  useEffect(() => {
    // If either restaurantSlug or selectedRestaurant exists, proceed with the logic
    if (selectedRestaurant || restaurantSlug) {
      // If there's no restaurantSlug (i.e., back navigation), close restaurant details and return
      if (!restaurantSlug) {
        dispatch(closeRestaurantDetails());
        return;
      }

      // Encode the slug to ensure it matches the expected format
      const encodedSlug = encodeURIComponent(restaurantSlug.trim()).replace(/%20/g, "+");

      // Find the restaurant that matches the encoded slug or name
      const selected = restaurants.find((res) => res.slug === encodedSlug || res.name === encodedSlug);

      if (selected) {
        // Dispatch the selected restaurant data, setting `isFromUrl` flag based on initial load
        dispatch(
          setSelectedRestaurant({
            data: selected,
            isFromUrl: isInitialLoad, // `true` for initial load, `false` for navigation (via user action)
          })
        );
      }
    }

    // Set the initial load flag to false after the first render
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantSlug, restaurants]);

  useEffect(() => {
    if (isLargeScreen) {
      dispatch(setSnapPositionDetails(0));
    }
  }, [isLargeScreen, dispatch]);

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
      <Sheet
        ref={detailsSheetRef}
        isOpen={isRestaurantDetailsOpen}
        onSnap={handleSnap}
        onClose={() => {
          snapToList(2);
        }}
        snapPoints={snapPoints}
        initialSnap={isLargeScreen ? 0 : snapPositionDetails}
        {...(isLargeScreen ? { disableDrag: true } : {})}
      >
        <Sheet.Container>
          <Sheet.Header className={`${!isLargeScreen ? "block" : "hidden"}`} />
          {selectedRestaurant ? (
            <Sheet.Content style={{ paddingBottom: detailsSheetRef.current?.y }} key={selectedRestaurant.id}>
              <div className="flex flex-col px-4 pb-4 md:pt-4 gap-y-1">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-medium animate-fadeIn">{selectedRestaurant.name}</h2>
                  <div className="flex gap-x-1 ml-1">
                    <button onClick={handleCopyClick} title={copied ? "Skopiowano!" : "Skopiuj adres"} className="w-6 h-6 p-[5px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition">
                      {copied ? <FiCheck className="text-primaryGreen" /> : <FaRegCopy size="100%" />}
                    </button>
                    {selectedRestaurant.googleMapsLink && (
                      <Link href={selectedRestaurant.googleMapsLink} target="_blank" rel="noopener noreferrer" title="Otwórz w Google Maps" className="w-6 h-6 p-[5px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition">
                        <FaGoogle size="100%" />
                      </Link>
                    )}
                    {selectedRestaurant.link && (
                      <Link href={selectedRestaurant.link} target="_blank" rel="noopener noreferrer" title="Przejdź do strony restauracji" className="w-6 h-6 p-[5px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition">
                        <FaEarthAmericas size="100%" />
                      </Link>
                    )}
                    <button onClick={handleCloseDetails} title="Zamknij" className="w-6 h-6 p-[3px] flex items-center justify-center bg-secondaryYellow text-white rounded-full hover:bg-secondaryYellowLight transition">
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
              <div className={`flex flex-col h-full ${isLargeScreen ? "overflow-y-auto" : snapPositionDetails === 0 ? "overflow-y-auto" : "overflow-hidden"}`}>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col px-4 space-y-4">
                    <div className="bg-lightGray flex items-center justify-center text-gray-500 font-bold text-xl overflow-hidden relative rounded-xl " style={{ aspectRatio: "16 / 9" }}>
                      {selectedRestaurant.image ? <Image src={selectedRestaurant.image.url} alt={selectedRestaurant.name} className="object-cover animate-fadeIn" fill key={selectedRestaurant.image?.url} /> : <CiImageOff size={"2rem"} />}
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
              </div>
            </Sheet.Content>
          ) : null}
        </Sheet.Container>
      </Sheet>
      {snapPositionDetails === 0 && isRestaurantDetailsOpen && <div className="fixed inset-0 w-full h-full bg-black/20 z-10 md:hidden"></div>}
    </>
  );
};

export default RestaurantDetails;
