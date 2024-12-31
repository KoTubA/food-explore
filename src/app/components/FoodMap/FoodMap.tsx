"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map, NavigationControl, ScaleControl, FullscreenControl, GeolocateControl, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { setRestaurant, Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { restaurants as localRestaurants } from "@/src/data/restaurantsData";
import { RootState } from "@/src/redux/store";

const FoodMap = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state: RootState) => state.restaurants.restaurant);

  const [, setSelectedRestaurants] = useState<Restaurant | null>(null);

  useEffect(() => {
    // Import local restaurant data and dispatch it to Redux store
    try {
      dispatch(setRestaurant(localRestaurants));
    } catch (error) {
      console.error("Error loading local restaurants:", error);
    }
  }, [dispatch]);

  const mapStyle = "https://tiles.openfreemap.org/styles/liberty"; // URL to the OpenFreeMap style

  return (
    <div className="w-full h-full">
      <Map
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        initialViewState={{
          longitude: 19.944,
          latitude: 50.049,
          zoom: 11,
        }}
      >
        {/* Add navigation controls (zoom, rotate, etc.) */}
        <NavigationControl position="top-right" />
        <ScaleControl />
        <FullscreenControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Add markers for restaurants */}
        {restaurants.length > 0 &&
          restaurants.map((restaurant, index) => (
            <Marker
              key={index} // Unique key
              longitude={restaurant.lng}
              latitude={restaurant.lat}
              onClick={() => setSelectedRestaurants(restaurant)} // Set selected restaurant on click
            />
          ))}
      </Map>
    </div>
  );
};

export default FoodMap;
