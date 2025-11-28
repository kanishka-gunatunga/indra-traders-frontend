/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Image from "next/image";
import DashboardCard, {CardItemProps} from "@/components/DashboardCard";
import React, {useState} from "react";
import ComplainModal from "@/components/ComplainModal";
import InquiriesModal from "@/components/InquiriesModal";
// import VehicleSalesModal from "@/components/VehicleSalesModal";
import ServiceParkModal from "@/components/ServiceBookingModal";
import SparePartsModal from "@/components/SparePartsModal";
import FastTrackModal from "@/components/FastTrackModal";
import DetailsModal from "@/components/DetailsModal";

const customerDetails = [
    {
        title: "Vehicle Number",
        value: "CAB - 5875",
        editable: false,
    },
    {
        title: "Phone Number",
        value: "077- 5425658",
        editable: false,
    },
    {
        title: "WhatsApp Number",
        value: "077- 5425658",
        editable: false,
    },
    {
        title: "Email Address",
        value: "Emily@info.com",
        editable: true,
    },
    {
        title: "Customer Name",
        value: "Emily Charlotte",
        editable: true,
    },
    {
        title: "Convenient Branch",
        value: "Bambalapitiya",
        editable: false,
    },
    {
        title: "ID Number",
        value: "200045754536",
        editable: true,
    },
    {
        title: "City",
        value: "Maharagama",
        editable: true,
    },
    {
        title: "Gender",
        value: "Female",
        editable: false,
    },
    {
        title: "Customer Type",
        value: "Individual",
        editable: false,
    },
    {
        title: "Profession",
        value: "Engineer",
        editable: true,
    },
    {
        title: "Lead Source",
        value: "Direct Call",
        editable: false,
    },
];

const tabs = [
    {label: "Customer Calls", active: true},
    {label: "Vehicle Sales", active: false},
    {label: "Service Park", active: false},
    {label: "Spare Parts", active: false},
    {label: "Fast Track", active: false},
];


const mockVehicleData = {
    title: "Honda Civic 2019",
    image: "/car1.png",
    price: "LKR 6,500,000",
    details: {
        millage: "50,000 km",
        owners: "2",
        vehicleNo: "ITPL12245874565",
        color: "White",
        capacity: "5 seats",
        model: "Civic",
        fuel: "Petrol",
        transmission: "Auto",
        year: "2019",
        grade: "FK7 Ex Tech Pack Edition",
    },
    thumbnailImages: [
        "/car1.png",
        "/car2.png",
        "/car3.png",
        "/car4.png",
        "/car5.png",
    ],
    salesPerson: "Guy Hawkins",
    purchaseDate: "12 March 2025",
};


const vehicleDetails = [
    {label: "Millage:", value: "210,000km"},
    {label: "No. of Owners:", value: "2"},
    {label: "Vehicle No:", value: "Brand New"},
    {label: "Color:", value: "Rallye Red"},
    {label: "Capacity:", value: "2800cc"},
    {label: "Model:", value: "2020 Toyota Hilux GR S"},
    {label: "Fuel:", value: "Diesel"},
    {
        label: "Transmission:",
        value: "Continuously Variable Transmission (CVT)",
    },
    {label: "Year:", value: "2020"},
    {label: "Grade:", value: "GR S"},
];


const mockServiceData = {
    invoiceNo: "INV123456",
    date: "18 September 2025",
    serviceAdvisor: "John Doe",
    branch: "Colombo",
    line: "Line A",
    repairs: [
        {name: "Oil Change", price: 5000},
        {name: "Brake Pad Replacement", price: 15000},
        {name: "Tire Rotation", price: 3000},
    ],
};

const mockSparePartsData = {
    invoiceNo: "INV34556",
    date: "12 Dec 2024",
    parts: [
        {name: "Brake Fluid - BF-DOT4", units: 2, compatibility: "Hydraulic Brake Systems", price: 5500},
        {name: "Engine Oil - EO-5W30", units: 4, compatibility: "Petrol And Diesel Engines", price: 6800},
        {name: "Coolant - CC-50/50", units: 3, compatibility: "Radiator Systems", price: 3200},
    ],
};

const mockFastTrackData = {
    requests: [
        {
            vehicle: "Toyota Hilux",
            type: "SUV",
            grade: "SR5",
            year: "2020",
            mileage: "210,000km",
            priceRange: "20,000,000 - 22,500,000",
            status: "Ongoing",
        },
        {
            vehicle: "Honda Civic",
            type: "Sedan",
            grade: "EX",
            year: "2019",
            mileage: "150,000km",
            priceRange: "6,000,000 - 6,800,000",
            status: "Won",
        },
    ],
};

export default function Dashboard() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<CardItemProps | null>(null);
    const [isVehicleSalesModalOpen, setIsVehicleSalesModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<typeof mockVehicleData | null>(null);
    const [isServiceParkModalOpen, setIsServiceParkModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<typeof mockServiceData | null>(null);
    const [isSparePartsModalOpen, setIsSparePartsModalOpen] = useState(false);
    const [selectedSpareParts, setSelectedSpareParts] = useState<typeof mockSparePartsData | null>(null);
    const [isFastTrackModalOpen, setIsFastTrackModalOpen] = useState(false);
    const [selectedFastTrack, setSelectedFastTrack] = useState<typeof mockFastTrackData | null>(null);

    const openComplainModal = () => setIsModalOpen(true);
    const closeComplainModal = () => setIsModalOpen(false);


    const openInquiryModal = (inquiryData: CardItemProps) => {
        setSelectedInquiry(inquiryData);
        setIsInquiryModalOpen(true);
    };

    const closeInquiryModal = () => {
        setIsInquiryModalOpen(false);
        setSelectedInquiry(null);
    };

    const openVehicleSalesModal = () => {
        setSelectedVehicle(mockVehicleData);
        setIsVehicleSalesModalOpen(true);
    };

    const closeVehicleSalesModal = () => {
        setIsVehicleSalesModalOpen(false);
        setSelectedVehicle(null);
    };

    const openServiceParkModal = () => {
        setSelectedService(mockServiceData);
        setIsServiceParkModalOpen(true);
    };

    const closeServiceParkModal = () => {
        setIsServiceParkModalOpen(false);
        setSelectedService(null);
    };

    const openSparePartsModal = () => {
        setSelectedSpareParts(mockSparePartsData);
        setIsSparePartsModalOpen(true);
    };

    const closeSparePartsModal = () => {
        setIsSparePartsModalOpen(false);
        setSelectedSpareParts(null);
    };

    const openFastTrackModal = () => {
        setSelectedFastTrack(mockFastTrackData);
        setIsFastTrackModalOpen(true);
    };

    const closeFastTrackModal = () => {
        setIsFastTrackModalOpen(false);
        setSelectedFastTrack(null);
    };


    const recentInquiriesData: CardItemProps[] = [
        {
            primaryText: "Toyota Hilux",
            secondaryText: "Sales: Ongoing",
            status: "ongoing",
            date: "08 Sep 2025",
            onViewClick: (item: CardItemProps) => openInquiryModal(item),
        },
        {
            primaryText: "Toyota Hilux",
            secondaryText: "Sales: Won",
            status: "won",
            date: "08 Sep 2025",
            onViewClick: (item: CardItemProps) => openInquiryModal(item),
        },
        {
            primaryText: "Toyota Hilux",
            secondaryText: "Sales: Won",
            status: "won",
            date: "08 Sep 2025",
            onViewClick: (item: CardItemProps) => openInquiryModal(item),
        },
    ];

    const serviceBookingsData: CardItemProps[] = [
        {
            primaryText: "INV34556",
            secondaryText: "CAB-8241",
            date: "08 Sep 2025",
        },
        {
            primaryText: "INV96453",
            secondaryText: "CAA-7354",
            date: "08 Sep 2025",
        },
        {
            primaryText: "INV08863",
            secondaryText: "AAA-1586",
            date: "08 Sep 2025",
        },
    ];


    const sparePartsData: CardItemProps[] = [
        {
            primaryText: "Nissan March",
            secondaryText: "INV34556",
            date: "08 Sep 2025",
        },
        {
            primaryText: "Nissan GT-R (R35)",
            secondaryText: "INV34556",
            date: "08 Sep 2025",
        },
        {
            primaryText: "Nissan GT-R (R35)",
            secondaryText: "INV34556",
            date: "08 Sep 2025",
        },
    ];

    const fastTrackData: CardItemProps[] = [
        {
            primaryText: "Toyota Hilux",
            secondaryText: "Sales: Ongoing",
            status: "ongoing",
            date: "08 Sep 2025",
        },
        {
            primaryText: "Toyota Hilux",
            secondaryText: "Sales: Won",
            status: "won",
            date: "08 Sep 2025",
        },
        {
            primaryText: "Toyota Hilux",
            secondaryText: "Sales: Won",
            status: "won",
            date: "08 Sep 2025",
        },
    ];


    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                {/* Welcome message */}
                <h1 className="text-[25px] font-bold text-[#1D1D1D] ml-8">Welcome Back, Risi Fernando</h1>

                {/* Call Info Card */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[20px] border border-[#E0E0E0] px-14 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-3">
                            {/*<FiPhone size={24} className="text-red-700" />*/}
                            <div className="h-10 w-10">
                                <Image src="/tel.png" alt="" width={200} height={200}/>
                            </div>

                            <div>
                                <p className="font-semibold text-black text-xl">Calling Emily Charlotte....</p>
                                <p className="text-[#575757] text-[17px] flex items-center space-x-1">
                                    <span>Today’s her birthday</span>
                                    <span role="img" aria-label="birthday cake"><Image src="/cake.png" alt=""
                                                                                       width={200} height={200}
                                                                                       className="w-4 h-4"/></span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-36 montserrat">
                        <div className="flex flex-col space-y-1">
                            <p className="grid grid-cols-2 gap-5">
                                <span className="font-medium text-lg text-[#1D1D1D]">Last Call Date: </span>
                                <span className="font-medium text-lg text-[#575757]">12 Dec 2024</span>
                            </p>
                            <p className="grid grid-cols-2 gap-5">
                                <span className="font-medium text-lg text-[#1D1D1D]">Assigned Agent: </span>
                                <span className="font-medium text-lg text-[#575757]">Charley Macros</span>
                            </p>
                        </div>
                        <button
                            id="complain-btn"
                            onClick={openComplainModal}
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                            {/*<MdWarningAmber size={24} className="text-red-700"/>*/}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1 21L12 2L23 21H1ZM4.45 19H19.55L12 6L4.45 19ZM12 18C12.2833 18 12.521 17.904 12.713 17.712C12.905 17.52 13.0007 17.2827 13 17C12.9993 16.7173 12.9033 16.48 12.712 16.288C12.5207 16.096 12.2833 16 12 16C11.7167 16 11.4793 16.096 11.288 16.288C11.0967 16.48 11.0007 16.7173 11 17C10.9993 17.2827 11.0953 17.5203 11.288 17.713C11.4807 17.9057 11.718 18.0013 12 18ZM11 15H13V10H11V15Z"
                                    fill="#575757"/>
                                <circle cx="17" cy="7" r="4.75" fill="#DB2727" stroke="#FBF9F9" strokeWidth="1.5"/>
                            </svg>
                        </button>
                    </div>

                </section>

                <div className="bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[20px] px-12 py-10">
                    <div className="flex justify-between">
                        <h2 className="text-[22px] font-semibold text-black mb-6">Customer Details</h2>
                        <button
                            className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
                            {/*<MdWarningAmber size={24} className="text-red-700"/>*/}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17"
                                    stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M16 4.99998L19 7.99998M20.385 6.58499C20.7788 6.19114 21.0001 5.65697 21.0001 5.09998C21.0001 4.543 20.7788 4.00883 20.385 3.61498C19.9912 3.22114 19.457 2.99988 18.9 2.99988C18.343 2.99988 17.8088 3.22114 17.415 3.61498L9 12V15H12L20.385 6.58499Z"
                                    stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>


                    {/* Customer Details Cards */}
                    <section className="grid grid-cols-4 gap-6">
                        {customerDetails.map(({title, value}, idx) => (
                            <div
                                key={idx}
                                className="relative bg-[#FFFFFF] backdrop-blur-[10] rounded-[20px] p-5 flex flex-col gap-4"
                            >
                                {/*<div className="flex items-center justify-between">*/}
                                {/*    {editable && (*/}
                                {/*        <button*/}
                                {/*            className="w-8 h-8 rounded-full bg-white bg-opacity-50 flex items-center justify-center shadow text-gray-700 absolute top-4 right-4">*/}
                                {/*            <FiEdit size={16}/>*/}
                                {/*        </button>*/}
                                {/*    )}*/}
                                {/*    {!editable && (*/}
                                {/*        <button*/}
                                {/*            className="w-8 h-8 rounded-full bg-[#EBEBEB8C]/55 border border-[#E0E0E0] flex items-center justify-center text-gray-700 absolute top-4 right-4">*/}
                                {/*            /!*<FiChevronDown size={16}/>*!/*/}
                                {/*            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                {/*                <path d="M10.1044 11.7857H5.62613C5.37236 11.7857 5.15979 11.6997 4.98842 11.5277C4.81705 11.3558 4.73107 11.1432 4.73047 10.89C4.72987 10.6369 4.81586 10.4243 4.98842 10.2523C5.16098 10.0804 5.37355 9.99439 5.62613 9.99439H10.1044V5.51611C10.1044 5.26234 10.1904 5.04977 10.3624 4.8784C10.5343 4.70704 10.7469 4.62105 11.0001 4.62046C11.2532 4.61986 11.4661 4.70584 11.6387 4.8784C11.8112 5.05097 11.8969 5.26354 11.8957 5.51611V9.99439H16.374C16.6278 9.99439 16.8406 10.0804 17.0126 10.2523C17.1846 10.4243 17.2702 10.6369 17.2696 10.89C17.269 11.1432 17.1831 11.3561 17.0117 11.5286C16.8403 11.7012 16.6278 11.7869 16.374 11.7857H11.8957V16.264C11.8957 16.5177 11.8097 16.7306 11.6378 16.9026C11.4658 17.0745 11.2532 17.1602 11.0001 17.1596C10.7469 17.159 10.5343 17.073 10.3624 16.9017C10.1904 16.7303 10.1044 16.5177 10.1044 16.264V11.7857Z" fill="#575757"/>*/}
                                {/*            </svg>*/}
                                {/*        </button>*/}
                                {/*    )}*/}
                                {/*</div>*/}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-[17px] text-[#1D1D1D]">{title}</span>
                                    <span
                                        className="font-medium text-[#575757] text-[17px] flex flex-row items-center gap-1">{value}
                                        <span><svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                                   xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 8.03186L10 13.0319L5 8.03186H15Z" fill="#575757"/>
                                    </svg>
                                    </span></span>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="py-10">
                    {/* Customer Details Cards */}
                    <section className="grid grid-cols-3 justify-between gap-6">
                        <DashboardCard
                            title="Recent Inquiries"
                            icon="/dashboard/question-line.svg"
                            backgroundColor="#1862FD"
                            data={recentInquiriesData}
                            viewAllLink="/service-bookings"
                            onItemClick={openInquiryModal}
                        />
                        <DashboardCard
                            title="Recent Complains"
                            icon="/dashboard/warning-outline.svg"
                            backgroundColor="#DB2727"
                            data={sparePartsData}
                            viewAllLink="/spare-parts"
                            onItemClick={openComplainModal}
                        />
                        <DashboardCard
                            title="Recent Vehicle Sales"
                            icon="/dashboard/car-line.svg"
                            backgroundColor="#00A93F"
                            data={fastTrackData}
                            viewAllLink="/fast-track"
                            onItemClick={openVehicleSalesModal}
                        />
                        <DashboardCard
                            title="Recent Service Bookings"
                            icon="/dashboard/spanner-outline.svg"
                            backgroundColor="#9C1EFC"
                            data={serviceBookingsData}
                            viewAllLink="/service-bookings"
                            onItemClick={openServiceParkModal}
                        />
                        <DashboardCard
                            title="Recent Spare Parts"
                            icon="/dashboard/setting-line.svg"
                            backgroundColor="#F74E00"
                            data={sparePartsData}
                            viewAllLink="/spare-parts"
                            onItemClick={openSparePartsModal}
                        />
                        <DashboardCard
                            title="Recent Fast Track"
                            icon="/dashboard/car-search.svg"
                            backgroundColor="#DB2784"
                            data={fastTrackData}
                            viewAllLink="/fast-track"
                            onItemClick={openFastTrackModal}
                        />
                    </section>
                </div>
                <ComplainModal isOpen={isModalOpen} onClose={closeComplainModal}/>
                <InquiriesModal
                    isOpen={isInquiryModalOpen}
                    onClose={closeInquiryModal}
                    inquiryData={selectedInquiry}
                />
                {/*<VehicleSalesModal*/}
                {/*    isOpen={isVehicleSalesModalOpen}*/}
                {/*    onClose={closeVehicleSalesModal}*/}
                {/*    vehicleData={selectedVehicle}*/}
                {/*/>*/}
                <ServiceParkModal
                    isOpen={isServiceParkModalOpen}
                    onClose={closeServiceParkModal}
                    serviceData={selectedService}
                />
                <SparePartsModal
                    isOpen={isSparePartsModalOpen}
                    onClose={closeSparePartsModal}
                    sparePartsData={selectedSpareParts}
                />
                <FastTrackModal
                    isOpen={isFastTrackModalOpen}
                    onClose={closeFastTrackModal}
                    fastTrackData={selectedFastTrack}
                />
            </main>


            {isVehicleSalesModalOpen && (
                <DetailsModal
                    isOpen={isVehicleSalesModalOpen}
                    onClose={() => setIsVehicleSalesModalOpen(false)}
                >
                    <div>
                        <div className="flex flex-row gap-2">
                            <h2 className="text-[22px] font-semibold text-[#000000] montserrat">2025 Honda Civic Hatchback</h2>
                            <div className="flex flex-row items-center gap-3 mt-1">
                            <span
                                className="bg-[#DFDFDF] rounded-[20px] px-4 py-1 text-[15px] font-medium text-[#1D1D1D]">
                                Sales person: Guy Hawkins
                            </span>
                                <span
                                    className="bg-[#039855] rounded-[20px] px-4 py-1 text-[15px] font-medium text-white">
                                Purchase: 12 Dec 2024
                            </span>
                            </div>
                        </div>
                        <div className="w-full flex justify-center mt-8 gap-6">
                            {/* Left: Images */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Main vehicle image */}
                                <div
                                    className="w-[600px] max-[1250px]:w-[500px] h-[331px] lg:h-[400px] border border-gray-200 bg-white/80 backdrop-blur-[50px] rounded-[30px] shadow-md flex items-center justify-center bg-cover bg-center"
                                    style={{backgroundImage: `url("/images/main-vehicle.png")`}}
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
                                            style={{backgroundImage: `url(${img})`}}
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
                    </div>
                </DetailsModal>
            )}
        </div>
    );
}
