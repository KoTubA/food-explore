"use client";

import { Sheet, type SheetRef } from "react-modal-sheet";
import { useState, useRef } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { RootState } from "@/src/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setSnapPosition, setFilterModalOpen, setSearchQuery, removeActiveFilter } from "@/src/redux/slices/restaurantsSlice";
import RestaurantDetails from "@/src/app/components/RestaurantDetails/RestaurantDetails";
import FilterModal from "@/src/app/components/FilterModal/FilterModal";
import { IoSearchOutline } from "react-icons/io5";
import { AutoSizer, List, ListRowRenderer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import { FaSeedling, FaLeaf } from "react-icons/fa";
import { LuWheatOff } from "react-icons/lu";
import { Restaurant } from "@/src/redux/slices/restaurantsSlice";
import { setSelectedRestaurant } from "@/src/redux/slices/restaurantsSlice";
import { CiImageOff } from "react-icons/ci";

const snapPoints = [0.95, 0.5, 86];

interface ScrollParams {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}

interface GridWithContainer {
  _scrollingContainer?: HTMLDivElement;
}

const BottomBar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.restaurants.searchQuery);
  const visibleRestaurants = useSelector((state: RootState) => state.restaurants.visibleRestaurants);
  const isRestaurantDetailsOpen = useSelector((state: RootState) => state.restaurants.isRestaurantDetailsOpen);
  const snapPosition = useSelector((state: RootState) => state.restaurants.snapPosition);
  const loading = useSelector((state: RootState) => state.restaurants.loading);
  const error = useSelector((state: RootState) => state.restaurants.error);
  const activeFilters = useSelector((state: RootState) => state.restaurants.activeFilters);

  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [disableDrag, setDisableDrag] = useState(false);
  const listRef = useRef<List>(null);
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 300,
    })
  );

  const listSheetRef = useRef<SheetRef>(null);
  const snapToList = (i: number) => {
    dispatch(setSnapPosition(i));
    listSheetRef.current?.snapTo(i);
  };

  // Calculating the number of active filters
  const activeFilterCount = Object.entries(activeFilters).reduce((count, [, value]) => {
    if (Array.isArray(value)) {
      return count + (value.length > 0 ? 1 : 0);
    } else {
      return count + (value ? 1 : 0);
    }
  }, 0);

  // Details of selected filters
  const selectedCategories = activeFilters.categories?.length || 0;
  const selectedPrices = activeFilters.price?.length || 0;
  const dietStyleSelected = !!activeFilters.dietStyle;

  const handleScroll = (params: ScrollParams) => {
    const scrollTop = params.scrollTop;
    if (scrollTop === 0 && snapPosition === 0) {
      setDisableDrag(false);
    } else if (snapPosition === 0) {
      setDisableDrag(true);
    }
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));

    if (listRef.current) {
      const firstRowOffset = listRef.current.getOffsetForRow({ index: 0 });

      if (firstRowOffset !== 0) {
        listRef.current.scrollToRow(0);
      }
    }
  };

  // Handles form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    snapToList(1);
    inputRef.current?.blur();
    setInputFocused(false);
  };

  // Clears the search query and restores all restaurants.
  const handleClearSearch = () => {
    dispatch(setSearchQuery(""));

    // // Focus the input after clearing
    // if (snapPosition === 0 && inputRef.current) {
    //   inputRef.current.focus();
    // } else {
    //   setInputFocused(false);
    // }
  };

  // Handle canceling the search
  const handleCancelSearch = () => {
    dispatch(setSearchQuery("")); // Reset search query
    snapToList(1); // Snap to position 1
    setInputFocused(false);
  };

  // Function handling onBlur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If the related target is the clear button, prevent onBlur logic
    if ((e.relatedTarget as HTMLElement)?.id === "clear-button") return;
    setTimeout(() => setInputFocused(false), 100);
  };

  const handleSnap = (index: number) => {
    // When restaurant details are opened (isRestaurantDetailsOpen === true),
    // the sheet closes, triggering onSnap with the highest snap value.
    // Avoid saving this value to preserve the previous snap position.
    if (!isRestaurantDetailsOpen) {
      dispatch(setSnapPosition(index));
    }

    const grid = listRef.current?.Grid as GridWithContainer;

    const scrollTop = grid?._scrollingContainer?.scrollTop || 0;

    if (index !== 0) {
      setDisableDrag(false);
    } else if (index === 0 && scrollTop != 0) {
      setDisableDrag(true);
    }
  };

  const openFilterModal = () => {
    dispatch(setFilterModalOpen(true));
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    dispatch(
      setSelectedRestaurant({
        data: restaurant,
        isFromUrl: false,
      })
    );
  };

  const handleResize = () => {
    // Clear cache for all rows when the width changes.
    cache.current.clearAll();
  };

  const Row: ListRowRenderer = ({ index, style, key, parent }) => (
    <CellMeasurer key={key} cache={cache.current} parent={parent} columnIndex={0} rowIndex={index}>
      <div style={style} className="flex flex-col space-y-4 border-b border-lightGray px-4 py-4 first:pt-0 last:border-0 cursor-pointer animate-fadeIn" onClick={() => handleSelectRestaurant(visibleRestaurants[index])}>
        <div className="bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl overflow-hidden relative rounded-xl" style={{ aspectRatio: "16 / 9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {visibleRestaurants[index].image ? <img src={visibleRestaurants[index].image.url} alt={visibleRestaurants[index].name} className="object-cover animate-fadeIn w-full h-auto" /> : <CiImageOff size={"2rem"} />}
        </div>
        <div className="flex flex-col space-y-1">
          <h4 className="text-xl font-light">{visibleRestaurants[index].name}</h4>
          <div className="text-sm text-mediumGray flex items-center space-x-2">
            {visibleRestaurants[index].categories && (
              <span className="flex items-center">
                <span>{visibleRestaurants[index].categories}</span>
              </span>
            )}
            {visibleRestaurants[index].price && (
              <span className="flex items-center space-x-2">
                <span>•</span>
                <span>{visibleRestaurants[index].price}</span>
              </span>
            )}
            {visibleRestaurants[index].dietaryStyles &&
              visibleRestaurants[index].dietaryStyles.length > 0 &&
              visibleRestaurants[index].dietaryStyles.map((category) => {
                let icon;
                switch (category) {
                  case "Wegetariańska":
                    icon = <FaLeaf className="text-primaryGreen" />;
                    break;
                  case "Wegańska":
                    icon = <FaSeedling className="text-primaryGreen" />;
                    break;
                  case "Bezglutenowa":
                    icon = <LuWheatOff className="text-primaryRed" />;
                    break;
                  default:
                    icon = null;
                }

                return (
                  <span key={category} className="flex items-center space-x-2">
                    <span>•</span>
                    {icon}
                  </span>
                );
              })}
          </div>
        </div>
      </div>
    </CellMeasurer>
  );

  return (
    <>
      <Sheet ref={listSheetRef} isOpen={!isRestaurantDetailsOpen} onClose={() => {}} snapPoints={snapPoints} initialSnap={snapPosition} onSnap={handleSnap}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: listSheetRef.current?.y }} disableDrag={disableDrag}>
            <div className="flex items-center space-x-3 px-4 pb-4">
              <div className="relative flex items-center flex-grow bg-veryLightGray rounded-lg px-4 py-2 border-lightGray border">
                <form className="w-full flex" onSubmit={handleFormSubmit} action="">
                  <IoSearch className="text-mediumGray" />
                  <input
                    ref={inputRef}
                    type="search"
                    placeholder="Wyszukaj tutaj"
                    className="bg-transparent flex-grow pl-2 pr-4 text-sm text-mediumGray font-medium outline-none"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                      snapToList(0);
                      setInputFocused(true);
                    }}
                    onBlur={handleBlur}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </form>
                {/* Button to clear the search input */}
                {searchQuery && (
                  <button id="clear-button" className="absolute right-2 w-5 h-5 p-[2px] flex items-center justify-center bg-lightGray text-mediumGray rounded-full hover:bg-mediumGray/30 transition" onClick={handleClearSearch}>
                    <IoClose size="100%" />
                  </button>
                )}
              </div>

              {/* Cancel button */}
              <button className={`justify-center items-center min-w-10 h-10 rounded-lg shadow-sm ${inputFocused ? "flex" : "hidden"}`} onClick={handleCancelSearch}>
                <span className="text-darkGray">Anuluj</span>
              </button>

              {/* Filter button */}
              <button className={`relative justify-center items-center bg-secondaryYellow w-10 h-10 rounded-lg shadow-sm ${inputFocused ? "hidden" : "flex"}`} onClick={openFilterModal}>
                <FiFilter className="text-white" />
                {activeFilterCount > 0 && <span className="absolute top-0 right-0 bg-primaryRed text-white text-xs w-5 h-5 rounded-full flex items-center justify-center translate-x-[50%] translate-y-[-50%]">{activeFilterCount}</span>}
              </button>
            </div>
            {/* Szczegóły aktywnych filtrów */}
            {activeFilterCount > 0 && (
              <div className="flex px-4 pb-3 gap-2">
                {/* Kategoria */}
                {selectedCategories && selectedCategories === 1 ? (
                  <button className={`flex items-center gap-2 px-3 py-[6px] rounded-2xl capitalize font-medium text-xs bg-secondaryYellow text-white`} onClick={() => dispatch(removeActiveFilter({ filterType: "categories" }))}>
                    <span>{activeFilters.categories[0]}</span>
                    <IoClose />
                  </button>
                ) : selectedCategories && selectedCategories > 1 ? (
                  <button className={`flex items-center gap-2 px-3 py-[6px] rounded-2xl capitalize font-medium text-xs bg-secondaryYellow text-white`} onClick={() => dispatch(removeActiveFilter({ filterType: "categories" }))}>
                    <span>{selectedCategories} Kategorie</span>
                    <IoClose />
                  </button>
                ) : null}

                {/* Cena */}
                {selectedPrices && selectedPrices === 1 ? (
                  <button className={`flex items-center gap-2 px-3 py-[6px] rounded-2xl capitalize font-medium text-xs bg-secondaryYellow text-white`} onClick={() => dispatch(removeActiveFilter({ filterType: "price" }))}>
                    <span>{activeFilters.price[0]}</span>
                    <IoClose />
                  </button>
                ) : selectedPrices && selectedPrices > 1 ? (
                  <button className={`flex items-center gap-2 px-3 py-[6px] rounded-2xl capitalize font-medium text-xs bg-secondaryYellow text-white`} onClick={() => dispatch(removeActiveFilter({ filterType: "price" }))}>
                    <span>{selectedPrices} Ceny</span>
                    <IoClose />
                  </button>
                ) : null}

                {/* Diet Style */}
                {dietStyleSelected ? (
                  <button className={`flex items-center gap-2 px-3 py-[6px] rounded-2xl capitalize font-medium text-xs bg-secondaryYellow text-white`} onClick={() => dispatch(removeActiveFilter({ filterType: "dietStyle" }))}>
                    <span>{activeFilters.dietStyle}</span>
                    <IoClose />
                  </button>
                ) : null}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center text-sm py-8">
                <div role="status" className="text-secondaryYellow">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-secondaryYellow" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex justify-center items-center text-sm py-8">
                <div className="text-primaryRed text-center">{error}</div>
              </div>
            )}

            {!loading && !error && (
              <>
                {visibleRestaurants.length > 0 ? (
                  <div className="w-full h-full flex flex-auto">
                    <AutoSizer onResize={handleResize}>
                      {({ width, height }) => (
                        <List
                          ref={listRef}
                          height={height}
                          width={width}
                          rowCount={visibleRestaurants.length}
                          rowHeight={cache.current.rowHeight}
                          className="list-container"
                          deferredMeasurementCache={cache.current}
                          rowRenderer={Row}
                          onScroll={handleScroll}
                          style={{
                            overflowX: "hidden",
                            overflowY: snapPosition === 0 ? "auto" : "hidden",
                          }}
                        />
                      )}
                    </AutoSizer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 gap-4">
                    <IoSearchOutline className="text-mediumGray" size={"3rem"} />
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-darkGray font-medium">Brak wyników</p>
                      <span className="text-mediumGray text-xs">Spróbuj innego wyszukiwania</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
      {snapPosition === 0 && !isRestaurantDetailsOpen && <div className="fixed inset-0 w-full h-full bg-black/20 z-10"></div>}
      <RestaurantDetails />
      <FilterModal />
    </>
  );
};

export default BottomBar;
