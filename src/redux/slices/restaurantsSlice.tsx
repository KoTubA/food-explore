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
  visibleRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  isRestaurantDetailsOpen: boolean;
  snapPosition: number;
  snapPositionDetails: number;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurant: [],
  filteredRestaurants: [],
  visibleRestaurants: [],
  selectedRestaurant: null,
  isRestaurantDetailsOpen: false,
  snapPosition: 1,
  snapPositionDetails: 1,
  loading: true,
  error: null,
};

const restaurantsSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurant = action.payload;
    },
    setFilteredRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.filteredRestaurants = action.payload;
    },
    setvVisibleRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.visibleRestaurants = action.payload;
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRestaurant, setFilteredRestaurants, setvVisibleRestaurants, setSelectedRestaurant, closeRestaurantDetails, setSnapPosition, setSnapPositionDetails, setLoading, setError } = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
