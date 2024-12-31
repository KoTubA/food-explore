import FoodMap from "@/src/app/components/FoodMap/FoodMap";
import BottomBar from "@/src/app/components/BottomBar/BottomBar";

const Home = () => {
  return (
    <div className="w-full h-dvh h-flex flex-col">
      <FoodMap />
      <BottomBar />
    </div>
  );
};

export default Home;
