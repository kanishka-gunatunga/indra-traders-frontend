import Image from "next/image";
import React from "react";

export default function SalesDashboard() {
  return (
    <div className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900  overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <h1 className="text-[25px] font-bold text-[#1D1D1D] ml-8">
          Indra Traders Sales Dashboard
        </h1>

        {/* Welcome Card */}
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-semibold text-black text-xl">
                  Welcome Back, Sophie Eleanor
                </p>
                <p className="text-[#575757] text-[17px] flex items-center space-x-1">
                  <span role="img" aria-label="birthday cake">
                    <Image
                      src="/images/sales/tdesign_location.svg"
                      alt=""
                      width={200}
                      height={200}
                      className="w-4 h-4"
                    />
                  </span>
                  <span>Bambalapitiya</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-36">
            <div className="flex flex-col space-y-1">
              <div className="grid grid-cols-2 gap-5">
                <span className="font-medium text-lg text-[#1D1D1D]">
                  Wednesday
                </span>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <span className="font-medium text-lg text-[#575757]">
                  12 March, 2025
                </span>
              </div>
            </div>

            <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
              {/*<MdWarningAmber size={24} className="text-red-700"/>*/}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 21L12 2L23 21H1ZM4.45 19H19.55L12 6L4.45 19ZM12 18C12.2833 18 12.521 17.904 12.713 17.712C12.905 17.52 13.0007 17.2827 13 17C12.9993 16.7173 12.9033 16.48 12.712 16.288C12.5207 16.096 12.2833 16 12 16C11.7167 16 11.4793 16.096 11.288 16.288C11.0967 16.48 11.0007 16.7173 11 17C10.9993 17.2827 11.0953 17.5203 11.288 17.713C11.4807 17.9057 11.718 18.0013 12 18ZM11 15H13V10H11V15Z"
                  fill="#575757"
                />
                <circle
                  cx="17"
                  cy="7"
                  r="4.75"
                  fill="#DB2727"
                  stroke="#FBF9F9"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
