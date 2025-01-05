import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type?: string;
  cuisine?: string;
  foodCategories?: string[];
  dietaryStyles?: string[];
  price?: string;
  link?: string;
  googleMapsLink?: string;
  image?: { url: string };
}

interface RestaurantState {
  restaurant: Restaurant[];
}

const initialState: RestaurantState = {
  restaurant: [],
};

const restaurantsSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurant = action.payload;
    },
  },
});

export const { setRestaurant } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
