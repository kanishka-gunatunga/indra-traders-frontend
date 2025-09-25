"use client";
import Image from "next/image";

interface VehicleSalesModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleData: {
        title: string;
        image: string;
        price: string;
        details: {
            millage: string;
            owners: string;
            vehicleNo: string;
            color: string;
            capacity: string;
            model: string;
            fuel: string;
            transmission: string;
            year: string;
            grade: string;
        };
        thumbnailImages: string[];
        salesPerson: string;
        purchaseDate: string;
    } | null;
}

export default function VehicleSalesModal({isOpen, onClose, vehicleData}: VehicleSalesModalProps) {
    if (!isOpen || !vehicleData) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-opacity-30" onClick={onClose}></div>

            {/* Modal Content */}
            <div
                className="relative z-50 transform rounded-[45px] border border-[#E7E7E7] bg-white bg-opacity-70 p-8 text-left shadow-lg backdrop-blur-[30px] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-[22px] font-semibold text-[#000000] montserrat">{vehicleData.title}</h2>
                        <div className="flex flex-row items-center gap-3 mt-1">
                            <span className="bg-[#DFDFDF] rounded-[20px] px-4 py-1 text-[15px] font-medium text-[#1D1D1D]">
                                Sales person: {vehicleData.salesPerson}
                            </span>
                            <span className="bg-[#039855] rounded-[20px] px-4 py-1 text-[15px] font-medium text-white">
                                Purchase: {vehicleData.purchaseDate}
                            </span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose}>
                        <Image src="/close-icon.svg" alt="Close" width={24} height={24}/>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-row mt-12 gap-8">
                    {/* Left Section (Images) */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-[567px] h-[311px] rounded-[30px] overflow-hidden">
                            <Image
                                src={vehicleData.image}
                                alt={vehicleData.title}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="flex flex-row gap-2">
                            {vehicleData.thumbnailImages.map((src, index) => (
                                <div key={index} className="relative w-[134px] h-[84px] rounded-[30px] overflow-hidden">
                                    <Image
                                        src={src}
                                        alt={`${vehicleData.title} thumbnail ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section (Details) */}
                    <div className="flex flex-col flex-1">
                        <h3 className="text-[20px] font-semibold text-[#000000] montserrat">Vehicle Details</h3>
                        <h4 className="text-[23px] font-semibold text-[#DB2727] montserrat mt-2">{vehicleData.price}</h4>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-6">
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Millage:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.millage}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">No. of Owners:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.owners}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Vehicle No:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.vehicleNo}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Color:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.color}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Capacity:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.capacity}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Model:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.model}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Fuel:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.fuel}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Transmission:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.transmission}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Year:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.year}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[18px] text-[#1D1D1D]">Grade:</span>
                                <span
                                    className="font-medium text-[18px] text-[#575757]">{vehicleData.details.grade}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}