import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  cuisine?: string[];
  foodCategories?: string[];
  dietaryStyles?: string[];
  price?: string;
  link?: string;
  googleMapsLink?: string;
  image?: { url: string };
  slug: string;
}

interface RestaurantState {
  restaurant: Restaurant[];
  filteredRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  isRestaurantDetailsOpen: boolean;
  snapPosition: number;
  snapPositionDetails: number;
}

const initialState: RestaurantState = {
  restaurant: [],
  filteredRestaurants: [],
  selectedRestaurant: null,
  isRestaurantDetailsOpen: false,
  snapPosition: 1,
  snapPositionDetails: 1,
};

const restaurantsSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurant = action.payload;
    },
    setFilteredRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.filteredRestaurants = action.payload; // Aktualizacja odfiltrowanych restauracji
    },
    setSelectedRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.selectedRestaurant = action.payload;
      state.isRestaurantDetailsOpen = true;
    },
    closeRestaurantDetails: (state) => {
      state.isRestaurantDetailsOpen = false;
      state.selectedRestaurant = null;
    },
    setSnapPosition: (state, action: PayloadAction<number>) => {
      state.snapPosition = action.payload;
    },
    setSnapPositionDetails: (state, action: PayloadAction<number>) => {
      state.snapPositionDetails = action.payload;
    },
  },
});

export const { setRestaurant, setFilteredRestaurants, setSelectedRestaurant, closeRestaurantDetails, setSnapPosition, setSnapPositionDetails } = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
