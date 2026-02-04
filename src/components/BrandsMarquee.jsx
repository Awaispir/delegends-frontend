import React from "react";
import brand1 from "../assets/brand1.png";
import brand2 from "../assets/brand2.png";
import brand3 from "../assets/brand3.png";
import brand4 from "../assets/brand4.png";
import brand5 from "../assets/brand5.png";

const BrandsMarquee = () => {
  const brands = [
    { id: 1, name: "Proraso", logo: brand1 },
    { id: 2, name: "Dapper Dan", logo: brand2 },
    { id: 3, name: "Reuzel", logo: brand3 },
    { id: 4, name: "American Crew", logo: brand4 },
    { id: 5, name: "Wahl Professional", logo: brand5 },
  ];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      

      {/* MARQUEE WRAPPER */}
      <div className="relative w-full overflow-hidden py-2">
        <div className="flex whitespace-nowrap marquee-track">
           {brands.map((brand) => (
  <div
    key={brand.id}
    className="mx-12 inline-flex items-center justify-center w-48 h-28"
  >
    <img
      src={brand.logo}
      alt={brand.name}
      className="max-h-full max-w-full object-contain"
    />
  </div>
))}

{brands.map((brand) => (
  <div
    key={brand.id + '-dup'}
    className="mx-12 inline-flex items-center justify-center w-48 h-28"
  >
    <img
      src={brand.logo}
      alt={brand.name}
      className="max-h-full max-w-full object-contain"
    />
  </div>
))}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .marquee-track {
          display: inline-flex;
          animation: scroll 25s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track:hover {
          animation-play-state: running;
        }
      `}} />
    </section>
  );
};

export default BrandsMarquee;
