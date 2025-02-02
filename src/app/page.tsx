"use client";

import { useEffect, useState } from "react";
import FoodMap from "@/src/app/components/FoodMap/FoodMap";
import dynamic from "next/dynamic";
import Walkthrough from "@/src/app/components/Walkthrough/Walkthrough";
import Survey from "@/src/app/components/Survey/Survey";

const BottomBar = dynamic(() => import("@/src/app/components/BottomBar/BottomBar"), { ssr: false });

const Home = () => {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowWalkthrough(true);
    }
  }, []);

  const handleCompleteWalkthrough = (option: string) => {
    if (option === "survey") {
      setShowSurvey(true);
    } else {
      localStorage.setItem("hasVisited", "true");
      setShowWalkthrough(false);
    }
  };

  const handleCompleteSurvey = () => {
    setShowSurvey(false);
    localStorage.setItem("hasVisited", "true");
    setShowWalkthrough(false);
  };

  return (
    <>
      {/* Main application */}
      <div className="w-full h-dvh h-flex flex-col">
        <FoodMap />
        <BottomBar />
      </div>

      {/* Walkthrough overlay */}
      {showWalkthrough && (
        <div className="fixed inset-0 bg-black/50 z-[10000] overflow-hidden flex items-center justify-center">
          <Walkthrough onComplete={handleCompleteWalkthrough} />
        </div>
      )}

      {/* Survey overlay */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black/50 z-[10000] overflow-hidden flex items-center justify-center">
          <Survey onComplete={handleCompleteSurvey} />
        </div>
      )}
    </>
  );
};

export default Home;
