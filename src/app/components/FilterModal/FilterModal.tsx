import { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { RootState } from "@/src/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setFilterModalOpen, setActiveFilters, resetFilters } from "@/src/redux/slices/restaurantsSlice";
import { IoChevronBack } from "react-icons/io5";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import useWindowSize from "@/src/hooks/useWindowSize";

const FilterModal = () => {
  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= 768;

  const filters = useSelector((state: RootState) => state.restaurants.activeFilters);

  const [expandedSections, setExpandedSections] = useState({
    categories: false,
  });
  const [localFilters, setLocalFilters] = useState({
    city: null,
    dietStyle: filters.dietStyle,
    categories: filters.categories,
    price: filters.price,
  });

  const toggleSection = (section: "categories") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const dispatch = useDispatch();
  const { isFilterModalOpen } = useSelector((state: RootState) => state.restaurants);

  // Zaktualizowanie lokalnych filtrów na globalne filtry przy otwarciu modalu
  useEffect(() => {
    if (isFilterModalOpen) {
      setLocalFilters({
        city: null,
        dietStyle: filters.dietStyle,
        categories: filters.categories,
        price: filters.price,
      });
    }
  }, [isFilterModalOpen, filters]);

  const closeModal = () => {
    // Przywrócenie lokalnych filtrów do wartości globalnych, jeśli nie zostały zaakceptowane
    setLocalFilters({
      city: null,
      dietStyle: filters.dietStyle,
      categories: filters.categories,
      price: filters.price,
    });

    dispatch(setFilterModalOpen(false));
  };

  const handleFilterChange = (key: keyof typeof localFilters, value: string) => {
    if (key === "categories" || key === "price") {
      // Allow multiple selections for categories and price
      const isActive = localFilters[key]?.includes(value);
      const updatedFilters = isActive ? localFilters[key].filter((item) => item !== value) : [...localFilters[key], value];

      setLocalFilters({
        ...localFilters,
        [key]: updatedFilters,
      });
    } else {
      // Single selection for dietStyle
      const updatedFilter = localFilters[key] === value ? null : value;
      setLocalFilters({
        ...localFilters,
        [key]: updatedFilter,
      });
    }
  };

  const isFilterActive = (key: keyof typeof localFilters, value: string) => {
    if (key === "categories" || key === "price") {
      return localFilters[key]?.includes(value);
    }
    return localFilters[key] === value;
  };

  const applyFilters = () => {
    dispatch(setActiveFilters(localFilters)); // Zaktualizowanie aktywnych filtrów w Redux
    closeModal();
  };

  const resetLocalFilters = () => {
    setLocalFilters({
      city: null,
      dietStyle: null,
      categories: [],
      price: [],
    });
  };

  return (
    <>
      <Sheet isOpen={isFilterModalOpen} onClose={closeModal} {...(isLargeScreen ? { disableDrag: true } : {})}>
        <Sheet.Container>
          <Sheet.Content className="relative">
            <div className="w-full flex items-center justify-center px-4 py-6 relative">
              <IoChevronBack onClick={closeModal} className="absolute left-4 cursor-pointer" />
              <h2 className="font-bold">Znajdź rekomendacje</h2>
            </div>
            <Sheet.Scroller className="flex flex-col pb-[76px] mb-4">
              {/* Styl diety */}
              <div className="flex flex-col gap-4 px-4 pt-2 pb-6 border-b border-lightGray">
                <div className="flex justify-between items-center font-light text-darkGray">
                  <h3 className="uppercase">Styl diety</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Bezglutenowa", "Wegetariańska", "Wegańska"].map((diet) => (
                    <button key={diet} onClick={() => handleFilterChange("dietStyle", diet)} className={`px-3 py-[6px] rounded-2xl capitalize font-medium text-xs border-2 ${isFilterActive("dietStyle", diet) ? "text-secondaryYellow border-secondaryYellow" : "text-mediumGray border-mediumGray"}`}>
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kategorie */}
              <div className="flex flex-col px-4 pt-6 border-b border-lightGray">
                <div className="flex justify-between items-center font-light text-darkGray pb-4">
                  <h3 className="uppercase">Kategorie</h3>
                </div>
                <div className={`relative overflow-hidden ${expandedSections.categories ? "h-auto" : "h-44"}`}>
                  <div className="flex flex-wrap gap-2">
                    {["Kawiarnia", "Cukiernia", "Lody", "Piekarnia", "Fast food", "Pub", "Bar", "Restauracja", "Hamburgery", "Pizza", "Makaron", "Ramen", "Pączkaria", "Śniadania", "Strefa gastronomiczna", "Kuchnia grecka", "Kuchnia meksykańska", "Kuchnia polska", "Kuchnia włoska", "Kuchnia turecka", "Kuchnia wietnamska", "Kuchnia japońska", "Kuchnia hiszpańska", "Kuchnia tajska", "Kuchnia bliskowschodnia", "Kuchnia europejska", "Kuchnia azjatycka", "Kuchnia amerykańska"].map((type) => (
                      <button key={type} onClick={() => handleFilterChange("categories", type)} className={`px-3 py-[6px] rounded-2xl capitalize font-medium text-xs ${isFilterActive("categories", type) ? "bg-secondaryYellow text-white" : "bg-secondaryYellow/15 text-secondaryYellow"}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                  {!expandedSections.categories && <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>}
                </div>
                <div className="flex justify-center items-center overflow-hidden h-12">
                  <button className="flex items-center justify-center whitespace-nowrap text-brand font-medium text-sm text-secondaryYellow" type="button" onClick={() => toggleSection("categories")}>
                    <span className="mr-2">{expandedSections.categories ? <FaCircleMinus /> : <FaCirclePlus />}</span>
                    {expandedSections.categories ? "Zwiń filtry" : "Zobacz wszystkie filtry"}
                  </button>
                </div>
              </div>

              {/* Cena */}
              <div className="flex flex-col gap-4 px-4 py-6">
                <div className="flex justify-between items-center font-light text-darkGray">
                  <h3 className="uppercase">Cena</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["1–20 zł", "20–40 zł", "40–60 zł", "$", "$$", "$$$"].map((price) => (
                    <button key={price} onClick={() => handleFilterChange("price", price)} className={`px-3 py-[6px] rounded-2xl capitalize font-medium text-xs ${isFilterActive("price", price) ? "bg-secondaryYellow text-white" : "bg-secondaryYellow/15 text-secondaryYellow"}`}>
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </Sheet.Scroller>

            {/* Zamknij modal */}
            <div className="flex items-center justify-center gap-3 absolute bottom-0 left-0 right-0 w-full p-4 z-10 bg-white">
              <button
                onClick={() => {
                  dispatch(resetFilters());
                  resetLocalFilters();
                }}
                className="flex items-center justify-center w-full h-12 bg-white border-2 border-secondaryYellow text-secondaryYellow px-2 rounded-md font-lato font-bold text-sm uppercase"
              >
                Wyczyść
              </button>
              <button className="flex items-center justify-center w-full h-12 bg-secondaryYellow text-white px-2 rounded-md font-lato font-bold text-sm uppercase" onClick={applyFilters}>
                Zastosuj
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
      {isFilterModalOpen && <div className="fixed inset-0 w-full h-full bg-black/20 z-10"></div>}
    </>
  );
};

export default FilterModal;
