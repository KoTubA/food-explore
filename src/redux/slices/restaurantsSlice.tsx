import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
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
  selectedRestaurant: Restaurant | null;
  isRestaurantDetailsOpen: boolean;
  snapPosition: number;
}

const initialState: RestaurantState = {
  restaurant: [],
  selectedRestaurant: null,
  isRestaurantDetailsOpen: false,
  snapPosition: 1,
};

const restaurantsSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurant = action.payload;
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
  },
});

export const { setRestaurant, setSelectedRestaurant, closeRestaurantDetails, setSnapPosition } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
