/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Image from "next/image";
import React, {useState} from "react";
import Modal from "@/components/Modal";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSpareCreateSale} from "@/hooks/useSparePartSales";
import FormField from "@/components/FormField";
import {useCreateUnavailableSparePart} from "@/hooks/useUnavailable";
import Toast from "@/components/Toast";
import {useToast} from "@/hooks/useToast";
import {useCurrentUser} from "@/utils/auth";


interface BranchStock {
    location: string;
    availability: 'Physical' | 'On Order';
    count: number;
}

interface StockItem {
    name: string;
    price: string;
    physicalStock: number;
    onOrderStock: number;
    branches: BranchStock[];
}


export const spareSaleSchema = z.object({
    date: z.string().min(1, "Date is required"),
    // customer_id: z.string().min(1, "Customer ID is required"),
    vehicle_make: z.string().min(1, "Vehicle make is required"),
    vehicle_model: z.string().min(1, "Vehicle model is required"),
    part_no: z.string().min(1, "Part number is required"),
    year_of_manufacture: z.string().min(1, "Manufacture year is required"),
    additional_note: z.string().optional(),
    customer_name: z.string().min(1, "Customer name is required"),
    contact_number: z.string().min(1, "Contact number is required"),
    // call_agent_id: z.number().int().positive("Call Agent ID is required"),
});

export const unavailableSparePartSchema = z.object({
    vehicle_make: z.string().min(1, "Vehicle make is required"),
    vehicle_model: z.string().min(1, "Vehicle model is required"),
    part_no: z.string().min(1, "Part number is required"),
    year_of_manufacture: z.string().min(1, "Manufacture year is required"),
});

export type SpareSaleFormValues = z.infer<typeof spareSaleSchema>;
export type UnavailableSparePartFormData = z.infer<typeof unavailableSparePartSchema>;

const SpareParts = () => {

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<SpareSaleFormValues>({
        resolver: zodResolver(spareSaleSchema),
    });

    const {
        register: registerUnavailable,
        handleSubmit: handleSubmitUnavailable,
        formState: {errors: unavailableErrors},
        reset: resetUnavailable,
    } = useForm<UnavailableSparePartFormData>({
        resolver: zodResolver(unavailableSparePartSchema),
        defaultValues: {
            vehicle_make: "",
            vehicle_model: "",
            part_no: "",
            year_of_manufacture: "",
        },
    });

    const user = useCurrentUser();
    const userId = Number(user?.id) || 1;

    console.log("Form errors:", errors);

    const createSaleMutation = useSpareCreateSale();
    // const [submitSuccess, setSubmitSuccess] = useState(false);

    const createUnavailableMutation = useCreateUnavailableSparePart();
    // const [unavailableSubmitSuccess, setUnavailableSubmitSuccess] = useState(false);

    const onSubmit = (data: SpareSaleFormValues) => {
        const payload = {
            ...data,
            date: new Date().toISOString().split("T")[0],
            customer_id: "CUS1760981191036",
            call_agent_id: userId,
        };

        console.log("----------payload: ", payload);

        createSaleMutation.mutate(payload, {
            onSuccess: () => {
                // setSubmitSuccess(true);
                showToast("Spare part sale created successfully", "success");
                reset();
                // setTimeout(() => setSubmitSuccess(false), 3000);
            },
            onError: (err: any) => {
                console.error("Error:", err);
                alert("Failed to assign sale");
            },
        });
    };

    const onUnavailableSubmit = (data: UnavailableSparePartFormData) => {
        const payload = {
            call_agent_id: userId,
            ...data,
            year_of_manufacture: parseInt(data.year_of_manufacture, 10),
        };
        createUnavailableMutation.mutate(payload, {
            onSuccess: () => {
                // setUnavailableSubmitSuccess(true);
                showToast("Unavailable spare part added successfully", "success");
                resetUnavailable();
                // setIsSpareAvailabilityModalOpen(false);
                // setTimeout(() => setUnavailableSubmitSuccess(false), 3000);
            },
            onError: (error) => {
                console.error("Error creating unavailable spare part:", error);
                alert("Failed to create unavailable spare part");
            },
        });
    };


    const [showStockAvailability, setShowStockAvailability] = useState(true);

    const [isStockDetailsModalOpen, setIsStockDetailsModalOpen] = useState(false);
    const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
    const [isHoveringShare, setIsHoveringShare] = useState(false);

    const [isSpareAvailabilityModalOpen, setIsSpareAvailabilityModalOpen] = useState(false);
    const [showLoyaltyAndPromotions, setShowLoyaltyAndPromotions] = useState(false);

    const [copiedIndex, setCopiedIndex] = useState<null | number>(null);

    const {toast, showToast, hideToast} = useToast();

    const stockData = [
        {
            name: 'Brake Fluid - BF-DOT4',
            stock: '24',
            price: 'LKR 5,500',
            compatibility: 'DOT 4 standard for hydraulic brake systems',
        },
        {
            name: 'Brake Fluid - BF-DOT4',
            stock: '24',
            price: 'LKR 5,500',
            compatibility: 'DOT 4 standard for hydraulic brake systems',
        },
        {
            name: 'Brake Fluid - BF-DOT4',
            stock: '24',
            price: 'LKR 5,500',
            compatibility: 'DOT 4 standard for hydraulic brake systems',
        },
        {
            name: 'Brake Fluid - BF-DOT4',
            stock: '24',
            price: 'LKR 5,500',
            compatibility: 'DOT 4 standard for hydraulic brake systems',
        },
        {
            name: 'Brake Fluid - BF-DOT4',
            stock: '24',
            price: 'LKR 5,500',
            compatibility: 'DOT 4 standard for hydraulic brake systems',
        },
    ];


    const getBranchDataForItem = (itemName: string, price: string): StockItem => {
        return {
            name: itemName,
            price: price,
            physicalStock: 62,
            onOrderStock: 55,
            branches: [
                {location: "Colombo Main", availability: "Physical", count: 24},
                {location: "Kandy Branch", availability: "Physical", count: 18},
                {location: "Matara Branch", availability: "Physical", count: 12},
                {location: "Jaffna Branch", availability: "Physical", count: 8},
                {location: "Galle Branch", availability: "On Order", count: 30},
                {location: "Negombo Branch", availability: "On Order", count: 25},
            ]
        };
    };


    const handleViewStockClick = (item: any, e: React.MouseEvent) => {
        e.stopPropagation(); // Stop click from propagating to the row
        const itemDetails = getBranchDataForItem(item.name, item.price);
        setSelectedStockItem(itemDetails);
        setIsStockDetailsModalOpen(true);
    };


    const vehicleData = [
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: 'GT-R (R35)'},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: 'GT-R (R35)'},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: 'GT-R (R35)'},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: 'GT-R (R35)'},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: 'GT-R (R35)'},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: 'GT-R (R35)'},
    ];

    const loyaltyData = [
        {
            category: 'Indra Traders (ITPL)',
            points: '500',
            promoCode: 'NEWBUY500'
        },
        {
            category: 'Indra Traders (ITPL)',
            points: '500',
            promoCode: 'NEWBUY500'
        },
        {
            category: 'Indra Traders (ITPL)',
            points: '500',
            promoCode: 'NEWBUY500'
        },
        {
            category: 'Indra Traders (ITPL)',
            points: '500',
            promoCode: 'NEWBUY500'
        },
    ];


    const handleCopy = (promoCode: string, index: number) => {
        navigator.clipboard.writeText(promoCode)
            .then(() => {
                setCopiedIndex(index);
                setTimeout(() => setCopiedIndex(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };


    const generateShareText = (item: StockItem) => {
        return `Stock Availability Update:\n\nItem: ${item.name}\nPrice: ${item.price}\n\nTotal Physical Stock: ${item.physicalStock}\nTotal On Order: ${item.onOrderStock}\n\n*These details are valid for 24 hours.*`;
    };

    const handleShareWhatsapp = () => {
        if (!selectedStockItem) return;
        const text = encodeURIComponent(generateShareText(selectedStockItem));
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleShareEmail = () => {
        if (!selectedStockItem) return;
        const subject = encodeURIComponent(`Stock Inquiry: ${selectedStockItem.name}`);
        const body = encodeURIComponent(generateShareText(selectedStockItem));
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handleShareMessage = () => {
        if (!selectedStockItem) return;
        const body = encodeURIComponent(generateShareText(selectedStockItem));
        // Note: 'sms:' protocol behavior varies by OS (iOS vs Android separator & body param)
        window.location.href = `sms:?&body=${body}`;
    };


    const handleStockItemClick = () => {
        setShowLoyaltyAndPromotions(true);
    };


    const mockData = [
        {make: 'Nissan', model: 'GT-R (R35)', year: 2020, transmission: 'Automatic', price: 'Rs 75,300,000'},
        {make: 'Toyota', model: 'Supra (A90)', year: 2021, transmission: 'Automatic', price: 'Rs 54,500,000'},
        {make: 'Ford', model: 'Mustang', year: 2020, transmission: 'Manual', price: 'Rs 40,000,000'},
        {make: 'Chevrolet', model: 'Corvette (C8)', year: 2021, transmission: 'Automatic', price: 'Rs 75,000,000'},
        {make: 'Porsche', model: '911 Carrera', year: 2020, transmission: 'Automatic', price: 'Rs 55,000,000'},
        {make: 'Mazda', model: 'MX-5 Miata', year: 2021, transmission: 'Manual', price: 'Rs 35,000,000'},
        {make: 'BMW', model: 'M4', year: 2021, transmission: 'Automatic', price: 'Rs 80,000,000'},
        {make: 'Subaru', model: 'WRX STI', year: 2020, transmission: 'Manual', price: 'Rs 45,000,000'},
        {make: 'Honda', model: 'NSX', year: 2021, transmission: 'Automatic', price: 'Rs 80,000,000'},
    ];


    const vehicleMakeOptions = mockData.map((vehicle) => ({
        value: vehicle.make,
        label: vehicle.make,
    }));

    const vehicleModelOptions = mockData.map((vehicle) => ({
        value: vehicle.model,
        label: vehicle.model,
    }));


    const manufactureYearOptions = [2020, 2021, 2022, 2023, 2024, 2025].map((year) => ({
        value: year.toString(),
        label: year.toString(),
    }));

    const partNo = [
        {value: "BRK1234", label: "BRK1234"},
        {value: "EC-005", label: "EC-005"},
        {value: "BP-002", label: "BP-002"},
    ];

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />
            <div
                className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

                <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                    <h1 className="text-2xl font-extrabold mb-4">Indra Motor Spare Sales Dashboard</h1>

                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="font-semibold text-[22px] mb-6">Filters</h2>
                                <div>
                                    <button
                                        className="ml-auto mt-8 md:mt-0 text-[#DB2727] text-base font-medium rounded-full px-9 py-2 hover:text-red-700 transition cursor-pointer">
                                        Clear all
                                    </button>
                                    <button
                                        id="applyBtn"
                                        onClick={() => setShowStockAvailability(true)}
                                        className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition cursor-pointer">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <VerificationDropdown label="Vehicle Make" placeholder="Select Vehicle Make"
                                                      isIcon={true}/>
                                <VerificationDropdown label="Vehicle Model" placeholder="Select Vehicle Model"
                                                      isIcon={true}/>
                                <VerificationDropdown label="Part No." placeholder="Select Part No."
                                                      isIcon={true}/>
                                <VerificationDropdown label="Year of Manufacture" placeholder="Manufacture Year"
                                                      isIcon={true}/>
                            </div>
                        </div>
                    </section>

                    {showStockAvailability && (
                        <section
                            id="stock-availability-section"
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                            <div
                                className="w-full">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Stock
                                        Availability</h2>
                                    <div className="flex flex-row gap-2">
                                        {/*<button*/}
                                        {/*    className="ml-auto text-white text-base font-medium rounded-full cursor-pointer">*/}
                                        {/*    <Image src="/message.svg" alt="availability" height={36}*/}
                                        {/*           width={36} className="h-12 w-12"/>*/}
                                        {/*</button>*/}
                                        {/*<button*/}
                                        {/*    className="ml-auto text-white text-base font-medium rounded-full cursor-pointer">*/}
                                        {/*    <Image src="/whatsapp.svg" alt="availability" height={36}*/}
                                        {/*           width={36} className="h-12 w-12"/>*/}
                                        {/*</button>*/}
                                        {/*<button*/}
                                        {/*    className="ml-auto text-white text-base font-medium rounded-full cursor-pointer">*/}
                                        {/*    <Image src="/mail.svg" alt="availability" height={36}*/}
                                        {/*           width={36} className="h-12 w-12"/>*/}
                                        {/*</button>*/}
                                        <button
                                            onClick={() => setIsSpareAvailabilityModalOpen(true)}
                                            className="ml-auto text-white text-base font-medium rounded-full cursor-pointer">
                                            <Image src="/spare-availability.svg" alt="availability" height={36}
                                                   width={36} className="h-12 w-12"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Table Headers */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-black">
                                        <thead>
                                        <tr
                                            className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg justify-between">
                                            <th className="py-5 px-4 text-left w-[25%]">Spare Part</th>
                                            {/*<th className="py-5 px-4 text-left w-[20%]">Stock</th>*/}
                                            <th className="py-5 px-4 text-left w-[20%]">Price</th>
                                            <th className="py-5 px-4 text-left w-[35%]">Compatibility</th>
                                            <th className="py-5 px-4 text-left w-[20%]">Stock</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {stockData.map((item, index) => (
                                            <tr key={index} onClick={handleStockItemClick}
                                                className="text-lg font-medium text-[#1D1D1D]">
                                                <td className="py-4 px-4 cursor-pointer">{item.name}</td>
                                                {/*<td className="py-4 px-4 cursor-pointer">{item.stock}</td>*/}
                                                <td className="py-4 px-4 cursor-pointer">{item.price}</td>
                                                <td className="py-4 px-4 cursor-pointer">{item.compatibility}</td>
                                                <td className="py-4 px-4 cursor-pointer">
                                                    <button
                                                        id="stockViewBtn"
                                                        onClick={(e) => handleViewStockClick(item, e)}
                                                        className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition cursor-pointer">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}


                    {showStockAvailability && showLoyaltyAndPromotions && (
                        <section
                            id="loyalty-section"
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                            <div
                                className="w-full">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Loyalty
                                        Points
                                        &
                                        Promotions</h2>
                                </div>

                                {/* Table Headers */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-black">
                                        <thead>
                                        <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                            <th className="py-5 px-4 text-left">Category</th>
                                            <th className="py-5 px-4 text-left">Points (Loyalty programme)</th>
                                            <th className="py-5 px-4 text-left">Promo Codes (Discount on leasing)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loyaltyData.map((item, index) => (
                                            <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                                <td className="py-4 px-4 text-[#1D1D1D]">{item.category}</td>
                                                <td className="py-4 px-4 text-[#1D1D1D]">{item.points}</td>
                                                <td className="py-4 px-4 items-center flex"><span
                                                    className="mr-8">{item.promoCode}</span>
                                                    <button
                                                        onClick={() => handleCopy(item.promoCode, index)}
                                                        className="font-medium rounded-full">
                                                        <Image src="/copy.svg" alt="info" height={36}
                                                               width={36} className="h-5 w-5"/>
                                                    </button>
                                                    {copiedIndex === index && (
                                                        <span
                                                            className="absolute right-40 transform -translate-y-1/2 ml-2 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                        Copied!
                                                    </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}


                    {showStockAvailability && showLoyaltyAndPromotions && (
                        <section
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 items-center space-y-6 mb-6">
                            <header className="flex items-center space-x-4">
                                <h2 className="font-semibold text-[22px]">Promotions</h2>
                            </header>

                            <div className="space-y-3 montserrat">
                                <p className="text-[#575757] text-[15px] font-normal mb-8">
                                    Lorem ipsum dolor sit amet consectetur. Amet purus et aliquam amet odio nulla ut
                                    quam.
                                    In ut
                                    fames ut adipiscing. Faucibus facilisi mattis duis lobortis rhoncus nibh diam. Etiam
                                    scelerisque mattis sem dolor diam quis vestibulum volutpat pretium. Et odio senectus
                                    id
                                    vitae auctor nisl at turpis id. Neque turpis orci egestas lacus volutpat tellus
                                    morbi
                                    eget
                                    mi. Sed nulla proin ut vivamus sodales.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-[#575757] font-semibold text-[15px] max-w-[600px]">
                                    <li>Free service for one year</li>
                                    <li>Free maintenance checkups for six months.</li>
                                    <li>Free tire rotations for 12 months.</li>
                                    <li>Lifetime engine diagnostic checks.</li>
                                </ul>
                            </div>
                        </section>
                    )}


                    <section
                        id="assign-to-sale-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col"
                              style={{width: "-webkit-fill-available"}}>
                            <div className="space-y-6">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[22px] mb-6">Assign to Sales</h2>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={createSaleMutation.isPending}
                                            className="bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition">
                                            {createSaleMutation.isPending ? "Submitting..." : "Send"}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Ticket Number</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={`ITPL${Date.now()}`}
                                                    disabled
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Date</span>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    {...register("date")}
                                                    placeholder="12 Mar, 2025"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                                {errors.date &&
                                                    <span className="text-red-600 text-sm">{errors.date.message}</span>}
                                            </div>
                                        </label>
                                    </div>
                                    <FormField
                                        label="Customer Name"
                                        placeholder="Emily Charlotte"
                                        type="text"
                                        register={register("customer_name")}
                                        error={errors.customer_name}
                                    />
                                    <FormField
                                        label="Contact Number"
                                        placeholder="077 5647256"
                                        type="text"
                                        register={register("contact_number")}
                                        error={errors.contact_number}
                                    />
                                </div>
                            </div>


                            <div className="flex-1 space-y-6 mt-10">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[19px] mb-6">Spare Part Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <FormField
                                        label="Vehicle Make"
                                        type="select"
                                        isIcon={true}
                                        options={vehicleMakeOptions}
                                        register={register("vehicle_make")}
                                        error={errors.vehicle_make}
                                    />
                                    <FormField
                                        label="Vehicle Model"
                                        type="select"
                                        isIcon={true}
                                        options={vehicleModelOptions}
                                        register={register("vehicle_model")}
                                        error={errors.vehicle_model}
                                    />
                                    <FormField
                                        label="Part No."
                                        placeholder="Enter Part No."
                                        type="select"
                                        isIcon={true}
                                        options={partNo}
                                        register={register("part_no")}
                                        error={errors.part_no}
                                    />
                                    <FormField
                                        label="Manufacture Year"
                                        type="select"
                                        isIcon={true}
                                        options={manufactureYearOptions}
                                        register={register("year_of_manufacture")}
                                        error={errors.year_of_manufacture}
                                    />
                                </div>
                                {/*<div className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                {/*    <span*/}
                                {/*        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Additional Note</span>*/}
                                {/*    <textarea placeholder="Enter Your Note" rows={5}*/}
                                {/*              className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700"/>*/}
                                {/*</div>*/}

                                <FormField
                                    label="Additional Note"
                                    type="textarea"
                                    placeholder="Enter Your Note"
                                    register={register("additional_note")}
                                    error={errors.additional_note}
                                />

                            </div>
                            {/*{submitSuccess && (*/}
                            {/*    <div className="text-green-600 text-sm mt-4">Vehicle sale created successfully!</div>*/}
                            {/*)}*/}
                        </form>
                    </section>

                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Last Spare Part
                                Purchases</h2>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-gray-300 text-gray-500 font-medium text-lg">
                                        <th className="py- px-4 text-left">Date</th>
                                        <th className="py-5 px-4 text-left">Invoice No</th>
                                        <th className="py-5 px-4 text-left">Vehicle</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vehicleData.map((vehicle, index) => (
                                        <tr key={index} className="text-lg font-medium">
                                            <td className="py-4 px-4">{vehicle.date}</td>
                                            <td className="py-4 px-4">{vehicle.invoice}</td>
                                            <td className="py-4 px-4">{vehicle.vehicle}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="flex justify-center items-center h-8 px-4 rounded-md bg-white/30 text-gray-400 font-medium">Prev
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <button className="w-8 h-8 rounded-lg bg-[#DB2727] text-white font-semibold">1
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-white/30 text-gray-700 font-semibold">2
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-white/30 text-gray-700 font-semibold">3
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-white/30 text-gray-700 font-semibold">4
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-white/30 text-gray-700 font-semibold">5
                                        </button>
                                    </div>
                                    <button
                                        className="flex justify-center items-center h-8 px-4 rounded-md bg-white/30 text-gray-700 font-medium">Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {isStockDetailsModalOpen && selectedStockItem && (
                    <Modal
                        title="Stock Availability"
                        onClose={() => setIsStockDetailsModalOpen(false)}
                        isPriorityAvailable={false}
                    >
                        <div className="min-w-[900px] px-2 pb-6 font-montserrat text-[#1D1D1D]">

                            {/* Item Header */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-[24px] font-semibold">{selectedStockItem.name}</h2>
                                    <span
                                        className="text-[20px] text-[#575757] font-medium">{selectedStockItem.price}</span>
                                </div>
                                {/*<div className="flex gap-3">*/}
                                {/*    <button className="opacity-60 hover:opacity-100 transition"><Image src="/message.svg" width={36} height={36} alt="chat" className="h-12 w-12" /></button>*/}
                                {/*    <button className="opacity-60 hover:opacity-100 transition"><Image src="/whatsapp.svg" width={36} height={36} alt="whatsapp" className="h-12 w-12" /></button>*/}
                                {/*    <button className="opacity-60 hover:opacity-100 transition"><Image src="/mail.svg" width={36} height={36} alt="mail" className="h-12 w-12" /></button>*/}
                                {/*</div>*/}

                                <div
                                    className="flex -mt-20 gap-3 relative"
                                    onMouseEnter={() => setIsHoveringShare(true)}
                                    onMouseLeave={() => setIsHoveringShare(false)}
                                >
                                    {/* Warning Banner */}
                                    <div
                                        className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 flex items-center bg-white border border-[#DB272780] border-2 rounded-[20px] px-4 py-1.5 shadow-sm whitespace-nowrap transition-all duration-300 ease-in-out ${
                                            isHoveringShare ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
                                        }`}
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full border-2 border-[#DB2727] text-[#DB2727] flex items-center justify-center text-xs font-bold mr-2">i
                                        </div>
                                        <span className="text-[#DB2727] font-medium text-sm">These details are valid for 24 hours after sharing</span>
                                    </div>

                                    {/* Share Buttons */}
                                    <button
                                        onClick={handleShareMessage}
                                        className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                                        title="Share via SMS"
                                    >
                                        <Image src="/message.svg" width={36} height={36} alt="chat"
                                               className="h-12 w-12"/>
                                    </button>
                                    <button
                                        onClick={handleShareWhatsapp}
                                        className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                                        title="Share via WhatsApp"
                                    >
                                        <Image src="/whatsapp.svg" width={36} height={36} alt="whatsapp"
                                               className="h-12 w-12"/>
                                    </button>
                                    <button
                                        onClick={handleShareEmail}
                                        className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                                        title="Share via Email"
                                    >
                                        <Image src="/mail.svg" width={36} height={36} alt="mail" className="h-12 w-12"/>
                                    </button>
                                </div>
                            </div>

                            {/* Stock Indicators */}
                            <div className="flex gap-6 mb-8 text-[14px] font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#4CAF50]"></span>
                                    <span className="text-[#575757] text-sm">Physical Stock: <span
                                        className="text-[#1D1D1D] font-semibold">{selectedStockItem.physicalStock} units</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#FF9800]"></span>
                                    <span className="text-[#575757] text-sm">On Order: <span
                                        className="text-[#1D1D1D] font-semibold">{selectedStockItem.onOrderStock} units</span></span>
                                </div>
                            </div>

                            {/* Branch Table */}
                            <div className="w-full">
                                <div
                                    className="flex border-b border-[#E7E7E7] pb-3 mb-4 text-[#575757] text-[16px] font-medium">
                                    <div className="w-1/2">Branch Location</div>
                                    <div className="w-1/4 text-center">Availability</div>
                                    <div className="w-1/4 text-right">Stock Count</div>
                                </div>

                                <div className="space-y-4">
                                    {selectedStockItem.branches.map((branch, index) => (
                                        <div key={index}
                                             className="flex items-center text-[16px] font-medium text-[#1D1D1D]">
                                            <div className="w-1/2">{branch.location}</div>
                                            <div className="w-1/4 flex justify-center">
                                                <span
                                                    className={`px-4 py-1 rounded-full text-white text-[14px] font-semibold ${
                                                        branch.availability === 'Physical' ? 'bg-[#4CAF50]' : 'bg-[#FF9800]'
                                                    }`}
                                                >
                                                    {branch.availability}
                                                </span>
                                            </div>
                                            <div className="w-1/4 text-right">{branch.count} units</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

                {isSpareAvailabilityModalOpen && (
                    <Modal
                        title="Unavailable Spare Part"
                        onClose={() => {
                            setIsSpareAvailabilityModalOpen(false);
                            // setUnavailableSubmitSuccess(false);
                        }}
                        actionButton={{
                            label: "Submit",
                            onClick: handleSubmitUnavailable(onUnavailableSubmit),
                        }}
                        isPriorityAvailable={false}
                    >
                        <form onSubmit={handleSubmitUnavailable(onUnavailableSubmit)}>
                            <div className="mb-8">
                                <div className="flex flex-col justify-center items-center">
                                    <Image src="/search.gif" alt="search" width={128} height={128}
                                           className="w-32 h-32"/>
                                    <div className="text-center">
                                        <h2 className="font-semibold text-xl text-[#000000]">Oops! That Spare Part is
                                            Not
                                            Available</h2>
                                        <h3 className="text-[#575757] text-[15px] font-medium">Please add it to the
                                            unavailable Spare Parts list.</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/*<VerificationDropdown label="Vehicle Make" placeholder="Select Vehicle Make" isIcon={true}/>*/}
                                <FormField
                                    label="Vehicle Make"
                                    type="select"
                                    isIcon={true}
                                    options={vehicleMakeOptions}
                                    register={registerUnavailable("vehicle_make")}
                                    error={unavailableErrors.vehicle_make}
                                />
                                {/*<VerificationDropdown label="Vehicle Model" placeholder="Select Vehicle Model"*/}
                                {/*                      isIcon={true}/>*/}

                                <FormField
                                    label="Vehicle Model"
                                    type="select"
                                    isIcon={true}
                                    options={vehicleModelOptions}
                                    register={registerUnavailable("vehicle_model")}
                                    error={unavailableErrors.vehicle_model}
                                />
                                {/*<VerificationDropdown label="Part No." placeholder="Select Part No."*/}
                                {/*                      isIcon={true}/>*/}

                                <FormField
                                    label="Part No."
                                    type="select"
                                    isIcon={true}
                                    options={partNo}
                                    register={registerUnavailable("part_no")}
                                    error={unavailableErrors.part_no}
                                />
                                {/*<VerificationDropdown label="Year of Manufacture" placeholder="Manufacture Year"*/}
                                {/*                      isIcon={true}/>*/}

                                <FormField
                                    label="Manufacture Year"
                                    type="select"
                                    isIcon={true}
                                    options={manufactureYearOptions}
                                    register={registerUnavailable("year_of_manufacture")}
                                    error={unavailableErrors.year_of_manufacture}
                                />
                            </div>
                            {/*{unavailableSubmitSuccess && (*/}
                            {/*    <div className="text-green-600 text-sm mt-4">Unavailable spare part created*/}
                            {/*        successfully!</div>*/}
                            {/*)}*/}
                        </form>
                    </Modal>
                )}

            </div>
        </>
    );
}

type VerificationDropdownProps = {
    label: string;
    placeholder: string;
    isIcon: boolean;
};

function VerificationDropdown({label, placeholder, isIcon}: VerificationDropdownProps) {
    return (
        <label className="flex flex-col space-y-2 font-medium text-gray-900">
            <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">{label}</span>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`w-full ${isIcon ? "px-10" : "px-4"} py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                />
                {
                    isIcon && (
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20"
                             viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.1935 13.5122L16.6532 15.9719M15.8762 9.1838C15.8762 10.7723 15.2451 12.2958 14.1219 13.419C12.9986 14.5422 11.4752 15.1733 9.88669 15.1733C8.29818 15.1733 6.77473 14.5422 5.65149 13.419C4.52825 12.2958 3.89722 10.7723 3.89722 9.1838C3.89722 7.5953 4.52825 6.07185 5.65149 4.94861C6.77473 3.82537 8.29818 3.19434 9.88669 3.19434C11.4752 3.19434 12.9986 3.82537 14.1219 4.94861C15.2451 6.07185 15.8762 7.5953 15.8762 9.1838Z"
                                stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )
                }

                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6"
                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                </svg>
            </div>
        </label>
    );
}

export default SpareParts;
