import SalesHeader from "@/components/SalesHeader";
import InfoRow from "@/components/SalesInfoRow";
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

            <div className="w-[786px] h-[50px] flex rounded-[30px] overflow-hidden bg-[#C0C0C0]">
              {/* Step 1: New */}
              <div className="relative flex-1 ">
                <div
                  className="absolute inset-0 bg-[#DB2727] flex items-center justify-center text-white font-semibold text-[16px] rounded-l-[30px]"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
                  }}
                >
                  New
                </div>
                {/* White border at arrow edge */}
                <div
                  className="absolute top-0 right-0 h-full"
                  style={{
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    background: "#DB2727",
                    width: "20px",
                  }}
                />
              </div>

              {/* Step 2: Ongoing */}
              <div className="relative flex-1">
                <div
                  className="absolute inset-0 bg-[#C0C0C0] flex items-center justify-center text-white font-semibold text-[16px]"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
                  }}
                >
                  Ongoing
                </div>
                {/* White border at arrow edge */}
                <div
                  className="absolute top-0 right-0 h-full"
                  style={{
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    background: "#C0C0C0",
                    width: "20px",
                  }}
                />
              </div>

              {/* Step 3: Won/Lost */}
              <div className="flex-1 bg-[#C0C0C0] flex items-center justify-center text-white font-semibold text-[16px] rounded-r-[30px]">
                Won/Lost
              </div>
            </div>
          </div>
          <div className="w-full flex mt-2 mb-8">
            <button
              className="w-[145px] h-[32px] bg-[#DB2727] rounded-[22.98px] 
               px-[17.23px] py-[5.74px] 
               text-white font-light flex items-center justify-center"
            >
              Assign to me
            </button>
          </div>
          <div className="w-full flex">
            <div className="w-2/5">
              <div className="mb-8 font-semibold text-[20px] leading-[100%] tracking-[0%]">
                Customer Details
              </div>
              <InfoRow label="Customer Name:" value="Emily Charlotte" />
              <InfoRow label="Contact No:" value="077 5898712" />
              <InfoRow label="Email:" value="Info@indra.com" />
              <div className="mt-5 mb-8 font-semibold text-[20px] leading-[100%] tracking-[0%]">
                Customer Details
              </div>
              <InfoRow label="Vehicle Made:" value="Honda" />
              <InfoRow label="Vehicle Model:" value="Civic" />
              <InfoRow label="Manufacture Year:" value="2019" />
              <InfoRow label="Transmission:" value="Auto"/>
              <InfoRow label="Fuel Type:" value="Petrol"/>
              <InfoRow label="" value=""/>
              <InfoRow label="" value=""/>
              <InfoRow label="" value=""/>
            </div>
            <div className="w-3/5">ssss</div>
          </div>
        </section>
      </main>
    </div>
  );
}
