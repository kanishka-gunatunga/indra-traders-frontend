import React from 'react';
import {CardItemProps} from "@/components/DashboardCard";
import Image from "next/image";

interface InquiriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    inquiryData: CardItemProps | null;
}

const InquiriesModal = ({isOpen, onClose, inquiryData}: InquiriesModalProps) => {
    if (!isOpen || !inquiryData) return null;

    const vehicleDetails = {
        make: "Honda",
        model: "Civic",
        year: "2019",
        transmission: "Auto",
        fuelType: "Petrol",
        downPayment: "500,000LKR",
        priceRange: "6,000,000 - 8,000,000",
        additionalNote: "White color",
    };

    const followUpActivities = [
        {
            activity: "Proposed Red Color Civic",
            date: "12 March, 2025",
        },
        {
            activity: "Proposed FK7 Ex Tech Pack Edition",
            date: "10 March, 2025",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex bg-white/30 items-center justify-center p-4">
            {/* Modal Overlay */}
            <div
                className="fixed inset-0 bg-white/20 bg-opacity-30"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className="relative z-50 w-[1305px] h-[616px] transform rounded-[45px] border border-[#E7E7E7] bg-[#FFFFFFB2] p-8 text-left shadow-lg backdrop-blur-[60px] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-row gap-2">
                        <h2 className="text-[22px] font-semibold text-[#1D1D1D] montserrat">{inquiryData.primaryText}</h2>
                        <div className="flex flex-row items-center gap-3">
              <span className="bg-[#DFDFDF] rounded-[20px] px-4 py-1 text-[15px] font-medium text-[#1D1D1D]">
                Sales person: Guy Hawkins
              </span>
                            <span
                                className="bg-[#DBDBDB] rounded-[22.9787px] px-4 py-1 text-[15px] font-medium text-[#1D1D1D]">
                ITPL
              </span>
                            <span
                                className="bg-[#DB2727] rounded-[22.9787px] px-4 py-1 text-[15px] font-medium text-white">
                Ongoing
              </span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose}>
                        <Image src="/close-icon.svg" alt="Close" width={24} height={24}/>
                    </button>
                </div>

                <div className="flex flex-row mt-12 gap-16">
                    {/* Vehicle Details Section */}
                    <div className="flex flex-col gap-4 w-[395px]">
                        <h3 className="text-[20px] font-semibold text-[#1D1D1D] montserrat">Vehicle Details</h3>
                        <div className="flex flex-col gap-4 text-[18px]">
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Vehicle Made:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.make}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Vehicle Model:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.model}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Manufacture Year:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.year}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Transmission:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.transmission}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Fuel Type:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.fuelType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Down Payment:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.downPayment}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Price Range:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.priceRange}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-[#1D1D1D]">Additional Note:</span>
                                <span className="font-medium text-[#575757]">{vehicleDetails.additionalNote}</span>
                            </div>
                        </div>
                    </div>

                    {/* Follow Up Section */}
                    <div className="flex flex-col gap-4 flex-1">
                        <h3 className="text-[20px] font-semibold text-[#1D1D1D] montserrat border-b-[1.5px] border-[#DB2727] pb-2 w-[270px]">
                            Follow up
                        </h3>
                        <div className="bg-[#FFFFFF] bg-opacity-50 rounded-[30px] p-6 backdrop-blur-[25px]">
                            {/* Table Headers */}
                            <div
                                className="flex text-[16px] font-medium text-[#575757] border-b-[1.5px] border-[#CCCCCC] pb-2">
                                <div className="w-1/2">Activity</div>
                                <div className="w-1/2">Date</div>
                            </div>

                            {/* Table Rows */}
                            {followUpActivities.map((item, index) => (
                                <div key={index} className="flex text-[16px] font-medium text-[#1D1D1D] mt-4">
                                    <div className="w-1/2">{item.activity}</div>
                                    <div className="w-1/2">{item.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiriesModal;