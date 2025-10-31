import React from "react";
import DetailsModal from "@/components/DetailsModal";

interface ComplainModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ComplainModal({ isOpen, onClose }: ComplainModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <DetailsModal title={"Recent Complain"} isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="mt-8 flex text-gray-500">
                    <div className="w-[197px] border-b-[1.5px] border-gray-300 pb-2 text-lg font-medium">
                        Date
                    </div>
                    <div className="w-[255px] border-b-[1.5px] border-gray-300 pb-2 text-lg font-medium">
                        Category
                    </div>
                    <div className="w-[208px] border-b-[1.5px] border-gray-300 pb-2 text-lg font-medium">
                        Status
                    </div>
                    <div className="w-[265px] border-b-[1.5px] border-gray-300 pb-2 text-lg font-medium">
                        Preferred Solution
                    </div>
                    <div className="w-[302px] border-b-[1.5px] border-gray-300 pb-2 text-lg font-medium">
                        Comment
                    </div>
                </div>

                {/* Table Row */}
                <div className="mt-4 flex items-center">
                    <div className="w-[197px] text-lg font-medium text-black">
                        21.03.2025
                    </div>
                    <div className="w-[255px] text-lg font-medium text-black">
                        Service Park
                    </div>
                    <div className="w-[208px] text-lg font-medium">
                    <span className="rounded-[20px] bg-[#039855] px-4 py-1 text-white">
                      Completed
                    </span>
                    </div>
                    <div className="w-[265px] text-lg font-medium text-black">
                        Replacement
                    </div>
                    <div className="w-[302px] text-lg font-medium text-black">
                        Spare part replaced
                    </div>
                </div>
            </div>
        </DetailsModal>
        // <div className="fixed z-50 flex items-center justify-center p-4">
        //     {/* Modal Overlay */}
        //     <div
        //         className="fixed inset-0 bg-white/30 bg-opacity-30"
        //         onClick={onClose}
        //     ></div>
        //
        //     {/* Modal Content */}
        //     <div className="relative z-50 w-[1305px] h-[242px] transform rounded-[45px] border border-[#E7E7E7] bg-[#FFFFFFB2] p-8 text-left shadow-lg backdrop-blur-[30px]">
        //         <div className="flex items-center justify-between">
        //             <h2 className="text-2xl font-semibold text-black">
        //                 Recent Complain
        //             </h2>
        //             <button type="button" onClick={onClose}>
        //                 <Image
        //                     src="/close-icon.svg"
        //                     alt="Close"
        //                     width={24}
        //                     height={24}
        //                 />
        //             </button>
        //         </div>
        //
        //         {/* Table Headers */}
        //
        //     </div>
        // </div>
    );
}