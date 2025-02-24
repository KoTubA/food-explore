import React from "react";
import Image from "next/image";
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
  const getIconSrc = (type: string): string => {
    switch (type) {
      case "Kawiarnia":
        return "/assets/svg/emoji/coffee.svg";
      case "Cukiernia":
        return "/assets/svg/emoji/cake.svg";
      case "Lody":
        return "/assets/svg/emoji/ice-cream.svg";
      case "Piekarnia":
        return "/assets/svg/emoji/bread.svg";
      case "Fast food":
        return "/assets/svg/emoji/fast-food.svg";
      case "Pub":
        return "/assets/svg/emoji/pub.svg";
      case "Bar":
        return "/assets/svg/emoji/bar.svg";
      case "Restauracja":
        return "/assets/svg/emoji/restaurant.svg";
      case "Hamburgery":
        return "/assets/svg/emoji/burger.svg";
      case "Pizza":
        return "/assets/svg/emoji/pizza.svg";
      case "Makaron":
        return "/assets/svg/emoji/pasta.svg";
      case "Ramen":
        return "/assets/svg/emoji/ramen.svg";
      case "Pączkaria":
        return "/assets/svg/emoji/donut.svg";
      case "Śniadania":
        return "/assets/svg/emoji/breakfast.svg";
      case "Strefa gastronomiczna":
        return "/assets/svg/emoji/food-zone.svg";
      case "Kuchnia grecka":
        return "/assets/svg/emoji/greek-cuisine.svg";
      case "Kuchnia meksykańska":
        return "/assets/svg/emoji/mexican-cuisine.svg";
      case "Kuchnia polska":
        return "/assets/svg/emoji/polish-cuisine.svg";
      case "Kuchnia włoska":
        return "/assets/svg/emoji/italian-cuisine.svg";
      case "Kuchnia turecka":
        return "/assets/svg/emoji/turkish-cuisine.svg";
      case "Kuchnia wietnamska":
        return "/assets/svg/emoji/vietnamese-cuisine.svg";
      case "Kuchnia japońska":
        return "/assets/svg/emoji/japanese-cuisine.svg";
      case "Kuchnia hiszpańska":
        return "/assets/svg/emoji/spanish-cuisine.svg";
      case "Kuchnia tajska":
        return "/assets/svg/emoji/thai-cuisine.svg";
      case "Kuchnia bliskowschodnia":
        return "/assets/svg/emoji/middle-eastern-cuisine.svg";
      case "Kuchnia europejska":
        return "/assets/svg/emoji/european-cuisine.svg";
      case "Kuchnia azjatycka":
        return "/assets/svg/emoji/asian-cuisine.svg";
      case "Kuchnia amerykańska":
        return "/assets/svg/emoji/american-cuisine.svg";
      default:
        return "/assets/svg/emoji/rest.svg";
    }
  };

  const isSelected = selectedRestaurant.data?.id === restaurant.id;

  return (
    <Marker longitude={restaurant.lng} latitude={restaurant.lat} onClick={onClick} style={isSelected ? { zIndex: 10 } : { zIndex: 1 }}>
      {isSelected ? (
        <FaLocationDot className="text-secondaryYellow w-auto h-9 animate-bounceOnce" />
      ) : (
        <div className="w-9 h-9 bg-veryLightGray border-2 border-white rounded-full flex justify-center items-center shadow-md cursor-pointer animate-fadeIn">
          <Image src={getIconSrc(restaurant.categories)} alt={restaurant.categories} width={24} height={24} className="object-contain" />
        </div>
      )}
    </Marker>
  );
};

export default CustomMarker;
