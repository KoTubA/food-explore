import type { Viewport, Metadata } from "next";
import { Roboto, Lato } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/src/providers/AppProviders";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "FoodExplore - Odkrywaj najlepsze miejsca gastronomiczne",
  description: "Znajdź idealne miejsce do jedzenia w największych miastach Polski!",
  keywords: ["restauracje", "jedzenie", "rekomendacje", "Polska", "mapa", "gastronomia", "FoodExplore"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${roboto.variable} ${lato.variable} antialiased bg-white`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
