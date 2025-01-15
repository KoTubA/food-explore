import { useRef, useEffect, useState } from "react";
import { Map, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { RootState } from "@/src/redux/store";
import { setSelectedRestaurant, setFilteredRestaurants, setVisibleRestaurants, setLoading, setError } from "@/src/redux/slices/restaurantsSlice";
import CustomMarker from "@/src/app/components/FoodMap/CustomMarker";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const FoodMap = () => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const dispatch = useDispatch();
  const filteredRestaurants = useSelector((state: RootState) => state.restaurants.filteredRestaurants);
  const visibleRestaurants = useSelector((state: RootState) => state.restaurants.visibleRestaurants);
  const selectedRestaurant = useSelector((state: RootState) => state.restaurants.selectedRestaurant);
  const snapPosition = useSelector((state: RootState) => state.restaurants.snapPosition);
  const snapPositionDetails = useSelector((state: RootState) => state.restaurants.snapPositionDetails);
  const isRestaurantDetailsOpen = useSelector((state: RootState) => state.restaurants.isRestaurantDetailsOpen);

  // Ref to store the latest snapPosition, snapPositionDetails, isRestaurantDetailsOpen
  const filteredRestaurantsRef = useRef(filteredRestaurants);
  const snapPositionRef = useRef(snapPosition);
  const snapPositionDetailsRef = useRef(snapPositionDetails);
  const isRestaurantDetailsOpenRef = useRef(isRestaurantDetailsOpen);

  useEffect(() => {
    filteredRestaurantsRef.current = filteredRestaurants;
  }, [filteredRestaurants]);

  useEffect(() => {
    snapPositionRef.current = snapPosition;
  }, [snapPosition]);

  useEffect(() => {
    snapPositionDetailsRef.current = snapPositionDetails;
  }, [snapPositionDetails]);

  useEffect(() => {
    isRestaurantDetailsOpenRef.current = isRestaurantDetailsOpen;
  }, [isRestaurantDetailsOpen]);

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
        dispatch(setFilteredRestaurants(fieldsData));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(setError("Wystąpił błąd podczas ładowania danych."));
      } finally {
        setIsDataLoaded(true);
      }
    };

    fetchRestaurants();
  }, [dispatch]);

  // Map loading effect
  useEffect(() => {
    if (isMapLoaded && isDataLoaded) {
      dispatch(setLoading(false)); // Set loading to false only when both data and map are loaded
    }
  }, [isMapLoaded, isDataLoaded, dispatch]);

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

  const updateFilteredRestaurants = (useCustomHeight = false) => {
    if (!mapInstance) return;

    const bounds = mapInstance.getBounds();
    const screenHeight = window.innerHeight;

    // Use the correct snapPosition based on whether restaurant details are open
    const snapPositionToUse = isRestaurantDetailsOpenRef.current ? snapPositionDetailsRef.current : snapPositionRef.current;

    let bottomBarHeight = 0;
    if (!useCustomHeight) {
      if (snapPositionToUse === 1) bottomBarHeight = screenHeight * 0.5;
      if (snapPositionToUse === 2) bottomBarHeight = 100;
    }

    const adjustedSouthBound = mapInstance.unproject([0, screenHeight - bottomBarHeight]).lat;

    const filtered = filteredRestaurantsRef.current.filter((restaurant) => {
      return restaurant.lng >= bounds.getWest() && restaurant.lng <= bounds.getEast() && restaurant.lat >= adjustedSouthBound && restaurant.lat <= bounds.getNorth();
    });

    dispatch(setVisibleRestaurants(filtered));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  useEffect(() => {
    updateFilteredRestaurants(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRestaurants]);

  const handleMarkerClick = (restaurant: Restaurant) => {
    dispatch(setSelectedRestaurant(restaurant));
  };

  const mapStyle = "https://tiles.openfreemap.org/styles/liberty";

  return (
    <div className="w-full h-full">
      <Map
        onLoad={(e) => {
          setMapInstance(e.target);
          setIsMapLoaded(true);
        }}
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

        {visibleRestaurants.length > 0 && visibleRestaurants.map((restaurant) => <CustomMarker key={restaurant.id} restaurant={restaurant} onClick={() => handleMarkerClick(restaurant)} />)}
      </Map>
    </div>
  );
};

export default FoodMap;
