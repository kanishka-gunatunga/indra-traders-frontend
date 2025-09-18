import SalesHeader from "@/components/SalesHeader";
import React from "react";

export default function SalesDetailsPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <SalesHeader />

        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="flex w-full justify-between">
            <div className="flex w-full gap-4 items-center">
              <span className="font-semibold text-[22px] leading-[100%] tracking-normal">
                ITPL122455874565
              </span>
              <span
                className="w-[67px] h-[26px] rounded-[22.98px] 
             pt-[5.74px] pb-[5.74px] pl-[17.23px] pr-[17.23px]
             flex items-center justify-center bg-[#DBDBDB] text-sm"
              >
                ITPL
              </span>
              <span
                className="w-[61px] h-[26px] rounded-[22.98px] 
             pt-[5.74px] pb-[5.74px] pl-[10px] pr-[10px] text-sm
             flex items-center justify-center text-black bg-[#FFA7A7]"
              >
                P0
              </span>
            </div>

            {/* Flow bar */}

            <div className="flex space-x-0 bg-[]">
              {/* Step 1: New */}
              <div className="relative w-[270px] h-[58px]">
                <svg
                  width="270"
                  height="58"
                  viewBox="0 0 270 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0"
                >
                  {/* --- First shape path copied from Figma --- */}
                  <path
                    d="M33 4V54H29C15.1929 54 4 42.8071 4 29C4 15.1929 15.1929 4 29 4H33Z"
                    fill="#DB2727"
                  />
                  <path
                    d="M33 10V48C33 51.3137 35.6863 54 39 54H235.281C236.738 54 238.146 53.4695 239.241 52.5077L260.869 33.5077C263.589 31.1181 263.589 26.8819 260.869 24.4923L239.241 5.49234C238.146 4.53046 236.738 4 235.281 4H39C35.6863 4 33 6.68629 33 10Z"
                    fill="#DB2727"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px] montserrat">
                  New
                </span>
              </div>

              {/* Step 2: Ongoing */}
              <div className="relative w-[270px] h-[58px]">
                <svg
                  width="270"
                  height="58"
                  viewBox="0 0 270 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0"
                >
                  {/* --- Second shape path copied from Figma --- */}
                  <path
                    d="M33 4V54H29C15.1929 54 4 42.8071 4 29C4 15.1929 15.1929 4 29 4H33Z"
                    fill="#C0C0C0"
                  />
                  <path
                    d="M33 10V48C33 51.3137 35.6863 54 39 54H235.281C236.738 54 238.146 53.4695 239.241 52.5077L260.869 33.5077C263.589 31.1181 263.589 26.8819 260.869 24.4923L239.241 5.49234C238.146 4.53046 236.738 4 235.281 4H39C35.6863 4 33 6.68629 33 10Z"
                    fill="#C0C0C0"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px] montserrat">
                  Ongoing
                </span>
              </div>

              {/* Step 3: Won/Lost */}
              <div className="relative w-[270px] h-[58px]">
                <svg
                  width="270"
                  height="58"
                  viewBox="0 0 270 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0"
                >
                  {/* --- Third shape path copied from Figma --- */}
                  <path
                    d="M4 4H241C254.807 4 266 15.1929 266 29C266 42.8071 254.807 54 241 54H4V4Z"
                    fill="#C0C0C0"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px] montserrat">
                  Won/Lost
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
