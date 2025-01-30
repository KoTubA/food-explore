import { useRef, useEffect, useState } from "react";
import { Map, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { RootState } from "@/src/redux/store";
import { setSelectedRestaurant, setFilteredRestaurants, setVisibleRestaurants, setLoading, setError, setSelectedLocation } from "@/src/redux/slices/restaurantsSlice";
import CustomMarker from "@/src/app/components/FoodMap/CustomMarker";
import useWindowSize from "@/src/hooks/useWindowSize";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

// Dynamically adjust zoom level based on screen width
const getZoomLevel = (zoom: number) => {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  if (screenWidth <= 768) {
    return zoom;
  } else if (screenWidth <= 1024) {
    return zoom + 1;
  } else {
    return zoom + 2;
  }
};

const FoodMap = () => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= 768;

  const dispatch = useDispatch();
  const filteredRestaurants = useSelector((state: RootState) => state.restaurants.filteredRestaurants);
  const visibleRestaurants = useSelector((state: RootState) => state.restaurants.visibleRestaurants);
  const selectedRestaurant = useSelector((state: RootState) => state.restaurants.selectedRestaurant);
  const snapPosition = useSelector((state: RootState) => state.restaurants.snapPosition);
  const snapPositionDetails = useSelector((state: RootState) => state.restaurants.snapPositionDetails);
  const isRestaurantDetailsOpen = useSelector((state: RootState) => state.restaurants.isRestaurantDetailsOpen);
  const selectedLocation = useSelector((state: RootState) => state.restaurants.selectedLocation);

  // Ref to store the latest snapPosition, snapPositionDetails, isRestaurantDetailsOpen
  const filteredRestaurantsRef = useRef(filteredRestaurants);
  const snapPositionRef = useRef(snapPosition);
  const snapPositionDetailsRef = useRef(snapPositionDetails);
  const isRestaurantDetailsOpenRef = useRef(isRestaurantDetailsOpen);
  const isLargeScreenRef = useRef(isLargeScreen);

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
    isLargeScreenRef.current = isLargeScreen;
  }, [isLargeScreen]);

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
                categories
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
    if (selectedRestaurant.data && mapInstance) {
      const markerPosition = mapInstance.project([selectedRestaurant.data.lng, selectedRestaurant.data.lat]);

      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;

      // Set vertical thresholds for large screens between 25% and 75% of the screen height
      const thresholdHeightLow = isLargeScreen ? screenHeight * 0.25 : screenHeight * 0.2;
      const thresholdHeightTop = isLargeScreen ? screenHeight * 0.75 : screenHeight * 0.4;

      // For large screens, adjust width thresholds to account for the 420px hidden area
      const thresholdWidthLow = isLargeScreen ? 420 + (screenWidth - 420) * 0.2 : screenWidth * 0.2;
      const thresholdWidthHigh = isLargeScreen ? 420 + (screenWidth - 420) * 0.8 : screenWidth * 0.8;

      // Check if the marker is outside the visible area of the screen
      const shouldCenter = markerPosition.y < thresholdHeightLow || markerPosition.y > thresholdHeightTop || markerPosition.x < thresholdWidthLow || markerPosition.x > thresholdWidthHigh;

      // Determine the zoom level based on whether the restaurant is from the URL or not
      const zoomLevel = selectedRestaurant.isFromUrl ? 15 : mapInstance.getZoom();

      // Determine the horizontal offset for large screens (420px hidden on the left)
      const offsetX = isLargeScreen ? 420 / 2 : 0;

      // For large screens, keep the marker centered vertically (no Y offset)
      const offsetY = isLargeScreen ? 0 : -screenHeight * 0.25;

      // If the marker is outside the screen or the restaurant is from the URL, perform centering and zoom
      if (shouldCenter || selectedRestaurant.isFromUrl) {
        mapInstance.easeTo({
          center: [selectedRestaurant.data.lng, selectedRestaurant.data.lat],
          zoom: zoomLevel,
          offset: [offsetX, offsetY],
          essential: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurant, mapInstance]);

  // const updateFilteredRestaurants = (useCustomHeight: boolean) => {
  //   if (!mapInstance) return;

  //   const bounds = mapInstance.getBounds();
  //   const screenHeight = window.innerHeight;

  //   // Use the correct snapPosition based on whether restaurant details are open
  //   const snapPositionToUse = isRestaurantDetailsOpenRef.current ? snapPositionDetailsRef.current : snapPositionRef.current;

  //   let bottomBarHeight = 0;
  //   if (!useCustomHeight) {
  //     if (snapPositionToUse === 1) bottomBarHeight = screenHeight * 0.5;
  //     if (snapPositionToUse === 2) bottomBarHeight = 86;
  //   }

  //   const adjustedSouthBound = mapInstance.unproject([0, screenHeight - bottomBarHeight]).lat;

  // const filtered = filteredRestaurantsRef.current.filter((restaurant) => {
  //   return restaurant.lng >= bounds.getWest() && restaurant.lng <= bounds.getEast() && restaurant.lat >= adjustedSouthBound && restaurant.lat <= bounds.getNorth();
  // });

  //   dispatch(setVisibleRestaurants(filtered));
  // };
  const updateFilteredRestaurants = (useCustomHeight: boolean) => {
    if (!mapInstance) return;

    const bounds = mapInstance.getBounds();
    const screenHeight = window.innerHeight;

    if (isLargeScreenRef.current) {
      // Obcinamy tylko do zakresu: left: 420px, right: 0, top: 0, bottom: 0
      const leftBound = mapInstance.unproject([420, 0]).lng;

      const filtered = filteredRestaurantsRef.current.filter((restaurant) => {
        return restaurant.lng >= leftBound && restaurant.lng <= bounds.getEast() && restaurant.lat >= bounds.getSouth() && restaurant.lat <= bounds.getNorth();
      });

      dispatch(setVisibleRestaurants(filtered));
    } else {
      const snapPositionToUse = isRestaurantDetailsOpenRef.current ? snapPositionDetailsRef.current : snapPositionRef.current;

      // Domyślne dolne ograniczenie dla wersji mobilnej
      let bottomBarHeight = 0;
      if (!useCustomHeight) {
        if (snapPositionToUse === 1) bottomBarHeight = screenHeight * 0.5;
        if (snapPositionToUse === 2) bottomBarHeight = 86;
      }

      const adjustedSouthBound = mapInstance.unproject([0, screenHeight - bottomBarHeight]).lat;
      // Standardowe filtrowanie dla urządzeń mobilnych
      const filtered = filteredRestaurantsRef.current.filter((restaurant) => {
        return restaurant.lng >= bounds.getWest() && restaurant.lng <= bounds.getEast() && restaurant.lat >= adjustedSouthBound && restaurant.lat <= bounds.getNorth();
      });

      dispatch(setVisibleRestaurants(filtered));
    }
  };

  useEffect(() => {
    if (mapInstance) {
      mapInstance.on("moveend", () => updateFilteredRestaurants(false)); // Trigger updateFilteredRestaurants only on moveend
      updateFilteredRestaurants(true); // Initial filtering on map load
    }

    return () => {
      if (mapInstance) {
        mapInstance.off("moveend", () => updateFilteredRestaurants(false));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  useEffect(() => {
    updateFilteredRestaurants(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRestaurants]);

  useEffect(() => {
    if (selectedLocation && mapInstance) {
      mapInstance.jumpTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 10,
      });
      setSelectedLocation(null);
    }
  }, [selectedLocation, mapInstance]);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedLocation && mapInstance) {
      const zoomLevel = getZoomLevel(selectedLocation.zoom);

      mapInstance.jumpTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: zoomLevel,
      });

      dispatch(setSelectedLocation(null));
    }
  }, [selectedLocation, mapInstance, dispatch]);

  const handleMarkerClick = (restaurant: Restaurant) => {
    dispatch(
      setSelectedRestaurant({
        data: restaurant,
        isFromUrl: false,
      })
    );
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
          longitude: 19.1451,
          latitude: 51.9194,
          zoom: getZoomLevel(4), // Dynamically adjust zoom based on screen width
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
