"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveFilters, setSelectedLocation } from "@/src/redux/slices/restaurantsSlice";
import Header from "@/src/app/components/Header/Header";
import { FiCheck } from "react-icons/fi";

const questions = [
  {
    id: 1,
    question: "Wybierz dostępne miasto",
    options: ["Cała Polska", "Kraków", "Warszawa", "Trójmiasto", "Wrocław", "Poznań", "Łódź"],
    multiple: false,
  },
  {
    id: 2,
    question: "Wybierz preferowaną dietę",
    options: ["Bez preferencji", "Bezglutenowa", "Wegetariańska", "Wegańska"],
    multiple: false,
  },
  {
    id: 3,
    question: "Wybierz przedział cenowy",
    options: ["1–20 zł", "20–40 zł", "40–60 zł", "$", "$$", "$$$"],
    multiple: true,
  },
  {
    id: 4,
    question: "Wybierz kategorie restauracji",
    options: ["Kawiarnia", "Cukiernia", "Lody", "Piekarnia", "Fast food", "Pub", "Bar", "Restauracja", "Hamburgery", "Pizza", "Makaron", "Ramen", "Pączkaria", "Śniadania", "Strefa gastronomiczna", "Kuchnia grecka", "Kuchnia meksykańska", "Kuchnia polska", "Kuchnia włoska", "Kuchnia turecka", "Kuchnia wietnamska", "Kuchnia japońska", "Kuchnia hiszpańska", "Kuchnia tajska", "Kuchnia bliskowschodnia", "Kuchnia europejska", "Kuchnia azjatycka", "Kuchnia amerykańska"],
    multiple: true,
  },
];

const cityCoordinates: Record<string, { lat: number; lng: number; zoom: number } | null> = {
  Kraków: { lat: 50.0647, lng: 19.945, zoom: 9 },
  Warszawa: { lat: 52.2297, lng: 21.0122, zoom: 9 },
  Trójmiasto: { lat: 54.4295, lng: 18.5876, zoom: 10 },
  Wrocław: { lat: 51.1079, lng: 17.0385, zoom: 10 },
  Poznań: { lat: 52.4064, lng: 16.9252, zoom: 10 },
  Łódź: { lat: 51.7592, lng: 19.456, zoom: 10 },
  "Cała Polska": null,
};

interface AnswerState {
  [key: number]: string[];
}

const Survey = ({ onComplete }: { onComplete: () => void }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const dispatch = useDispatch();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleOptionSelect = (option: string) => {
    if (currentQuestion.multiple) {
      setAnswers((prev: AnswerState) => {
        const selected = prev[currentQuestion.id] || [];
        if (selected.includes(option)) {
          return {
            ...prev,
            [currentQuestion.id]: selected.filter((o: string) => o !== option),
          };
        } else {
          return {
            ...prev,
            [currentQuestion.id]: [...selected, option],
          };
        }
      });
    } else {
      setAnswers((prev: AnswerState) => ({
        ...prev,
        [currentQuestion.id]: [option],
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      dispatch(
        setActiveFilters({
          dietStyle: answers[2]?.[0] === "Bez preferencji" ? null : answers[2]?.[0],
          price: answers[3] || [],
          categories: answers[4] || [],
        })
      );

      const selectedCity = answers[1]?.[0];
      const coordinates = selectedCity ? cityCoordinates[selectedCity] : null;

      dispatch(setSelectedLocation(coordinates));

      onComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isOptionSelected = (option: string) => {
    return answers[currentQuestion.id]?.includes(option);
  };

  const isNextDisabled = !answers[currentQuestion.id]?.length;

  return (
    <div className="bg-white relative flex flex-col h-dvh text-center pb-20 overflow-hidden w-full max-w-lg md:max-h-[615px] md:pt-4 md:rounded-md">
      <Header />
      <div className="flex flex-col p-4 gap-6 flex-grow overflow-hidden">
        {/* Progress Bar */}
        <div className="flex gap-2 flex-col">
          <span className="text-sm font-medium text-darkGray">
            Pytanie {currentQuestionIndex + 1} z {totalQuestions}
          </span>
          <div className="w-full bg-lightGray h-4 rounded-full">
            <div className="bg-secondaryYellow h-4 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
          </div>
        </div>
        {/* Options */}
        <form method="POST" className="w-full flex flex-col gap-6 overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
          {/* Question Section */}
          <p className="text-xl font-medium text-start text-black">{currentQuestion.question}</p>
          <div className={`w-full flex ${currentQuestion.multiple ? "flex-row flex-wrap gap-2" : "flex-col gap-4"}`}>
            {currentQuestion.options.map((option) => (
              <div key={option}>
                {currentQuestion.multiple ? (
                  <button type="button" className={`px-3 py-[6px] rounded-2xl capitalize font-medium text-xs ${isOptionSelected(option) ? "bg-secondaryYellow text-white" : "bg-secondaryYellow/15 text-secondaryYellow"}`} onClick={() => handleOptionSelect(option)}>
                    {option}
                  </button>
                ) : (
                  <button type="button" className={`flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-4 font-medium shadow md:gap-8 border text-darkGray bg-white ${isOptionSelected(option) ? "border-secondaryYellow" : "border-darkGray"}`} onClick={() => handleOptionSelect(option)}>
                    <span className={`flex flex-shrink-0 text-white justify-center items-center h-5 w-5 p-[3px] rounded-full border ${isOptionSelected(option) ? "bg-secondaryYellow border-secondaryYellow" : "bg-white border-darkGray"}`}>
                      <FiCheck />
                    </span>
                    <span className="text-left break-words min-w-0">{option}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-8 absolute bottom-0 left-0 right-0 w-full p-4 z-10 h-20 bg-white md:pb-8">
            <div className="w-full flex justify-between gap-2">
              <button type="button" className={`flex items-center justify-center w-full h-12 text-darkGray px-2 rounded-md font-lato font-bold text-sm uppercase ${currentQuestionIndex > 0 ? "" : "invisible pointer-events-none"}`} onClick={handleBack}>
                Powrót
              </button>
              <button type="button" className={`flex items-center justify-center w-full h-12 px-2 rounded-md font-lato font-bold text-sm uppercase ${isNextDisabled ? "bg-lightGray text-darkGray cursor-not-allowed" : "bg-secondaryYellow text-white"}`} onClick={handleNext} disabled={isNextDisabled}>
                {currentQuestionIndex === totalQuestions - 1 ? "Koniec" : "Dalej"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Survey;
