import React from "react";
import { Marker } from "react-map-gl";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { FaLocationDot } from "react-icons/fa6";

interface CustomMarkerProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ restaurant, onClick }) => {
  const selectedRestaurant = useSelector((state: RootState) => state.restaurants.selectedRestaurant);
  const getIcon = (type: string): string => {
    switch (type) {
      case "Kawiarnia":
        return "☕";
      case "Cukiernia":
        return "🍰";
      case "Lody":
        return "🍦";
      case "Piekarnia":
        return "🥖";
      case "Fast food":
        return "🍟";
      case "Pub":
        return "🍻";
      case "Bar":
        return "🍹";
      case "Restauracja":
        return "🍽️";
      case "Hamburgery":
        return "🍔";
      case "Pizza":
        return "🍕";
      case "Makaron":
        return "🍝";
      case "Ramen":
        return "🍜";
      case "Pączkaria":
        return "🍩";
      case "Śniadania":
        return "🥐";
      case "Strefa gastronomiczna":
        return "🥘";
      case "Kuchnia grecka":
        return "🇬🇷";
      case "Kuchnia meksykańska":
        return "🇲🇽";
      case "Kuchnia polska":
        return "🇵🇱";
      case "Kuchnia włoska":
        return "🇮🇹";
      case "Kuchnia turecka":
        return "🇹🇷";
      case "Kuchnia wietnamska":
        return "🇻🇳";
      case "Kuchnia japońska":
        return "🇯🇵";
      case "Kuchnia hiszpańska":
        return "🇪🇸";
      case "Kuchnia tajska":
        return "🇹🇭";
      case "Kuchnia bliskowschodnia":
        return "👳";
      case "Kuchnia europejska":
        return "🇪🇺";
      case "Kuchnia azjatycka":
        return "🌏";
      case "Kuchnia amerykańska":
        return "🇺🇸";
      default:
        return "🥪";
    }
  };

  const isSelected = selectedRestaurant?.id === restaurant.id;

  return (
    <Marker longitude={restaurant.lng} latitude={restaurant.lat} onClick={onClick} style={isSelected ? { zIndex: 10 } : { zIndex: 1 }}>
      {isSelected ? (
        <FaLocationDot className="text-secondaryYellow w-auto h-9 animate-bounceOnce" />
      ) : (
        <div className="w-9 h-9 bg-veryLightGray border-2 border-white rounded-full flex justify-center items-center shadow-md cursor-pointer animate-fadeIn">
          <span className="text-xl">{getIcon(restaurant.categories)}</span>
        </div>
      )}
    </Marker>
  );
};

export default CustomMarker;
