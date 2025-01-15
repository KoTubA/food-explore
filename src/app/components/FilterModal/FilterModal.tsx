import { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { RootState } from "@/src/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setFilterModalOpen, setActiveFilters, resetFilters } from "@/src/redux/slices/restaurantsSlice";
import { IoChevronBack } from "react-icons/io5";

const FilterModal = () => {
  const filters = useSelector((state: RootState) => state.restaurants.activeFilters);

  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    types: false,
  });
  const [localFilters, setLocalFilters] = useState({
    dietStyle: filters.dietStyle,
    categories: filters.categories,
    types: filters.types,
    price: filters.price,
  });

  const toggleSection = (section: "categories" | "types") => {
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
        dietStyle: filters.dietStyle,
        categories: filters.categories,
        types: filters.types,
        price: filters.price,
      });
    }
  }, [isFilterModalOpen, filters]);

  const closeModal = () => {
    // Przywrócenie lokalnych filtrów do wartości globalnych, jeśli nie zostały zaakceptowane
    setLocalFilters({
      dietStyle: filters.dietStyle,
      categories: filters.categories,
      types: filters.types,
      price: filters.price,
    });

    dispatch(setFilterModalOpen(false));
  };

  const handleFilterChange = (key: keyof typeof localFilters, value: string) => {
    if (key === "dietStyle" || key === "price") {
      // Dla dietStyle i price tylko jedna opcja może być wybrana
      const updatedFilter = localFilters[key] === value ? null : value;
      setLocalFilters({
        ...localFilters,
        [key]: updatedFilter,
      });
    } else {
      // Dla pozostałych filtrów (kategorie, typy) zachowujemy poprzednią logikę
      const isActive = localFilters[key]?.includes(value);
      const updatedFilters = isActive ? localFilters[key].filter((item) => item !== value) : [...localFilters[key], value];

      setLocalFilters({
        ...localFilters,
        [key]: updatedFilters,
      });
    }
  };

  const isFilterActive = (key: keyof typeof localFilters, value: string) => {
    // Dla stylu diety i ceny sprawdzamy, czy dana wartość jest aktywna
    if (key === "dietStyle" || key === "price") {
      return localFilters[key] === value;
    }
    // Dla pozostałych filtrów (kategorie, typy) sprawdzamy, czy dana opcja jest w tablicy
    return localFilters[key]?.includes(value);
  };

  const applyFilters = () => {
    dispatch(setActiveFilters(localFilters)); // Zaktualizowanie aktywnych filtrów w Redux
    closeModal();
  };

  const resetLocalFilters = () => {
    setLocalFilters({
      dietStyle: null,
      categories: [],
      types: [],
      price: null,
    });
  };

  return (
    <>
      <Sheet isOpen={isFilterModalOpen} onClose={closeModal}>
        <Sheet.Container>
          <Sheet.Content>
            <div className="w-full flex items-center justify-center px-4 py-6 relative">
              <IoChevronBack onClick={closeModal} className="absolute left-4" />
              <h2 className="font-bold">Znajdź rekomendacje</h2>
            </div>
            <Sheet.Scroller draggableAt="both" className="flex flex-col px-4 gap-5 pb-[76px] mb-4">
              {/* Styl diety */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-light text-darkGray">
                  <h3 className="uppercase">Styl diety</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["Bezglutenowa", "Wegetariańska", "Wegańska"].map((diet) => (
                    <button key={diet} onClick={() => handleFilterChange("dietStyle", diet)} className={`px-5 py-3 rounded-md uppercase font-medium text-xs ${isFilterActive("dietStyle", diet) ? "bg-secondaryYellow text-white" : "bg-lightGray/50 text-darkGray"}`}>
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typy */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-light text-darkGray cursor-pointer" onClick={() => toggleSection("types")}>
                  <h3 className="uppercase">Typy</h3>
                  <span className="text-xs uppercase">{expandedSections.types ? "Zwiń" : "Rozwiń"}</span>
                </div>
                {expandedSections.types && (
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Cukiernia",
                      "Lody",
                      "Fast food",
                      "Piekarnia",
                      "Kawiarnia",
                      "Bistro",
                      "Pub",
                      "Bar",
                      "Restauracja",
                      "Lunche",
                      "Kanapki",
                      "Hamburgery",
                      "Naleśniki",
                      "Pizza",
                      "Strefa gastronomiczna",
                      "Kuchnia grecka",
                      "Kuchnia meksykańska",
                      "Kuchnia polska",
                      "Kuchnia włoska",
                      "Kuchnia turecka",
                      "Kuchnia wietnamska",
                      "Kuchnia japońska",
                      "Kuchnia hiszpańska",
                      "Kuchnia tajska",
                      "Kuchnia bliskowschodnia",
                      "Kuchnia europejska",
                      "Kuchnia azjatycka",
                      "Kuchnia amerykańska",
                      "Kuchnia neapolitańska",
                    ].map((type) => (
                      <button key={type} onClick={() => handleFilterChange("types", type)} className={`px-5 py-3 rounded-md uppercase font-medium text-xs ${isFilterActive("types", type) ? "bg-secondaryYellow text-white" : "bg-lightGray/50 text-darkGray"}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kategorie */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-light text-darkGray cursor-pointer" onClick={() => toggleSection("categories")}>
                  <h3 className="uppercase">Kategorie</h3>
                  <span className="text-xs uppercase">{expandedSections.categories ? "Zwiń" : "Rozwiń"}</span>
                </div>
                {expandedSections.categories && (
                  <div className="flex flex-wrap gap-3">
                    {["Kawa", "Herbata", "Desery", "Wypieki", "Pieczywo", "Napoje Bezalkoholowe", "Alkohole", "Bubble Tea", "Smoothie", "Milkshake", "Menu Sezonowe", "Kuchnia Fusion", "Kuchnia Regionalna", "Przekąski", "Śniadania", "Dania Główne", "Zupy", "Sałatki", "Pizza", "Makarony", "Sushi", "Burgery", "Fast Food", "Street Food"].map((category) => (
                      <button key={category} onClick={() => handleFilterChange("categories", category)} className={`px-5 py-3 rounded-md uppercase font-medium text-xs ${isFilterActive("categories", category) ? "bg-secondaryYellow text-white" : "bg-lightGray/50 text-darkGray"}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cena */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-light text-darkGray">
                  <h3 className="uppercase">Cena</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["1–20 zł", "20–40 zł", "40–60 zł", "$", "$$", "$$$"].map((price) => (
                    <button key={price} onClick={() => handleFilterChange("price", price)} className={`px-5 py-3 rounded-md uppercase font-medium text-xs ${isFilterActive("price", price) ? "bg-secondaryYellow text-white" : "bg-lightGray/50 text-darkGray"}`}>
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </Sheet.Scroller>

            {/* Zamknij modal */}
            <div className="flex items-center justify-center gap-3 fixed bottom-0 left-0 right-0 w-full p-4 z-10 bg-white">
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
