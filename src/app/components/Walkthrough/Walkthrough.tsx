"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/src/app/components/Header/Header";

const Walkthrough = ({ onComplete }: { onComplete: (option: string) => void }) => {
  const [step, setStep] = useState<number>(1);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="relative flex flex-col justify-between h-dvh text-center pb-44">
      <Header />
      {step === 1 && (
        <div className="flex flex-col items-center p-4 gap-10 flex-grow">
          <div className="relative flex-grow w-full">
            <Image src="/Illustration-1.svg" alt="Krok 1" layout="fill" className="object-contain max-h-64 px-4 flex self-center" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[28px] text-darkGray font-bold">Witamy!</h2>
            <p className="text-mediumGray font-lato">Cieszymy się, że jesteś z nami! Odkrywaj najlepsze miejsca kulinarne w Twoim mieście.</p>
          </div>
          <div className="flex flex-col items-center gap-8 fixed bottom-0 left-0 right-0 w-full p-4 z-10 h-44 bg-white">
            <div className="flex gap-3">
              {[1, 2, 3].map((buttonStep) => (
                <div key={buttonStep} className={`w-[6px] h-[6px] rounded-full ${step === buttonStep ? "bg-secondaryYellow" : "bg-gray-300"}`} />
              ))}
            </div>
            <div className="w-full flex flex-col justify-between gap-2">
              <button className="flex items-center justify-center w-full h-12 bg-secondaryYellow text-white px-2 rounded-md font-lato font-bold text-sm uppercase" onClick={nextStep}>
                Rozpocznij
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center p-4 gap-10 flex-grow">
          <div className="relative flex-grow w-full">
            <Image src="/Illustration-2.svg" alt="Krok 2" layout="fill" className="object-contain px-4 flex self-center" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[28px] text-darkGray font-bold">Zacznij odkrywać</h2>
            <p className="text-mediumGray font-lato">Znajdź najlepsze restauracje dzięki naszym rekomendacjom opartym na preferencjach.</p>
          </div>
          <div className="flex flex-col items-center gap-8 fixed bottom-0 left-0 right-0 w-full p-4 z-10 h-44 bg-white">
            <div className="flex gap-3">
              {[1, 2, 3].map((buttonStep) => (
                <div key={buttonStep} className={`w-[6px] h-[6px] rounded-full ${step === buttonStep ? "bg-secondaryYellow" : "bg-gray-300"}`} />
              ))}
            </div>
            <div className="w-full flex flex-col justify-between gap-2">
              <button className="flex items-center justify-center w-full h-12 bg-secondaryYellow text-white px-2 rounded-md font-lato font-bold text-sm uppercase" onClick={nextStep}>
                Rozpocznij
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center p-4 gap-10 flex-grow">
          <div className="relative flex-grow w-full">
            <Image src="/Illustration-3.svg" alt="Krok 3" layout="fill" className="object-contain px-4 flex self-center" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[28px] text-darkGray font-bold">Twój wybór</h2>
            <p className="text-mediumGray font-lato">Wypełnij ankietę z rekomendacjami lub przejdź do odkrywania miejsc samemu.</p>
          </div>
          <div className="flex flex-col items-center gap-8 fixed bottom-0 left-0 right-0 w-full p-4 z-10 h-44 bg-white">
            <div className="flex gap-3">
              {[1, 2, 3].map((buttonStep) => (
                <div key={buttonStep} className={`w-[6px] h-[6px] rounded-full ${step === buttonStep ? "bg-secondaryYellow" : "bg-gray-300"}`} />
              ))}
            </div>
            <div className="w-full flex flex-col justify-between gap-2">
              <button onClick={() => onComplete("survey")} className="flex items-center justify-center w-full h-12 bg-secondaryYellow text-white px-2 rounded-md font-lato font-bold text-sm uppercase">
                Wypełnij ankietę
              </button>
              <button onClick={() => onComplete("explore")} className="flex items-center justify-center w-full h-12 text-darkGray px-2 rounded-md font-lato font-bold text-sm uppercase">
                Zacznij ekslorować
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Walkthrough;
