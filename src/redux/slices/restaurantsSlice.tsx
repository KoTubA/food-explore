import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  categories: string;
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
  isFilterModalOpen: boolean;
  snapPosition: number;
  snapPositionDetails: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeFilters: {
    dietStyle: string | null;
    categories: string[];
    price: string | null;
  };
}

const initialState: RestaurantState = {
  restaurant: [],
  filteredRestaurants: [],
  visibleRestaurants: [],
  selectedRestaurant: null,
  isRestaurantDetailsOpen: false,
  isFilterModalOpen: false,
  snapPosition: 1,
  snapPositionDetails: 1,
  loading: true,
  error: null,
  searchQuery: "",
  activeFilters: {
    dietStyle: null,
    categories: [],
    price: null,
  },
};

const restaurantsSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurant = action.payload;
    },
    setFilteredRestaurants: (state) => {
      const { restaurant, searchQuery, activeFilters } = state;

      // Filter by search query
      const searchFiltered = searchQuery.trim() ? restaurant.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())) : restaurant;

      // Apply additional filters
      const fullyFiltered = searchFiltered.filter((r) => {
        // Dietary style filter
        if (activeFilters.dietStyle && !r.dietaryStyles?.includes(activeFilters.dietStyle)) {
          return false;
        }

        // Food categories filter
        if (activeFilters.categories.length > 0 && !activeFilters.categories.some((category) => r.categories?.includes(category))) {
          return false;
        }

        // Price filter
        if (activeFilters.price && r.price !== activeFilters.price) {
          return false;
        }

        return true;
      });

      state.filteredRestaurants = fullyFiltered;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      restaurantsSlice.caseReducers.setFilteredRestaurants(state); // Trigger filtering
    },
    setActiveFilters: (state, action: PayloadAction<RestaurantState["activeFilters"]>) => {
      state.activeFilters = action.payload;
      restaurantsSlice.caseReducers.setFilteredRestaurants(state); // Trigger filtering
    },
    resetFilters: (state) => {
      state.activeFilters = {
        dietStyle: null,
        categories: [],
        price: null,
      };
      restaurantsSlice.caseReducers.setFilteredRestaurants(state); // Trigger filtering after reset
    },
    setVisibleRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
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
    setFilterModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterModalOpen = action.payload;
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

export const { setRestaurant, setFilteredRestaurants, setVisibleRestaurants, setSelectedRestaurant, closeRestaurantDetails, setFilterModalOpen, setSnapPosition, setSnapPositionDetails, setLoading, setError, setSearchQuery, setActiveFilters, resetFilters } = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
