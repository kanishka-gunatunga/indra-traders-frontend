import Header from "@/components/Header";
import Image from "next/image";
import React from "react";

const unavailableItemsData = [
  {
    make: "Honda",
    model: "Civic FK7",
    year: "2019",
    transmission: "Auto",
    fuelType: "Petrol",
    downPayment: "1,000,000",
    priceRange: "100k - 200k",
  },
  {
    make: "Toyota",
    model: "Corolla Axio",
    year: "2018",
    transmission: "Hybrid",
    fuelType: "Petrol",
    downPayment: "1,200,000",
    priceRange: "90k - 180k",
  },
  {
    make: "BMW",
    model: "320i",
    year: "2017",
    transmission: "Manual",
    fuelType: "Petrol",
    downPayment: "2,500,000",
    priceRange: "500k - 700k",
  },
  {
    make: "Suzuki",
    model: "Swift RS",
    year: "2019",
    transmission: "Auto",
    fuelType: "Petrol",
    downPayment: "800,000",
    priceRange: "120k - 200k",
  },
  {
    make: "Mitsubishi",
    model: "Outlander",
    year: "2021",
    transmission: "Auto",
    fuelType: "Hybrid",
    downPayment: "1,500,000",
    priceRange: "200k - 300k",
  },
  {
    make: "Honda",
    model: "Civic FK7",
    year: "2019",
    transmission: "Auto",
    fuelType: "Petrol",
    downPayment: "1,000,000",
    priceRange: "100k - 200k",
  },
  {
    make: "Honda",
    model: "Civic FK7",
    year: "2019",
    transmission: "Auto",
    fuelType: "Petrol",
    downPayment: "1,000,000",
    priceRange: "100k - 200k",
  },
  {
    make: "Suzuki",
    model: "Swift RS",
    year: "2019",
    transmission: "Auto",
    fuelType: "Petrol",
    downPayment: "800,000",
    priceRange: "120k - 200k",
  },
  {
    make: "Mitsubishi",
    model: "Outlander",
    year: "2021",
    transmission: "Auto",
    fuelType: "Hybrid",
    downPayment: "1,500,000",
    priceRange: "200k - 300k",
  },
  {
    make: "Mitsubishi",
    model: "Outlander",
    year: "2021",
    transmission: "Auto",
    fuelType: "Hybrid",
    downPayment: "1,500,000",
    priceRange: "200k - 300k",
  },
  {
    make: "Honda",
    model: "Civic FK7",
    year: "2019",
    transmission: "Auto",
    fuelType: "Petrol",
    downPayment: "1,000,000",
    priceRange: "100k - 200k",
  },
  {
    make: "Honda",
    model: "Civic FK7",
    year: "2019",
    transmission: "Auto",
    fuelType: "Petrol",
    downPayment: "1,000,000",
    priceRange: "100k - 200k",
  },
];

export default function Unavailable() {
  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Sophie Eleanor"
          location="Bambalapitiya"
          title="Unavailable Items"
        />

        {/* Unavailable Items Section */}
        <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px]">Unavailable Items</span>

            <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
              <Image
                src={"/images/admin/flowbite_filter-outline.svg"}
                width={24}
                height={24}
                alt="Filter icon"
              />
            </button>
          </div>
          <div className="w-full mt-5 ">
            <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
              <div className="min-w-[1000px] ">
                {/* Table header */}
                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                  <div className="w-1/7 px-3 py-2">Make</div>
                  <div className="w-1/7 px-3 py-2">Model</div>
                  <div className="w-1/7 px-3 py-2">Year</div>
                  <div className="w-1/7 px-3 py-2">Transmission</div>
                  <div className="w-1/7 px-3 py-2">Fuel Type</div>
                  <div className="w-1/7 px-3 py-2">Down Payment</div>
                  <div className="w-1/7 px-3 py-2">Price Range</div>
                </div>

                {/* Table body (scrollable vertically) */}
                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                  {unavailableItemsData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex text-lg mt-1 text-black hover:bg-gray-50 transition"
                    >
                      <div className="w-1/7 px-3 py-2">{item.make}</div>
                      <div className="w-1/7 px-3 py-2">{item.model}</div>
                      <div className="w-1/7 px-3 py-2">{item.year}</div>
                      <div className="w-1/7 px-3 py-2 relative">
                        {item.transmission}
                      </div>
                      <div className="w-1/7 px-3 py-2">{item.fuelType}</div>
                      <div className="w-1/7 px-3 py-2">
                        LKR {item.downPayment}
                      </div>
                      <div className="w-1/7 px-3 py-2">{item.priceRange}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
