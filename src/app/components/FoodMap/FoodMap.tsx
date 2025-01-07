"use client";

import { useEffect, useState } from "react";
import { Map, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { RootState } from "@/src/redux/store";
import { setSelectedRestaurant } from "@/src/redux/slices/restaurantsSlice";
import CustomMarker from "@/src/app/components/FoodMap/CustomMarker";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const FoodMap = () => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const dispatch = useDispatch();
  const restaurants = useSelector((state: RootState) => state.restaurants.restaurant);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // GraphQL API URL for fetching restaurants
        const url = `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/master`;

        // Define the GraphQL query
        const query = `
          query {
            foodExpoCollection(order: [id_ASC], limit: 500) {
              items {
                id
                name
                address
                lat
                lng
                image {
                  url
                }
                type
                cuisine
                foodCategories
                dietaryStyles
                price
                link
                googleMapsLink
                slug
              }
            }
          }
        `;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        const fieldsData = data.data.foodExpoCollection.items;

        // Dispatch data to Redux store
        dispatch(setRestaurant(fieldsData));
      } catch (error) {
        console.error("Error fetching restaurants from Contentful:", error);
      }
    };

    fetchRestaurants();
  }, [dispatch]);

  const handleMarkerClick = (restaurant: Restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));

    if (mapInstance) {
      const markerPosition = mapInstance.project([restaurant.lng, restaurant.lat]);

      // Calculate screen height and width (used to determine where the marker is positioned)
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;

      // Define thresholds for height (20% and 40% for vertical positioning)
      const thresholdHeightLow = screenHeight * 0.2; // 20% height of the screen
      const thresholdHeightTop = screenHeight * 0.4; // 80% height of the screen

      // Define thresholds for width (20% and 80% for horizontal positioning)
      const thresholdWidthLow = screenWidth * 0.2; // 20% width of the screen
      const thresholdWidthHigh = screenWidth * 0.8; // 80% width of the screen

      // If the marker is outside the 20% to 80% horizontal and vertical ranges, adjust the map
      if (markerPosition.y < thresholdHeightLow || markerPosition.y > thresholdHeightTop || markerPosition.x < thresholdWidthLow || markerPosition.x > thresholdWidthHigh) {
        mapInstance.easeTo({
          center: [restaurant.lng, restaurant.lat], // Keep the center of the map on the restaurant's coordinates
          offset: [
            0, // Center horizontally based on marker's width
            -screenHeight * 0.1, // Move the map up by 10% of the screen height to position marker at 40%
          ],
          essential: true,
        });
      }
    }
  };

  const mapStyle = "https://tiles.openfreemap.org/styles/liberty"; // URL to the OpenFreeMap style

  return (
    <div className="w-full h-full">
      <Map
        onLoad={(e) => setMapInstance(e.target)}
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
        <GeolocateControl position="top-right" />

        {/* Add markers for restaurants */}
        {restaurants.length > 0 &&
          restaurants.map((restaurant, index) => (
            <CustomMarker
              key={index} // Unique key
              restaurant={restaurant}
              onClick={() => handleMarkerClick(restaurant)} // Set selected restaurant on click
            />
          ))}
      </Map>
    </div>
  );
};

export default FoodMap;
