"use client";

import DetailsModal from "@/components/DetailsModal";

interface FastTrackRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    fastTrackData: {
        requests: {
            vehicle: string;
            type: string;
            grade: string;
            year: string;
            mileage: string;
            priceRange: string;
            status: string;
        }[];
    } | null;
}

const FastTrackModal = ({ isOpen, onClose, fastTrackData }: FastTrackRequestModalProps) => {
    if (!isOpen || !fastTrackData) {
        return null;
    }

    // A simple function to determine the color of the status badge
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ongoing':
                return 'bg-[#8D27DB]'; // Purple
            case 'won':
                return 'bg-[#039855]'; // Green
            default:
                return 'bg-[#DFDFDF]'; // Default gray
        }
    };

    return (
        <DetailsModal title="Fast Track Request" isOpen={isOpen} onClose={onClose}>
        <div className="min-w-5xl">
            {/* Table Header */}
            <div className="mt-8 border-b-2 border-gray-300 pb-2 flex justify-between items-center">
                <div className="w-[17%] font-medium text-[18px] text-[#575757]">Vehicle</div>
                <div className="w-[10%] font-medium text-[18px] text-[#575757]">Type</div>
                <div className="w-[9%] font-medium text-[18px] text-[#575757]">Grade</div>
                <div className="w-[9%] font-medium text-[18px] text-[#575757]">Year</div>
                <div className="w-[14%] font-medium text-[18px] text-[#575757]">Mileage</div>
                <div className="w-[22%] font-medium text-[18px] text-[#575757]">Price Range</div>
                <div className="w-[16%] font-medium text-[18px] text-[#575757]">Status</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col mt-4">
                {fastTrackData.requests.map((request, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                        <div className="w-[17%] font-medium text-[18px] text-[#1D1D1D]">{request.vehicle}</div>
                        <div className="w-[10%] font-medium text-[18px] text-[#1D1D1D]">{request.type}</div>
                        <div className="w-[9%] font-medium text-[18px] text-[#1D1D1D]">{request.grade}</div>
                        <div className="w-[9%] font-medium text-[18px] text-[#1D1D1D]">{request.year}</div>
                        <div className="w-[14%] font-medium text-[18px] text-[#1D1D1D]">{request.mileage}</div>
                        <div className="w-[22%] font-medium text-[18px] text-[#1D1D1D]">{request.priceRange}</div>
                        <div className="w-[16%] flex items-center">
                <span className={`${getStatusColor(request.status)} rounded-[22.9787px] px-4 py-1 text-[15px] font-medium text-white`}>
                  {request.status}
                </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </DetailsModal>
    );
};

export default FastTrackModal;
