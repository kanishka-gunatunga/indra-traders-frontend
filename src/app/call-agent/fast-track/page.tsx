"use client";

import DetailsModal from "@/components/DetailsModal";
import FastTrackTable, { FastTrack } from "@/components/FastTrackTable";
import VehicleGallery from "@/components/VehicleGallery";
import VerificationDropdown from "@/components/VerificationDropdown";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

const fastTrackData = [
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
  {
    vehicleMake: "Nissan",
    model: "GT-R (R35)",
    year: 2020,
    transmission: "Automatic",
    price: "Rs 75,300,000",
  },
];

const vehicleDetails = [
  { label: "Millage:", value: "210,000km" },
  { label: "No. of Owners:", value: "2" },
  { label: "Vehicle No:", value: "Brand New" },
  { label: "Color:", value: "Rallye Red" },
  { label: "Capacity:", value: "2800cc" },
  { label: "Model:", value: "2020 Toyota Hilux GR S" },
  { label: "Fuel:", value: "Diesel" },
  {
    label: "Transmission:",
    value: "Continuously Variable Transmission (CVT)",
  },
  { label: "Year:", value: "2020" },
  { label: "Grade:", value: "GR S" },
];

export default function FastTrackPage() {
  const [priceFrom, setPriceFrom] = useState<number | "">("");
  const [priceTo, setPriceTo] = useState<number | "">("");

  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    value: number | ""
  ) => {
    setter(value === "" ? 1 : value + 1);
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    value: number | ""
  ) => {
    setter(value === "" ? 0 : Math.max(0, value - 1));
  };

  const [isVehicleDetailsModalOpen, setIsVehicleDetailsModalOpen] =
    useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FastTrack | null>(
    null
  );

  const handleRowClick = (item: FastTrack) => {
    setSelectedVehicle(item);
    setIsVehicleDetailsModalOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <h1 className="font-bold text-[25px] leading-[100%] tracking-normal text-[#1D1D1D] ml-8 max-[1140px]:text-[23px]">
          Indra Fast Track Dashboard
        </h1>
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center border border-[#E0E0E0]">
          <div className="flex-1 space-y-6">
            <div className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-[22px]">Filters</h2>
              <div className="flex gap-5 mt-10 md:mt-0">
                <button className=" text-[#DB2727] text-base font-medium rounded-full py-2 hover:text-[#ac7575] transition">
                  Clear all
                </button>
                <button className=" bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition">
                  Apply
                </button>
                <button
                  className="h-[41px] rounded-[30px] bg-[#DB2727] text-white px-10 hover:bg-red-700 flex gap-3 justify-center items-center"
                  onClick={() => (window.location.href = "/tele-marketer")}
                >
                  Send to Telemarketer <IoMdSend />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 max-[1200px]:grid-cols-2 gap-6 mt-10">
              <VerificationDropdown
                label="Vehicle Type"
                placeholder="Select Vehicle Type"
                isIcon={true}
              />
              <VerificationDropdown
                label="Vehicle Made"
                placeholder="Select Vehicle Made"
                isIcon={true}
              />
              <VerificationDropdown
                label="Vehicle Model"
                placeholder="Select Vehicle Model"
                isIcon={true}
              />
              <VerificationDropdown
                label="Grade"
                placeholder="Grade"
                isIcon={false}
              />
              <VerificationDropdown
                label="Manufacture Year"
                placeholder="Manufacture Year"
                isIcon={false}
              />
              <VerificationDropdown
                label="Mileage"
                placeholder="Mileage"
                isIcon={false}
              />
              <VerificationDropdown
                label="No. of Owners"
                placeholder="No. of Owners"
                isIcon={false}
              />
              <div className="flex flex-col space-y-2 font-medium text-gray-900">
                <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">
                  Price Range
                </span>

                <div className="flex gap-4">
                  {/* Price From */}
                  <div className="relative w-1/2">
                    <input
                      type="number"
                      placeholder="Price From"
                      value={priceFrom}
                      onChange={(e) =>
                        setPriceFrom(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => handleIncrement(setPriceFrom, priceFrom)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecrement(setPriceFrom, priceFrom)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Price To */}
                  <div className="relative w-1/2">
                    <input
                      type="number"
                      placeholder="Price To"
                      value={priceTo}
                      onChange={(e) =>
                        setPriceTo(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => handleIncrement(setPriceTo, priceTo)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecrement(setPriceTo, priceTo)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 mb-5 border border-[#E0E0E0]">
          <h2 className="font-semibold text-[22px] mb-10">
            Last Fast Track Purchases
          </h2>
          <FastTrackTable
            fastTrackData={fastTrackData}
            handleClick={handleRowClick}
          />
        </section>
      </main>

      {/* Vehicle Details Modal */}
      {isVehicleDetailsModalOpen && (
        <DetailsModal
          isOpen={isVehicleDetailsModalOpen}
          onClose={() => setIsVehicleDetailsModalOpen(false)}
          title="2025 Honda Civic Hatchback"
        >
          <div className="w-full flex justify-center mt-8 gap-6">
            {/* Left: Images */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Main vehicle image */}
              <div
                className="w-[600px] max-[1250px]:w-[500px] h-[331px] lg:h-[400px] border border-gray-200 bg-white/80 backdrop-blur-[50px] rounded-[30px] shadow-md flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url("/images/main-vehicle.png")` }}
              />

              {/* Small images grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  "/images/vehicle1.png",
                  "/images/vehicle2.png",
                  "/images/vehicle3.png",
                  "/images/vehicle4.png",
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className={`h-[94px] border border-gray-200 bg-white/80 backdrop-blur-[50px] shadow-md flex items-center justify-center bg-cover bg-center
              ${idx === 0 ? "rounded-tl-[30px] lg:rounded-l-[30px]" : ""}
              ${idx === 1 ? "" : ""}
              ${idx === 2 ? "" : ""}
              ${idx === 3 ? "rounded-tr-[30px] lg:rounded-r-[30px]" : ""}`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Vehicle details */}
            <div className="flex-1 px-4 lg:px-10 flex flex-col">
              <span className="text-[20px] font-semibold tracking-wide">
                Vehicle Details
              </span>
              <div className="text-[23px] mb-3 font-semibold tracking-wide text-[#DB2727] mt-5">
                Rs. 22,400,000
              </div>
              <div className="flex flex-col gap-2">
                {vehicleDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className="w-full flex text-lg font-medium tracking-wide"
                  >
                    <div className="w-2/6">{detail.label}</div>
                    <div className="w-4/6 text-[#575757]">{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DetailsModal>
      )}
    </div>
  );
}
