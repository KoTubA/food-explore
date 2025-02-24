import Image from "next/image";

export default function Header() {
  return (
    <header className="flex gap-4 p-4 md:hidden">
      <Image src="/assets/svg/logo.svg" alt="logo" layout="responsive" className="max-w-8" width={30} height={30} />
      <span className="font-black text-2xl">FoodExplore</span>
    </header>
  );
}
