"use client";

import FoodMap from "@/src/app/components/FoodMap/FoodMap";
import dynamic from "next/dynamic";

const BottomBar = dynamic(() => import("@/src/app/components/BottomBar/BottomBar"), { ssr: false });

const Home = () => {
  return (
    <div className="w-full h-dvh h-flex flex-col">
      <FoodMap />
      <BottomBar />
    </div>
  );
};

export default Home;
