"use client";

import { useEffect } from "react";
import { Map, NavigationControl, GeolocateControl, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { RootState } from "@/src/redux/store";
import { setSelectedRestaurant } from "@/src/redux/slices/restaurantsSlice";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const FoodMap = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state: RootState) => state.restaurants.restaurant);

  const setSelectedRestaurants = (restaurant: Restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
  };

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
        console.log(fieldsData);

        // Dispatch data to Redux store
        dispatch(setRestaurant(fieldsData));
      } catch (error) {
        console.error("Error fetching restaurants from Contentful:", error);
      }
    };

    fetchRestaurants();
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
