import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
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
