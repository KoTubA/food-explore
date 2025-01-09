import { useRef, useEffect, useState } from "react";
import { Map, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { RootState } from "@/src/redux/store";
import { setSelectedRestaurant, setFilteredRestaurants } from "@/src/redux/slices/restaurantsSlice";
import CustomMarker from "@/src/app/components/FoodMap/CustomMarker";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const FoodMap = () => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const dispatch = useDispatch();
  const restaurants = useSelector((state: RootState) => state.restaurants.restaurant);
  const filteredRestaurants = useSelector((state: RootState) => state.restaurants.filteredRestaurants);
  const selectedRestaurant = useSelector((state: RootState) => state.restaurants.selectedRestaurant);
  const snapPosition = useSelector((state: RootState) => state.restaurants.snapPosition);

  // Ref to store the latest snapPosition
  const snapPositionRef = useRef(snapPosition);

  useEffect(() => {
    snapPositionRef.current = snapPosition; // Update ref whenever snapPosition changes
  }, [snapPosition]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const url = `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/master`;

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

        dispatch(setRestaurant(fieldsData));
      } catch (error) {
        console.error("Error fetching restaurants from Contentful:", error);
      }
    };

    fetchRestaurants();
  }, [dispatch]);

  useEffect(() => {
    if (selectedRestaurant && mapInstance) {
      const markerPosition = mapInstance.project([selectedRestaurant.lng, selectedRestaurant.lat]);

      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;

      const thresholdHeightLow = screenHeight * 0.2;
      const thresholdHeightTop = screenHeight * 0.4;

      const thresholdWidthLow = screenWidth * 0.2;
      const thresholdWidthHigh = screenWidth * 0.8;

      if (markerPosition.y < thresholdHeightLow || markerPosition.y > thresholdHeightTop || markerPosition.x < thresholdWidthLow || markerPosition.x > thresholdWidthHigh) {
        mapInstance.easeTo({
          center: [selectedRestaurant.lng, selectedRestaurant.lat],
          offset: [0, -screenHeight * 0.25],
          essential: true,
        });
      }
    }
  }, [selectedRestaurant, mapInstance]);

  const updateFilteredRestaurants = () => {
    if (!mapInstance) return;

    const bounds = mapInstance.getBounds();
    const screenHeight = window.innerHeight;

    // Use the latest snapPosition from ref
    let bottomBarHeight = 0;
    if (snapPositionRef.current === 1) bottomBarHeight = screenHeight * 0.5;
    if (snapPositionRef.current === 2) bottomBarHeight = 100;

    const adjustedSouthBound = mapInstance.unproject([0, screenHeight - bottomBarHeight]).lat;

    const filtered = restaurants.filter((restaurant) => {
      return restaurant.lng >= bounds.getWest() && restaurant.lng <= bounds.getEast() && restaurant.lat >= adjustedSouthBound && restaurant.lat <= bounds.getNorth();
    });

    dispatch(setFilteredRestaurants(filtered));
  };

  useEffect(() => {
    if (mapInstance) {
      mapInstance.on("moveend", updateFilteredRestaurants); // Trigger updateFilteredRestaurants only on moveend
      updateFilteredRestaurants(); // Initial filtering on map load
    }

    return () => {
      if (mapInstance) {
        mapInstance.off("moveend", updateFilteredRestaurants);
      }
    };
  }, [mapInstance]);

  const handleMarkerClick = (restaurant: Restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
  };

  const mapStyle = "https://tiles.openfreemap.org/styles/liberty";

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
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {filteredRestaurants.length > 0 && filteredRestaurants.map((restaurant, index) => <CustomMarker key={index} restaurant={restaurant} onClick={() => handleMarkerClick(restaurant)} />)}
      </Map>
    </div>
  );
};

export default FoodMap;
