import React from "react";
import { Marker } from "react-map-gl";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { Restaurant } from "@/src/redux/slices/restaurantsSlice";

interface CustomMarkerProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ restaurant, onClick }) => {
  const selectedRestaurant = useSelector((state: RootState) => state.restaurants.selectedRestaurant);
  const getIcon = (type: string): string => {
    switch (type) {
      case "Cukiernia":
        return "🍰";
      case "Lody":
        return "🍦";
      case "Fast food":
        return "🍟";
      case "Piekarnia":
        return "🥖";
      case "Kawiarnia":
        return "☕";
      case "Bistro":
        return "🥗";
      case "Pub":
        return "🍻";
      case "Bar":
        return "🍹";
      case "Kanapki":
        return "🥪";
      case "Hamburgery":
        return "🍔";
      case "Naleśniki":
        return "🫓";
      case "Pizza":
        return "🍕";
      case "Makarony":
        return "🍝";
      case "Strefa gastronomiczna":
        return "🥘";
      default:
        return "🍽️";
    }
  };

  const isSelected = selectedRestaurant?.id === restaurant.id;

  return (
    <Marker longitude={restaurant.lng} latitude={restaurant.lat} onClick={onClick}>
      <div className={`w-9 h-9 bg-veryLightGray border-2 ${isSelected ? "border-secondaryYellow" : "border-white"} rounded-full flex justify-center items-center shadow-md cursor-pointer`}>
        <span className="text-xl">{getIcon(restaurant.type)}</span>
      </div>
    </Marker>
  );
};

export default CustomMarker;
