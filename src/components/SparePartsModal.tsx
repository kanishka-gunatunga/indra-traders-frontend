// "use client";
// import Image from "next/image";
// import {useState} from "react";
//
// interface SparePart {
//     name: string;
//     units: number;
//     compatibility: string;
//     price: number;
// }
//
// interface SparePartsModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     sparePartsData: {
//         invoiceNo: string;
//         date: string;
//         parts: SparePart[];
//     } | null;
// }
//
// const SparePartsModal = ({isOpen, onClose, sparePartsData}: SparePartsModalProps) => {
//     if (!isOpen || !sparePartsData) {
//         return null;
//     }
//
//     const totalPrice = sparePartsData.parts.reduce((sum, part) => sum + part.price, 0);
//
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             {/* Modal Overlay */}
//             <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
//
//             {/* Modal Content */}
//             <div
//                 className="relative z-50 w-[1305px] h-[312px] transform rounded-[45px] border border-[#E7E7E7] bg-white bg-opacity-70 p-8 text-left shadow-lg backdrop-blur-[30px] flex flex-col"
//             >
//                 {/* Header */}
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h2 className="text-[22px] font-semibold text-[#000000] montserrat">Spare Parts Details</h2>
//                         <div className="flex flex-row gap-10 mt-4">
//               <span className="bg-[#DFDFDF] rounded-[20px] px-4 py-1 text-[15px] font-medium text-[#1D1D1D]">
//                 {sparePartsData.invoiceNo}
//               </span>
//                             <span className="bg-[#039855] rounded-[20px] px-4 py-1 text-[15px] font-medium text-white">
//                 {sparePartsData.date}
//               </span>
//                         </div>
//                     </div>
//                     <button type="button" onClick={onClose}>
//                         <Image src="/close-icon.svg" alt="Close" width={24} height={24}/>
//                     </button>
//                 </div>
//
//                 {/* Table Header */}
//                 <div className="flex flex-row justify-between mt-8 border-b-2 border-gray-300 pb-2">
//                     <span className="font-medium text-[18px] text-[#575757] w-[362px]">Spare Part</span>
//                     <span className="font-medium text-[18px] text-[#575757] w-[230px]">Units</span>
//                     <span className="font-medium text-[18px] text-[#575757] w-[385px]">Compatibility</span>
//                     <span className="font-medium text-[18px] text-[#575757] w-[258px]">Price</span>
//                 </div>
//
//                 {/* Parts List */}
//                 <div className="flex flex-col mt-4 overflow-y-auto" style={{maxHeight: "150px"}}>
//                     {sparePartsData.parts.map((part, index) => (
//                         <div key={index} className="flex flex-row justify-between items-center py-2">
//                             <span className="font-medium text-[18px] text-[#1D1D1D] w-[362px]">{part.name}</span>
//                             <span className="font-medium text-[18px] text-[#1D1D1D] w-[230px]">{part.units}</span>
//                             <span className="font-medium text-[18px] text-[#1D1D1D] w-[385px] capitalize">
//                 {part.compatibility}
//               </span>
//                             <span
//                                 className="font-medium text-[18px] text-[#1D1D1D] w-[258px]">LKR {part.price.toLocaleString()}</span>
//                         </div>
//                     ))}
//                 </div>
//
//                 {/* Total Price */}
//                 <div className="border-t border-b border-[#575757] flex justify-end items-center py-4 mt-auto">
//           <span className="font-bold text-[18px] text-[#1D1D1D]">
//             Total: LKR {totalPrice.toLocaleString()}
//           </span>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default SparePartsModal;

"use client";
import {useState} from "react";
import Image from "next/image";
import DetailsModal from "@/components/DetailsModal";

interface SparePartsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sparePartsData: {
        invoiceNo: string;
        date: string;
        parts: { name: string; units: number; compatibility: string; price: number }[];
    } | null;
}

const SparePartsModal = ({isOpen, onClose, sparePartsData}: SparePartsModalProps) => {
    if (!isOpen || !sparePartsData) {
        return null;
    }

    return (
        <DetailsModal isOpen={isOpen} onClose={onClose}>
            <div className="min-w-[800px]">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h2 className="text-[22px] font-semibold text-[#000000] montserrat">Spare Parts Details</h2>
                        <div className="flex flex-row gap-2">
                          <span
                              className="bg-[#DFDFDF] rounded-[20px] px-4 py-1 text-[15px] font-medium text-[#1D1D1D]">
                            {sparePartsData.invoiceNo}
                          </span>
                            <span className="bg-[#039855] rounded-[20px] px-4 py-1 text-[15px] font-medium text-white">
                            {sparePartsData.date}
                          </span>
                        </div>
                    </div>
                </div>

                {/* Spare Parts Table Header */}
                <div className="mt-8 border-b-2 border-gray-300 pb-2 flex justify-between items-center">
                    <div className="w-1/3 text-left font-medium text-[18px] text-[#575757]">Spare Part</div>
                    <div className="w-1/6 text-left font-medium text-[18px] text-[#575757]">Units</div>
                    <div className="w-1/3 text-left font-medium text-[18px] text-[#575757]">Compatibility</div>
                    <div className="w-1/6 text-left font-medium text-[18px] text-[#575757]">Price</div>
                </div>

                {/* Spare Parts List */}
                <div className="flex flex-col flex-1 mt-4">
                    {sparePartsData.parts.map((part, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                            <div className="w-1/3 text-left font-medium text-[18px] text-[#1D1D1D]">{part.name}</div>
                            <div className="w-1/6 text-left font-medium text-[18px] text-[#1D1D1D]">{part.units}</div>
                            <div
                                className="w-1/3 text-left font-medium text-[18px] text-[#1D1D1D] capitalize">{part.compatibility}</div>
                            <div
                                className="w-1/6 text-left font-medium text-[18px] text-[#1D1D1D]">LKR {part.price.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </DetailsModal>
    );
};

export default SparePartsModal;
