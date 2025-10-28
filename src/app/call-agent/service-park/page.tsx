"use client"
import Image from "next/image";
import React, {useState} from "react";
import FormField from "@/components/FormField";
import z from "zod";
import {useForm} from "react-hook-form";
import {useAssignToSale, useServiceIntake} from "@/hooks/useServicePark";
import {zodResolver} from "@hookform/resolvers/zod";
import {message} from "antd";


// export const serviceParkSchema = z.object({
//     vehicle_no: z.string().min(2, "Vehicle number is required"),
//     odometer: z.string().min(1, "Odometer reading is required"),
//     owner_name: z.string().min(2, "Owner name is required"),
//     contact_no: z.string().regex(/^0\d{9}$/, "Invalid Sri Lankan phone number"),
//     email: z.string().email("Invalid email address").optional(),
//     address: z.string().optional(),
//     mileage: z.string().optional(),
//     oil_type: z.string().optional(),
//     service_center: z.string().optional(),
//     service_advisor: z.string().optional(),
//
//
//     date: z.string().min(1, "Date is required"),
//     customer_name: z.string().min(2, "Customer name is required"),
//     contact_number: z.string().regex(/^0\d{9}$/, "Invalid phone number"),
//     vehicle_make: z.string().min(1, "Select vehicle make"),
//     vehicle_model: z.string().min(1, "Select vehicle model"),
//     manufacture_year: z.string().min(1, "Select manufacture year"),
//     service_category: z.string().min(1, "Select service category"),
//     additional_note: z.string().optional(),
// });

export const vehicleHistorySchema = z.object({
    vehicle_no: z.string().min(2, "Vehicle number is required"),
    odometer: z.string().min(1, "Odometer reading is required"),
    owner_name: z.string().min(2, "Owner name is required"),
    contact_no: z.string().regex(/^0\d{9}$/, "Invalid Sri Lankan phone number"),
    email: z.string().email("Invalid email address").optional(),
    address: z.string().optional(),
    mileage: z.string().optional(),
    oil_type: z.string().optional(),
    service_center: z.string().optional(),
    service_advisor: z.string().optional(),
    // customer_name: z.string().min(2, "Customer name is required"),
    // phone_number: z.string().regex(/^0\d{9}$/, "Invalid phone number"),
});

export const assignToSaleSchema = z.object({
    // vehicle_no: z.string().min(2, "Vehicle number is required"),
    date: z.string().min(1, "Date is required"),
    customer_name: z.string().min(2, "Customer name is required"),
    contact_number: z.string().regex(/^0\d{9}$/, "Invalid phone number"),
    vehicle_make: z.string().min(1, "Select vehicle make"),
    vehicle_model: z.string().min(1, "Select vehicle model"),
    manufacture_year: z.string().min(1, "Select manufacture year"),
    service_category: z.string().min(1, "Select service category"),
    additional_note: z.string().optional(),
});


export type ServiceParkHistoryFormData = z.infer<typeof vehicleHistorySchema>;
export type ServiceParkSaleFormData = z.infer<typeof assignToSaleSchema>;


const ServicePark = () => {

    const lastServicesData = [
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: "Nissan GT-R (R35)"},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: "Nissan GT-R (R35)"},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: "Nissan GT-R (R35)"},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: "Nissan GT-R (R35)"},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: "Nissan GT-R (R35)"},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: "Nissan GT-R (R35)"},
        {date: '12 Dec 2024', invoice: 'INV34556', vehicle: "Nissan GT-R (R35)"},
    ];

    const initialPackageData = [
        {
            name: 'Package 1',
            description: 'Oil change and filter  replacement',
            estimatePrice: 'LKR 20,000',
            action: false,
        },
    ];


    const initialMaintenanceData = [
        {
            serviceName: 'Engine Oil',
            serviceType: 'Repair',
            estimatePrice: 'LKR 40,000',
            action: false,
        },
    ];


    const initialAllServicesData = [
        {
            serviceName: 'Engine Oil',
            serviceType: 'Repair',
            estimatePrice: 'LKR 40,000',
            action: false,
        },
    ];


    const repairsData = [
        {
            repairName: 'Engine Oil',
            estimatePrice: 'LKR 40,000',
        },
    ];


    const paintsData = [
        {
            paintName: 'Engine Oil',
            estimatePrice: 'LKR 40,000',
        },
    ];


    const addOnData = [
        {
            addOnName: 'Engine Oil',
            estimatePrice: 'LKR 40,000',
        },
    ];

    const loyaltyData = [
        {
            category: 'Indra Traders (ITPL)',
            points: '500',
            promoCode: 'NEWBUY500'
        },
    ];

    const vehicleMakeOptions = [
        {value: "Nissan", label: "Nissan"},
        {value: "Toyota", label: "Toyota"},
        {value: "Honda", label: "Honda"},
    ];
    const vehicleModelOptions = [
        {value: "GT-R", label: "GT-R"},
        {value: "Civic", label: "Civic"},
    ];
    const manufactureYearOptions = Array.from({length: 15}, (_, i) => {
        const year = (2025 - i).toString();
        return {value: year, label: year};
    });
    const serviceCategoryOptions = [
        {value: "Repair", label: "Repair"},
        {value: "Maintenance", label: "Maintenance"},
        {value: "Inspection", label: "Inspection"},
    ];

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [vehicleCustomerData, setVehicleCustomerData] = useState<{
        customer_id: string;
        vehicle_id: string;
        customer_no: string;
    } | null>(null);


    const [packageData, setPackageData] = useState(initialPackageData);
    const [maintenanceData, setMaintenanceData] = useState(initialMaintenanceData);
    const [allServicesData, setAllServicesData] = useState(initialAllServicesData);

    const [value, setValue] = useState("Services");

    const [copiedIndex, setCopiedIndex] = useState<null | number>(null);


    // const {
    //     register,
    //     handleSubmit,
    //     reset,
    //     formState: {errors},
    // } = useForm<ServiceParkFormData>({
    //     resolver: zodResolver(serviceParkSchema),
    // });

    const {
        register: registerVehicle,
        handleSubmit: handleVehicleSubmit,
        reset: resetVehicle,
        formState: {errors: vehicleErrors},
    } = useForm<z.infer<typeof vehicleHistorySchema>>({
        resolver: zodResolver(vehicleHistorySchema),
        defaultValues: {
            vehicle_no: "",
            odometer: "",
            owner_name: "",
            contact_no: "",
            email: "",
            address: "",
            mileage: "",
            oil_type: "",
            service_center: "",
            service_advisor: "",
        },
    });

    console.log("-------- err:", vehicleErrors);


    const {
        register: registerSale,
        handleSubmit: handleSaleSubmit,
        reset: resetSale,
        formState: {errors: saleErrors},
    } = useForm<z.infer<typeof assignToSaleSchema>>({
        resolver: zodResolver(assignToSaleSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            customer_name: "",
            contact_number: "",
            vehicle_make: "",
            vehicle_model: "",
            manufacture_year: "",
            service_category: "",
            additional_note: "",
        },
    });


    const serviceIntake = useServiceIntake();
    const assignToSale = useAssignToSale();

    const handleVehicleHistory = async (data: ServiceParkHistoryFormData) => {
        try {
            const response = await serviceIntake.mutateAsync({
                vehicle_no: data.vehicle_no,
                odometer: data.odometer,
                owner_name: data.owner_name,
                contact_no: data.contact_no,
                email: data.email,
                address: data.address,
                mileage: data.mileage,
                oil_type: data.oil_type,
                service_center: data.service_center,
                service_advisor: data.service_advisor,
                created_by: 1,
                customer_name: data.owner_name,
                phone_number: data.contact_no,
            });

            setVehicleCustomerData({
                customer_id: response.customer.id,
                vehicle_id: response.vehicle.id,
                customer_no: response.contact_no,
            });

            resetVehicle();
            message.success("Vehicle and customer details saved successfully!");
        } catch (error) {
            console.error(error);
            message.error("Failed to save vehicle history.");
        }
    };

    const handleAssignToSales = async (data: ServiceParkSaleFormData) => {
        try {
            if (!vehicleCustomerData) {
                message.warning("Please apply vehicle history first.");
                return;
            }

            await assignToSale.mutateAsync({
                customer_id: vehicleCustomerData.customer_id,
                vehicle_id: vehicleCustomerData.vehicle_id,
                vehicle_make: data.vehicle_make,
                vehicle_model: data.vehicle_model,
                year_of_manufacture: data.manufacture_year,
                service_category: data.service_category,
                additional_note: data.additional_note,
                lead_source: "Call Agent",
                priority: 1,
            });

            setSubmitSuccess(true);
            resetSale();
            message.success("Sale created successfully!");
        } catch (error) {
            console.error(error);
            setSubmitSuccess(false);
            message.error("Failed to create sale.");
        }
    };

    console.log("-----------sale err: ", saleErrors);


    const handleSelectPackage = (index: number) => {
        setPackageData(prevData => {
            const newData = [...prevData];
            newData[index] = {...newData[index], action: !newData[index].action};
            return newData;
        });
    };

    const handleSelectMaintenance = (index: number) => {
        setMaintenanceData(prevData => {
            const newData = [...prevData];
            newData[index] = {...newData[index], action: !newData[index].action};
            return newData;
        });
    };

    const handleSelectAllServices = (index: number) => {
        setAllServicesData(prevData => {
            const newData = [...prevData];
            newData[index] = {...newData[index], action: !newData[index].action};
            return newData;
        });
    };

    const handleClick = (buttonValue: string) => {
        setValue(buttonValue);
    };


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


    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            <div className="max-w-[1800px] mx-auto container">

                <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                    <h1 className="text-2xl font-extrabold mb-4">Indra Service Park Dashboard</h1>

                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="font-semibold text-[22px] mb-6">Vehicle History</h2>
                                <div>
                                    <button
                                        id="applyBtn"
                                        onClick={handleVehicleSubmit(handleVehicleHistory)}
                                        disabled={assignToSale.isPending}
                                        className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition">
                                        {assignToSale.isPending ? "Applying..." : "Apply"}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/*<VerificationDropdown label="Vehicle No" placeholder="Select Vehicle No" isIcon={true}/>*/}
                                <FormField
                                    label="Vehicle No"
                                    placeholder="ABC-1234"
                                    register={registerVehicle("vehicle_no")}
                                    error={vehicleErrors.vehicle_no}
                                />
                                <FormField
                                    label="Odometer"
                                    placeholder="245,000 km"
                                    register={registerVehicle("odometer")}
                                    error={vehicleErrors.odometer}
                                />
                                {/*<div>*/}
                                {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                {/*    <span*/}
                                {/*        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Odometer</span>*/}
                                {/*        <div className="relative">*/}
                                {/*            <input*/}
                                {/*                type="text"*/}
                                {/*                placeholder="245,000km"*/}
                                {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*    </label>*/}
                                {/*</div>*/}
                            </div>

                            <div className="flex-1 space-y-6 mt-10">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[19px] mb-6">Last Owner Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/*<div>*/}
                                    {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                    {/*<span*/}
                                    {/*    className="text-[#1D1D1D] font-medium text-[17px] montserrat">Owner Name</span>*/}
                                    {/*        <div className="relative">*/}
                                    {/*            <input*/}
                                    {/*                type="text"*/}
                                    {/*                placeholder="Jenny Wilson"*/}
                                    {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}
                                    <FormField
                                        label="Owner Name"
                                        placeholder="Jenny Wilson"
                                        register={registerVehicle("owner_name")}
                                        error={vehicleErrors.owner_name}
                                    />
                                    {/*<VerificationDropdown label="Contact No" placeholder="077 5848725"*/}
                                    {/*                      isIcon={false}/>*/}
                                    <FormField
                                        label="Contact No"
                                        placeholder="0771234567"
                                        register={registerVehicle("contact_no")}
                                        error={vehicleErrors.contact_no}
                                    />
                                    {/*<div>*/}
                                    {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                    {/*    <span*/}
                                    {/*        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Email Address</span>*/}
                                    {/*        <div className="relative">*/}
                                    {/*            <input*/}
                                    {/*                type="text"*/}
                                    {/*                placeholder="Jenny@info.com"*/}
                                    {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}
                                    <FormField
                                        label="Email Address"
                                        placeholder="jenny@email.com"
                                        register={registerVehicle("email")}
                                        error={vehicleErrors.email}
                                    />
                                    <FormField
                                        label="Address"
                                        placeholder="No.45, Malabe Rd"
                                        register={registerVehicle("address")}
                                        error={vehicleErrors.address}
                                    />

                                    {/*<div>*/}
                                    {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                    {/*<span*/}
                                    {/*    className="text-[#1D1D1D] font-medium text-[17px] montserrat">Address</span>*/}
                                    {/*        <div className="relative">*/}
                                    {/*            <input*/}
                                    {/*                type="text"*/}
                                    {/*                placeholder="No.45, Malabe Rd, Malabe"*/}
                                    {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 mt-10">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[19px] mb-6">Last Service Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/*<div>*/}
                                    {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                    {/*<span*/}
                                    {/*    className="text-[#1D1D1D] font-medium text-[17px] montserrat">Mileage</span>*/}
                                    {/*        <div className="relative">*/}
                                    {/*            <input*/}
                                    {/*                type="text"*/}
                                    {/*                placeholder="200,000km"*/}
                                    {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}

                                    <FormField
                                        label="Mileage"
                                        placeholder="200,000 km"
                                        register={registerVehicle("mileage")}
                                        error={vehicleErrors.mileage}
                                    />
                                    <FormField
                                        label="Oil Type"
                                        placeholder="5W-30 Synthetic"
                                        register={registerVehicle("oil_type")}
                                        error={vehicleErrors.oil_type}
                                    />
                                    <FormField
                                        label="Service Center"
                                        placeholder="Service Center"
                                        register={registerVehicle("service_center")}
                                        error={vehicleErrors.service_center}
                                    />
                                    <FormField
                                        label="Service Advisor"
                                        placeholder="Service Advisor"
                                        register={registerVehicle("service_advisor")}
                                        error={vehicleErrors.service_advisor}
                                    />

                                    {/*<div>*/}
                                    {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                    {/*<span*/}
                                    {/*    className="text-[#1D1D1D] font-medium text-[17px] montserrat">Oil Type</span>*/}
                                    {/*        <div className="relative">*/}
                                    {/*            <input*/}
                                    {/*                type="text"*/}
                                    {/*                placeholder="5W-30 Synthetic"*/}
                                    {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}

                                    {/*<div>*/}
                                    {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                    {/*<span*/}
                                    {/*    className="text-[#1D1D1D] font-medium text-[17px] montserrat">Service Center</span>*/}
                                    {/*        <div className="relative">*/}
                                    {/*            <input*/}
                                    {/*                type="text"*/}
                                    {/*                placeholder="Bambalapitiya"*/}
                                    {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}

                                    {/*<div>*/}
                                    {/*    <label className="flex flex-col space-y-2 font-medium text-gray-900">*/}
                                    {/*<span*/}
                                    {/*    className="text-[#1D1D1D] font-medium text-[17px] montserrat">Service Advisor</span>*/}
                                    {/*        <div className="relative">*/}
                                    {/*            <input*/}
                                    {/*                type="text"*/}
                                    {/*                placeholder="John Doe"*/}
                                    {/*                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}*/}
                                    {/*            />*/}
                                    {/*        </div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*{showStockAvailability && (*/}
                    {/*    <section*/}
                    {/*        id="stock-availability-section"*/}
                    {/*        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">*/}
                    {/*        <div*/}
                    {/*            className="w-full">*/}
                    {/*            <div className="flex flex-row items-center justify-between">*/}
                    {/*                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Stock*/}
                    {/*                    Availability</h2>*/}
                    {/*                <div>*/}
                    {/*                    <button*/}
                    {/*                        className="ml-auto text-white text-base font-medium rounded-full">*/}
                    {/*                        <Image src="/dashboard/availability.svg" alt="availability" height={36}*/}
                    {/*                               width={36} className="h-12 w-12"/>*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            /!* Table Headers *!/*/}
                    {/*            <div className="overflow-x-auto">*/}
                    {/*                <table className="w-full text-black">*/}
                    {/*                    <thead>*/}
                    {/*                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">*/}
                    {/*                        <th className="py-5 px-4 text-left">Physical</th>*/}
                    {/*                        <th className="py-5 px-4 text-left">On Order</th>*/}
                    {/*                        <th className="py-5 px-4 text-left">FT - Progress Level</th>*/}
                    {/*                        <th className="py-5 px-4 text-left">Production Line</th>*/}
                    {/*                    </tr>*/}
                    {/*                    </thead>*/}
                    {/*                    <tbody>*/}
                    {/*                    {stockData.map((item, index) => (*/}
                    {/*                        <tr key={index} className="text-lg font-medium text-[#4353FF] underline">*/}
                    {/*                            <td className="py-4 px-4"><a>{item.physical}</a></td>*/}
                    {/*                            <td className="py-4 px-4">{item.onOrder}</td>*/}
                    {/*                            <td className="py-4 px-4">{item.ftProgressLevel}</td>*/}
                    {/*                            <td className="py-4 px-4">{item.productionLine}</td>*/}
                    {/*                        </tr>*/}
                    {/*                    ))}*/}
                    {/*                    </tbody>*/}
                    {/*                </table>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </section>*/}
                    {/*)}*/}


                    <section
                        id="package-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Recommended
                                    Package Details</h2>
                                <div>
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/search.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Package Name</th>
                                        <th className="py-5 px-4 text-left">Description</th>
                                        <th className="py-5 px-4 text-left">Estimate Price</th>
                                        <th className="py-5 px-4 text-left min-w-40">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {packageData.map((item, index) => (
                                        <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                            <td className="py-4 px-4"><a>{item.name}</a></td>
                                            <td className="py-4 px-4 items-center flex"><span
                                                className="mr-2">{item.description}</span>
                                                <button
                                                    className="font-medium rounded-full">
                                                    <Image src="/info.svg" alt="info" height={36}
                                                           width={36} className="h-5 w-5"/>
                                                </button>
                                            </td>
                                            <td className="py-4 px-4">{item.estimatePrice}</td>
                                            <td className="py-4 px-4">
                                                <button onClick={() => handleSelectPackage(index)}
                                                        className={`px-6 py-2 rounded-[20] cursor-pointer ${!item.action ? "bg-[#DFDFDF] text-[#1D1D1D]" : "bg-[#DB2727] text-[#FFFFFF]"}`}>{!item.action ? "Select" : "Selected"}</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>


                    <section
                        id="maintaince-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Recommended
                                    Maintenance Details</h2>
                                <div>
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/search.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Maintenance Services</th>
                                        <th className="py-5 px-4 text-left">Service Type</th>
                                        <th className="py-5 px-4 text-left">Estimate Price</th>
                                        <th className="py-5 px-4 text-left min-w-40">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {maintenanceData.map((item, index) => (
                                        <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                            <td className="py-4 px-4"><a>{item.serviceName}</a></td>
                                            <td className="py-4 px-4 items-center flex">{item.serviceType}</td>
                                            <td className="py-4 px-4">{item.estimatePrice}</td>
                                            <td className="py-4 px-4">
                                                <button onClick={() => handleSelectMaintenance(index)}
                                                        className={`px-6 py-2 rounded-[20] cursor-pointer ${!item.action ? "bg-[#DFDFDF] text-[#1D1D1D]" : "bg-[#DB2727] text-[#FFFFFF]"}`}>{!item.action ? "Select" : "Selected"}</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>


                    <section
                        id="all-service-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">All
                                    Services</h2>
                                <div className="flex flex-row gap-6">
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/search.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>

                                    <div id="toggle-buttons" className="flex justify-center bg-[#FFFFFF] rounded-full">
                                        <button
                                            type="button"
                                            onClick={() => handleClick("Services")}
                                            className={`py-1 px-4 cursor-pointer rounded-full text-base transition-colors ${
                                                value === "Services"
                                                    ? "bg-[#DB2727] text-white font-medium"
                                                    : "bg-[#FFFFFF] text-[#1D1D1D] font-medium"
                                            }`}
                                        >
                                            Services
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleClick("Packages")}
                                            className={`py-1 px-4 cursor-pointer rounded-full text-base transition-colors ${
                                                value === "Packages"
                                                    ? "bg-[#DB2727] text-white font-medium"
                                                    : "bg-[#FFFFFF] text-[#1D1D1D] font-medium"
                                            }`}
                                        >
                                            Packages
                                        </button>
                                    </div>

                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Maintenance Services</th>
                                        <th className="py-5 px-4 text-left">Service Type</th>
                                        <th className="py-5 px-4 text-left">Estimate Price</th>
                                        <th className="py-5 px-4 text-left min-w-40">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allServicesData.map((item, index) => (
                                        <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                            <td className="py-4 px-4 text-[#1D1D1D]"><a>{item.serviceName}</a></td>
                                            <td className="py-4 px-4 items-center flex text-[#1D1D1D]">{item.serviceType}</td>
                                            <td className="py-4 px-4 text-[#1D1D1D]">{item.estimatePrice}</td>
                                            <td className="py-4 px-4">
                                                <button onClick={() => handleSelectAllServices(index)}
                                                        className={`px-6 py-2 rounded-[20] cursor-pointer ${!item.action ? "bg-[#DFDFDF] text-[#1D1D1D]" : "bg-[#DB2727] text-[#FFFFFF]"}`}>{!item.action ? "Select" : "Selected"}</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>


                    <section
                        id="repairs-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Repairs</h2>
                                <div className="flex flex-row gap-6">
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/repair.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/add.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Repairs</th>
                                        <th className="py-5 px-4 text-right justify-items-end">Estimate Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {repairsData.map((item, index) => (
                                        <tr key={index} className="text-lg font-medium justify-between text-[#1D1D1D]">
                                            <td className="py-4 px-4 text-[#1D1D1D]">{item.repairName}</td>
                                            <td className="py-4 px-4 text-right text-[#1D1D1D]">{item.estimatePrice}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-y-1 border-[#575757]">
                                        <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total Estimate
                                            Price
                                        </td>
                                        <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">LKR
                                            112,000
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>


                    <section
                        id="paints-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Paint</h2>
                                <div className="flex flex-row gap-6">
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/add.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Paint Service</th>
                                        <th className="py-5 px-4 text-right justify-items-end">Estimate Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paintsData.map((item, index) => (
                                        <tr key={index} className="text-lg font-medium justify-between text-[#1D1D1D]">
                                            <td className="py-4 px-4 text-[#1D1D1D]">{item.paintName}</td>
                                            <td className="py-4 px-4 text-right text-[#1D1D1D]">{item.estimatePrice}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-y-1 border-[#575757]">
                                        <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total Estimate
                                            Price
                                        </td>
                                        <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">LKR
                                            112,000
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>


                    <section
                        id="add-ons-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Add-On
                                    Packages</h2>
                                <div className="flex flex-row gap-6">
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/add.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Add-On Packages</th>
                                        <th className="py-5 px-4 text-right justify-items-end">Estimate Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {addOnData.map((item, index) => (
                                        <tr key={index} className="text-lg font-medium justify-between text-[#1D1D1D]">
                                            <td className="py-4 px-4 text-[#1D1D1D]">{item.addOnName}</td>
                                            <td className="py-4 px-4 text-right text-[#1D1D1D]">{item.estimatePrice}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-y-1 border-[#575757]">
                                        <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total Estimate
                                            Price
                                        </td>
                                        <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">LKR
                                            112,000
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section
                        id="loyalty-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Loyalty Points
                                    & Promotions</h2>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Category</th>
                                        <th className="py-5 px-4 text-left">Points (Loyalty programme)</th>
                                        <th className="py-5 px-4 text-left">Promo Codes</th>
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


                    <section
                        id="summary-section"
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Summary</h2>
                                <div className="flex flex-row gap-6">
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/message.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/whatsapp.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                    <button
                                        className="ml-auto text-white text-base font-medium rounded-full">
                                        <Image src="/mail.svg" alt="search" height={36}
                                               width={36} className="h-12 w-12"/>
                                    </button>
                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Services</th>
                                        <th className="py-5 px-4 text-right justify-items-end">Estimate Total Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/*{addOnData.map((item, index) => (*/}
                                    {/*    <tr key={index} className="text-lg font-medium justify-between text-[#1D1D1D]">*/}
                                    {/*        <td className="py-4 px-4 text-[#1D1D1D]">{item.addOnName}</td>*/}
                                    {/*        <td className="py-4 px-4 text-right text-[#1D1D1D]">{item.estimatePrice}</td>*/}
                                    {/*    </tr>*/}
                                    {/*))}*/}
                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                        <td className="py-4 px-4 text-[#1D1D1D] font-semibold">Vehicle Repair</td>
                                        <td className="py-4 px-4 text-right text-[#1D1D1D] font-semibold">LKR 112,000
                                        </td>
                                    </tr>
                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                        <td className="py-2 px-3 pb-2 text-[#1D1D1D] font-medium"><input type="text"
                                                                                                         placeholder="Enter Promo Code"
                                                                                                         className="border-none focus:border-none focus:outline-none"/>
                                        </td>
                                        <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold ">
                                            <button
                                                className="font-bold text-[#FFFFFF] bg-[#1D1D1D] rounded-[20] px-16 py-2">Apply
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>‎</td>
                                        <td>‎</td>
                                    </tr>
                                    <tr className="border-y-1 border-[#575757]">
                                        <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D] mt-8">Estimate Price
                                        </td>
                                        <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D] mt-8">LKR
                                            112,000
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-4 px-4 font-semibold text-[19px] text-[#1D1D1D] mt-8">
                                            Total Discount
                                        </td>
                                        <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D] mt-8">
                                        </td>
                                    </tr>
                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                        <td className="py-4 px-4 text-[#1D1D1D]">Sub Total</td>
                                        <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR 112,000</td>
                                    </tr>
                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                        <td className="py-4 px-4 text-[#1D1D1D]">Applied Promo Code</td>
                                        <td className="py-4 px-4 text-right text-[#1D1D1D]">NEWSERVICE500</td>
                                    </tr>
                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                        <td className="py-4 px-4 text-[#1D1D1D]">Discount Amount</td>
                                        <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR 30,000</td>
                                    </tr>
                                    <tr className="border-t-1 border-[#575757]">
                                        <td className="py-4 px-4 font-bold text-xl text-[#DB2727] mt-8">Final Estimate
                                            Price
                                        </td>
                                        <td className="py-4 px-4 font-bold text-xl text-right text-[#DB2727] mt-8">LKR
                                            112,000
                                        </td>
                                    </tr>
                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                        <td className="py-2 px-3 pb-2 text-[#1D1D1D] font-medium"></td>
                                        <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold ">
                                            <button
                                                className="font-bold text-[#FFFFFF] bg-[#DB2727] rounded-[20] px-14 py-2">Book
                                                Now
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>


                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <form className="flex flex-col">
                            <div className="flex-1 space-y-6">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[22px] text-[#000000] mb-6">Assign to Sales</h2>
                                    <div>
                                        <button
                                            onClick={handleSaleSubmit(handleAssignToSales)}
                                            disabled={assignToSale.isPending}
                                            className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition disabled:bg-gray-400">
                                            {assignToSale.isPending ? "Submitting..." : "Send"}
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
                                                    value={`IPS${Date.now()}`}
                                                    disabled
                                                    // placeholder="ITPL122455874565"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 disabled:bg-gray-200`}
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
                                                    {...registerSale("date")}
                                                    placeholder="12 Mar, 2025"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                                {saleErrors.date &&
                                                    <span
                                                        className="text-red-600 text-sm">{saleErrors.date.message}</span>}
                                            </div>
                                        </label>
                                    </div>

                                    <FormField
                                        label="Customer Name"
                                        placeholder="Emily Charlotte"
                                        type="text"
                                        register={registerSale("customer_name")}
                                        error={saleErrors.customer_name}
                                    />

                                    <FormField
                                        label="Contact Number"
                                        placeholder="077 5647256"
                                        type="text"
                                        register={registerSale("contact_number")}
                                        error={saleErrors.contact_number}
                                    />
                                </div>
                            </div>


                            <div className="flex-1 space-y-6 mt-10">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[19px] mb-6">Vehicle Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <FormField
                                        label="Vehicle Make"
                                        type="select"
                                        isIcon={true}
                                        options={vehicleMakeOptions}
                                        register={registerSale("vehicle_make")}
                                        error={saleErrors.vehicle_make}
                                    />
                                    <FormField
                                        label="Vehicle Model"
                                        type="select"
                                        isIcon={true}
                                        options={vehicleModelOptions}
                                        register={registerSale("vehicle_model")}
                                        error={saleErrors.vehicle_model}
                                    />
                                    <FormField
                                        label="Service Category"
                                        type="select"
                                        isIcon={true}
                                        options={serviceCategoryOptions}
                                        register={registerSale("service_category")}
                                        error={saleErrors.service_category}
                                    />
                                    <FormField
                                        label="Manufacture Year"
                                        type="select"
                                        isIcon={true}
                                        options={manufactureYearOptions}
                                        register={registerSale("manufacture_year")}
                                        error={saleErrors.manufacture_year}
                                    />
                                </div>
                                <FormField
                                    label="Additional Note"
                                    type="textarea"
                                    placeholder="Enter Your Note"
                                    register={registerSale("additional_note")}
                                    error={saleErrors.additional_note}
                                />
                            </div>
                            {submitSuccess && (
                                <div className="text-green-600 text-sm mt-4">Vehicle sale created successfully!</div>
                            )}
                        </form>
                    </section>


                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center mb-8">
                        <div
                            className="w-full">
                            <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Last Services</h2>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                        <th className="py-5 px-4 text-left">Date</th>
                                        <th className="py-5 px-4 text-left">Invoice No</th>
                                        <th className="py-5 px-4 text-left">Vehicle</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {lastServicesData.map((service, index) => (
                                        <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                            <td className="py-4 px-4 text-[#1D1D1D]">{service.date}</td>
                                            <td className="py-4 px-4 text-[#1D1D1D]">{service.invoice}</td>
                                            <td className="py-4 px-4 text-[#1D1D1D]">{service.vehicle}</td>
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
                                        <button
                                            className="w-8 h-8 text-[13px] rounded-lg bg-[#DB2727] text-white font-semibold">1
                                        </button>
                                        <button
                                            className="w-8 h-8 text-[13px] rounded-lg bg-white/30 text-[#333333] font-semibold">2
                                        </button>
                                        <button
                                            className="w-8 h-8 text-[13px] rounded-lg bg-white/30 text-[#333333] font-semibold">3
                                        </button>
                                        <button
                                            className="w-8 h-8 text-[13px] rounded-lg bg-white/30 text-[#333333] font-semibold">4
                                        </button>
                                        <button
                                            className="w-8 h-8 text-[13px] rounded-lg bg-white/30 text-[#333333] font-semibold">5
                                        </button>
                                    </div>
                                    <button
                                        className="flex text-sm justify-center items-center h-8 px-4 rounded-md bg-white/30 text-[#333333] font-medium font-poppins">Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
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
                {/*<FiSearch*/}
                {/*    size={18}*/}
                {/*    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"*/}
                {/*/>*/}
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

                {/*<BiChevronDown*/}
                {/*    size={18}*/}
                {/*    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"*/}
                {/*/>*/}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6"
                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                </svg>
            </div>
        </label>
    );
}

export default ServicePark;
