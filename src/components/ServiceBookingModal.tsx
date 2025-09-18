"use client";

interface ServiceParkModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceData: {
        invoiceNo: string;
        date: string;
        serviceAdvisor: string;
        branch: string;
        line: string;
        repairs: { name: string; price: number }[];
    } | null;
}

const ServiceParkModal = ({ isOpen, onClose, serviceData }: ServiceParkModalProps) => {
    if (!isOpen || !serviceData) {
        return null;
    }

    const totalEstimatePrice = serviceData.repairs.reduce((sum, repair) => sum + repair.price, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative z-50 w-[1305px] h-[639px] transform rounded-[45px] border border-[#E7E7E7] bg-white bg-opacity-70 p-8 text-left shadow-lg backdrop-blur-[30px] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <h2 className="text-[22px] font-semibold text-[#000000] montserrat">Service Summary</h2>
                        <div className="flex flex-row gap-2">
              <span className="bg-[#DFDFDF] rounded-[20px] px-4 py-1 text-[15px] font-medium text-[#1D1D1D]">
                {serviceData.invoiceNo}
              </span>
                            <span className="bg-[#039855] rounded-[20px] px-4 py-1 text-[15px] font-medium text-white">
                {serviceData.date}
              </span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose}>
                        <img src="/close-icon.svg" alt="Close" width={24} height={24} />
                    </button>
                </div>

                {/* Details Section */}
                <div className="mt-8 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="flex flex-col">
                            <span className="font-medium text-[18px] text-[#1D1D1D]">Service Advisor:</span>
                            <span className="font-medium text-[18px] text-[#575757]">{serviceData.serviceAdvisor}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="flex flex-col">
                            <span className="font-medium text-[18px] text-[#1D1D1D]">Branch:</span>
                            <span className="font-medium text-[18px] text-[#575757]">{serviceData.branch}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-12">
                        <div className="flex flex-col">
                            <span className="font-medium text-[18px] text-[#1D1D1D]">Line:</span>
                            <span className="font-medium text-[18px] text-[#575757]">{serviceData.line}</span>
                        </div>
                    </div>
                </div>

                {/* Repairs Table Header */}
                <div className="mt-8 border-b-2 border-gray-300 pb-2 flex justify-between items-center">
                    <span className="font-medium text-[18px] text-[#575757]">Repairs</span>
                    <span className="font-medium text-[18px] text-[#575757]">Price</span>
                </div>

                {/* Repairs List */}
                <div className="flex flex-col flex-1 mt-4">
                    {serviceData.repairs.map((repair, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                            <span className="font-medium text-[18px] text-[#1D1D1D]">{repair.name}</span>
                            <span className="font-medium text-[18px] text-[#1D1D1D]">LKR {repair.price.toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                {/* Total Estimate Price */}
                <div className="border-t border-b border-[#575757] flex justify-between items-center py-4 mt-auto">
                    <span className="font-bold text-[18px] text-[#1D1D1D]">Total Estimate Price</span>
                    <span className="font-bold text-[18px] text-[#1D1D1D]">LKR {totalEstimatePrice.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default ServiceParkModal;
