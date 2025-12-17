/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Image from "next/image";
import React, {useRef, useState} from "react";
import FormField from "@/components/FormField";
import z from "zod";
import {useForm} from "react-hook-form";
import {
    useAssignToSale, useAvailablePromos,
    useBranchCatalog,
    useBranchDetails,
    useServiceIntake,
    useValidatePromo
} from "@/hooks/useServicePark";
import {zodResolver} from "@hookform/resolvers/zod";
import Modal from "@/components/Modal";
import {useCreateUnavailableService} from "@/hooks/useUnavailable";
import Toast from "@/components/Toast";
import {useToast} from "@/hooks/useToast";
import {useCurrentUser} from "@/utils/auth";
import {useServiceCart, CartItem} from "@/hooks/useServiceCart";


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

export const unavailableServiceSchema = z.object({
    unavailable_repair: z.string().optional(),
    unavailable_paint: z.string().optional(),
    unavailable_add_on: z.string().optional(),
    note: z.string().min(1, "Note is required"),
});


export type ServiceParkHistoryFormData = z.infer<typeof vehicleHistorySchema>;
export type ServiceParkSaleFormData = z.infer<typeof assignToSaleSchema>;
export type UnavailableServiceFormData = z.infer<typeof unavailableServiceSchema>;


const ServicePark = () => {

    const lastServicesData = [
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

    // const [submitSuccess, setSubmitSuccess] = useState(false);
    const [vehicleCustomerData, setVehicleCustomerData] = useState<{
        customer_id: string;
        vehicle_id: string;
        customer_no: string;
    } | null>(null);


    const user = useCurrentUser();
    const userId = Number(user?.id) || 1;

    const allServicesSectionRef = useRef<HTMLElement>(null);


    const [packageData, setPackageData] = useState(initialPackageData);
    const [maintenanceData, setMaintenanceData] = useState(initialMaintenanceData);
    const [allServicesData, setAllServicesData] = useState(initialAllServicesData);

    const [value, setValue] = useState("Services");

    const [copiedIndex, setCopiedIndex] = useState<null | number>(null);

    const [isServiceAvailabilityModalOpen, setIsServiceAvailabilityModalOpen] = useState(false);


    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(15);
    // const [promoInput, setPromoInput] = useState("");
    const [promoInputs, setPromoInputs] = useState({
        packages: "",
        repairs: "",
        paints: "",
        maintenance: "",
        addOns: ""
    });

    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

    const {data: catalog, isLoading: loadingCatalog} = useBranchCatalog(selectedBranchId);
    const validatePromoMutation = useValidatePromo();
    const {data: promoList, isLoading: loadingPromos} = useAvailablePromos();


    const handleAddServiceClick = () => {
        setAllServicesView("Services");

        if (allServicesSectionRef.current) {
            allServicesSectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };


    const {
        addItem, removeItem, isSelected,
        groupedItems, totals, getPromoForType, removePromo, addPromo
    } = useServiceCart();


    const getCategoryTotal = (items: CartItem[]) => {
        return items.reduce((sum, item) => sum + item.price, 0);
    };

    const packagesTotal = getCategoryTotal(groupedItems.packages);
    const maintenanceTotal = getCategoryTotal(groupedItems.maintenance);
    const repairsTotal = getCategoryTotal(groupedItems.repairs);
    const paintsTotal = getCategoryTotal(groupedItems.paints);
    const addOnsTotal = getCategoryTotal(groupedItems.addOns);


    const [allServicesView, setAllServicesView] = useState<"Services" | "Packages">("Services");


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

    const {
        register: registerUnavailable,
        handleSubmit: handleSubmitUnavailable,
        formState: {errors: unavailableErrors},
        reset: resetUnavailable,
    } = useForm<z.infer<typeof unavailableServiceSchema>>({
        resolver: zodResolver(unavailableServiceSchema),
        defaultValues: {
            unavailable_repair: "",
            unavailable_paint: "",
            unavailable_add_on: "",
            note: "",
        },
    });


    const serviceIntake = useServiceIntake();
    const assignToSale = useAssignToSale();

    const {toast, showToast, hideToast} = useToast();

    const {mutate: createUnavailableServiceMutation, isPending: isUnavailablePending} = useCreateUnavailableService();

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
                created_by: userId,
                customer_name: data.owner_name,
                phone_number: data.contact_no,
            });

            setVehicleCustomerData({
                customer_id: response.customer.id,
                vehicle_id: response.vehicle.id,
                customer_no: response.contact_no,
            });

            resetVehicle();
            showToast("Vehicle and customer details saved successfully!", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to save vehicle history.", "error");
        }
    };

    const handleAssignToSales = async (data: ServiceParkSaleFormData) => {
        try {
            if (!vehicleCustomerData) {
                showToast("Please apply vehicle history first.", "error");
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
                call_agent_id: userId,
            });

            showToast("Service sale created successfully", "success");
            resetSale();
        } catch (error) {
            console.error(error);
            showToast("Failed to create sale.", "error");
        }
    };


    const handleUnavailableSubmit = async (data: UnavailableServiceFormData) => {
        try {
            const submissionData = {
                call_agent_id: userId,
                ...data,
            };

            createUnavailableServiceMutation(submissionData, {
                onSuccess: () => {
                    showToast("Unavailable service added successfully", "success");
                    resetUnavailable();
                },
                onError: (error) => {
                    console.error("Error creating unavailable vehicle sale:", error);
                },
            });
        } catch (error) {
            console.error(error);
            showToast("Failed to create unavailable service.", "error");
        }
    };

    console.log("-----------sale err: ", saleErrors);


    const handleToggleItem = (item: any, type: CartItem['type']) => {
        // Normalize ID for packages vs services
        const id = item.id;
        const isActive = isSelected(id, type);

        if (isActive) {
            removeItem(id, type);
        } else {
            // Normalize price
            const price = type === 'Package' ? parseFloat(item.total_price) : parseFloat(item.price);
            addItem({
                id,
                name: item.name,
                type,
                price,
                originalData: item
            });
        }
    };

    const handleInputChange = (category: string, value: string) => {
        setPromoInputs(prev => ({...prev, [category]: value}));
    };

    const handleApplyCategoryPromo = (categoryKey: string, backendTypeString: string) => {
        const code = promoInputs[categoryKey as keyof typeof promoInputs];

        if (!code) {
            showToast("Please enter a code", "error");
            return;
        }

        // Set the loading state for THIS category
        setLoadingCategory(categoryKey);

        validatePromoMutation.mutate(code, {
            onSuccess: (data) => {
                if (data.isValid) {
                    const appliesToSection = data.applicableTypes.includes(backendTypeString) || data.applicableTypes.includes("ALL");

                    if (!appliesToSection) {
                        showToast(`This code is not valid for ${categoryKey}`, "error");
                        setLoadingCategory(null); // Reset loading
                        return;
                    }

                    addPromo({
                        code: data.code,
                        discountType: data.discountType,
                        amount: data.amount,
                        applicableTypes: data.applicableTypes
                    });
                    showToast(`${categoryKey} promo applied!`, "success");
                    handleInputChange(categoryKey, "");
                }
            },
            onError: (error: any) => {
                const msg = error.response?.data?.message || "Invalid Promo Code";
                showToast(msg, "error");
            },
            onSettled: () => {
                // Always turn off loading, success or fail
                setLoadingCategory(null);
            }
        });
    };


    const repairPromo = getPromoForType('Repair');
    const paintPromo = getPromoForType('Paint');
    const addOnPromo = getPromoForType('AddOn');
    const maintenancePromo = getPromoForType('Maintenance');
    const packagePromo = getPromoForType('Package');


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
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />
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
                                </div>

                                <div className="flex-1 space-y-6 mt-10">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="font-semibold text-[19px] mb-6">Last Owner Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <FormField
                                            label="Owner Name"
                                            placeholder="Jenny Wilson"
                                            register={registerVehicle("owner_name")}
                                            error={vehicleErrors.owner_name}
                                        />
                                        <FormField
                                            label="Contact No"
                                            placeholder="0771234567"
                                            register={registerVehicle("contact_no")}
                                            error={vehicleErrors.contact_no}
                                        />
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
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6 mt-10">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="font-semibold text-[19px] mb-6">Last Service Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                    </div>
                                </div>
                            </div>
                        </section>
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
                            ref={allServicesSectionRef}
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

                                        <div id="toggle-buttons"
                                             className="flex justify-center bg-[#FFFFFF] rounded-full">
                                            <button
                                                type="button"
                                                // onClick={() => handleClick("Services")}
                                                onClick={() => setAllServicesView("Services")}
                                                className={`py-1 px-4 cursor-pointer rounded-full text-base transition-colors ${
                                                    allServicesView === "Services"
                                                        ? "bg-[#DB2727] text-white font-medium"
                                                        : "bg-[#FFFFFF] text-[#1D1D1D] font-medium"
                                                }`}
                                            >
                                                Services
                                            </button>
                                            <button
                                                type="button"
                                                // onClick={() => handleClick("Packages")}
                                                onClick={() => setAllServicesView("Packages")}
                                                className={`py-1 px-4 cursor-pointer rounded-full text-base transition-colors ${
                                                    allServicesView === "Packages"
                                                        ? "bg-[#DB2727] text-white font-medium"
                                                        : "bg-[#FFFFFF] text-[#1D1D1D] font-medium"
                                                }`}
                                            >
                                                Packages
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-black">
                                        <thead>
                                        <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                            <th className="py-5 px-4 text-left">Maintenance Services</th>
                                            <th className="py-5 px-4 text-left">{allServicesView === "Services" ? "Service Type" : "Description"}</th>
                                            <th className="py-5 px-4 text-left">Estimate Price</th>
                                            <th className="py-5 px-4 text-left min-w-40">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {allServicesView === "Services" ? (
                                            catalog?.services.map((item: any, index: number) => {
                                                const typeMap: any = {
                                                    'REPAIR': 'Repair',
                                                    'PAINT': 'Paint',
                                                    'Maintenance': 'Maintenance',
                                                    'ADDON': 'AddOn'
                                                };
                                                const cartType = typeMap[item.type] || 'Repair';
                                                const isActive = isSelected(item.id, cartType);

                                                return (
                                                    <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                                        <td className="py-4 px-4 text-[#1D1D1D]"><a>{item.name}</a></td>
                                                        <td className="py-4 px-4 items-center flex text-[#1D1D1D]">{item.type}</td>
                                                        <td className="py-4 px-4 text-[#1D1D1D]">LKR {item.price.toLocaleString()}</td>
                                                        <td className="py-4 px-4">
                                                            <button
                                                                // onClick={() => handleSelectAllServices(index)}
                                                                onClick={() => handleToggleItem(item, cartType)}
                                                                // className={`px-6 py-2 rounded-[20] cursor-pointer ${!item.action ? "bg-[#DFDFDF] text-[#1D1D1D]" : "bg-[#DB2727] text-[#FFFFFF]"}`}
                                                                className={`px-6 py-2 rounded-[20] cursor-pointer ${!isActive ? "bg-[#DFDFDF] text-[#1D1D1D]" : "bg-[#DB2727] text-[#FFFFFF]"}`}
                                                            >
                                                                {/*{!item.action ? "Select" : "Selected"}*/}
                                                                {!isActive ? "Select" : "Selected"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            catalog?.packages.map((item: any, index: number) => {
                                                const isActive = isSelected(item.id, 'Package');
                                                return (
                                                    <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                                        <td className="py-4 px-4 text-[#1D1D1D]"><a>{item.name}</a>
                                                        </td>
                                                        <td className="py-4 px-4 items-center flex text-[#1D1D1D]">
                                                            <span
                                                                className="mr-2">{item.short_description}</span>
                                                            <button id="view-description"
                                                                    className="font-medium rounded-full">
                                                                <Image src="/info.svg" alt="info" height={36}
                                                                       width={36} className="h-5 w-5"/>
                                                            </button>
                                                        </td>
                                                        <td className="py-4 px-4 text-[#1D1D1D]">LKR {item.total_price.toLocaleString()}</td>
                                                        <td className="py-4 px-4">
                                                            <button
                                                                onClick={() => handleToggleItem(item, 'Package')}
                                                                className={`px-6 py-2 rounded-[20] cursor-pointer ${!isActive ? "bg-[#DFDFDF] text-[#1D1D1D]" : "bg-[#DB2727] text-[#FFFFFF]"}`}
                                                            >
                                                                {!isActive ? "Select" : "Selected"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {repairsTotal > 0 && (
                            <section
                                id="repairs-section"
                                className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                                <div
                                    className="w-full">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Repairs</h2>
                                        <div className="flex flex-row gap-6">
                                            <button
                                                onClick={() => setIsServiceAvailabilityModalOpen(true)}
                                                className="ml-auto text-white text-base font-medium rounded-full cursor-pointer">
                                                <Image src="/repair.svg" alt="search" height={36}
                                                       width={36} className="h-12 w-12"/>
                                            </button>
                                            <button
                                                onClick={handleAddServiceClick}
                                                className="ml-auto text-white text-base font-medium rounded-full">
                                                <Image src="/add.svg" alt="search" height={36}
                                                       width={36} className="h-12 w-12"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-black">
                                            <thead>
                                            <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                                <th className="py-5 px-4 text-left">Repairs</th>
                                                <th className="py-5 px-4 text-right justify-items-end">Estimate Price
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {groupedItems.repairs.map((item, index) => (
                                                <tr key={index}
                                                    className="text-lg font-medium justify-between text-[#1D1D1D]">
                                                    <td className="py-4 px-4 text-[#1D1D1D]">{item.name}</td>
                                                    <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR {item.price.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr className="border-y-1 border-[#575757]">
                                                <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total
                                                    Estimate
                                                    Price
                                                </td>
                                                <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">
                                                    LKR {groupedItems.repairs.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}

                        {paintsTotal > 0 && (
                            <section
                                id="paints-section"
                                className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                                <div
                                    className="w-full">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Paints</h2>
                                        <div className="flex flex-row gap-6">
                                            <button
                                                onClick={handleAddServiceClick}
                                                className="ml-auto text-white text-base font-medium rounded-full">
                                                <Image src="/add.svg" alt="search" height={36}
                                                       width={36} className="h-12 w-12"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-black">
                                            <thead>
                                            <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                                <th className="py-5 px-4 text-left">Paint Service</th>
                                                <th className="py-5 px-4 text-right justify-items-end">Estimate Price
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {groupedItems.paints.map((item, index) => (
                                                <tr key={index}
                                                    className="text-lg font-medium justify-between text-[#1D1D1D]">
                                                    <td className="py-4 px-4 text-[#1D1D1D]">{item.name}</td>
                                                    <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR {item.price.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr className="border-y-1 border-[#575757]">
                                                <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total
                                                    Estimate
                                                    Price
                                                </td>
                                                <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">
                                                    LKR {groupedItems.paints.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}


                        {addOnsTotal > 0 && (
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
                                                onClick={handleAddServiceClick}
                                                className="ml-auto text-white text-base font-medium rounded-full">
                                                <Image src="/add.svg" alt="search" height={36}
                                                       width={36} className="h-12 w-12"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-black">
                                            <thead>
                                            <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                                <th className="py-5 px-4 text-left">Add-On Packages</th>
                                                <th className="py-5 px-4 text-right justify-items-end">Estimate Price
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {groupedItems.addOns.map((item, index) => (
                                                <tr key={index}
                                                    className="text-lg font-medium justify-between text-[#1D1D1D]">
                                                    <td className="py-4 px-4 text-[#1D1D1D]">{item.name}</td>
                                                    <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR {item.price.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr className="border-y-1 border-[#575757]">
                                                <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total
                                                    Estimate
                                                    Price
                                                </td>
                                                <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">
                                                    LKR {groupedItems.addOns.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}


                        {packagesTotal > 0 && (
                            <section
                                id="packages-section"
                                className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                                <div
                                    className="w-full">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Packages</h2>
                                        <div className="flex flex-row gap-6">
                                            <button
                                                onClick={handleAddServiceClick}
                                                className="ml-auto text-white text-base font-medium rounded-full">
                                                <Image src="/add.svg" alt="search" height={36}
                                                       width={36} className="h-12 w-12"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-black">
                                            <thead>
                                            <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">
                                                <th className="py-5 px-4 text-left">Paint Service</th>
                                                <th className="py-5 px-4 text-right justify-items-end">Estimate Price
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {groupedItems.packages.map((item, index) => (
                                                <tr key={index}
                                                    className="text-lg font-medium justify-between text-[#1D1D1D]">
                                                    <td className="py-4 px-4 text-[#1D1D1D]">{item.name}</td>
                                                    <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR {item.price.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            <tr className="border-y-1 border-[#575757]">
                                                <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total
                                                    Estimate
                                                    Price
                                                </td>
                                                <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">
                                                    LKR {groupedItems.packages.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}


                        {totals.total > 0 &&(
                            <section
                                id="loyalty-section"
                                className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                                <div
                                    className="w-full">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Loyalty
                                            Points
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
                                            {loadingPromos && (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-4">Loading promotions...
                                                    </td>
                                                </tr>
                                            )}
                                            {!loadingPromos && promoList?.map((item: any, index: number) => (
                                                <tr key={index} className="text-lg font-medium text-[#1D1D1D]">
                                                    <td className="py-4 px-4 text-[#1D1D1D]">{item.category}</td>
                                                    <td className="py-4 px-4 text-[#1D1D1D]">{item.points}</td>
                                                    <td className="py-4 px-4 items-center flex"><span
                                                        className="mr-8">{item.code}</span>
                                                        <button
                                                            onClick={() => handleCopy(item.code, index)}
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


                        {totals.total > 0 && (
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
                                                <th className="py-5 px-4 text-right justify-items-end">Estimate Total
                                                    Price
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {repairsTotal > 0 && (
                                                <>
                                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                                        <td className="py-4 px-4 text-[#1D1D1D] font-semibold">Repairs</td>
                                                        <td className="py-4 px-4 text-right text-[#1D1D1D] font-semibold">
                                                            LKR {repairsTotal.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                    {/*<tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">*/}
                                                    {/*    <td className="py-2 px-3 pb-2 text-[#1D1D1D] font-medium"><input*/}
                                                    {/*        type="text"*/}
                                                    {/*        placeholder={promo ? "Promo Applied" : "Enter Promo Code"}*/}
                                                    {/*        value={promoInput}*/}
                                                    {/*        onChange={(e) => setPromoInput(e.target.value)}*/}
                                                    {/*        disabled={!!promo || validatePromoMutation.isPending}*/}
                                                    {/*        className="border-none focus:border-none focus:outline-none"/>*/}
                                                    {/*    </td>*/}
                                                    {/*    <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold ">*/}
                                                    {/*        <button*/}
                                                    {/*            // className="font-bold text-[#FFFFFF] bg-[#1D1D1D] rounded-[20] px-16 py-2"*/}
                                                    {/*            onClick={handleApplyPromo}*/}
                                                    {/*            disabled={!!promo || validatePromoMutation.isPending}*/}
                                                    {/*            className={`font-bold text-[#FFFFFF] rounded-[20] px-16 py-2 transition-all ${*/}
                                                    {/*                !!promo*/}
                                                    {/*                    ? "bg-green-600 cursor-default"*/}
                                                    {/*                    : "bg-[#1D1D1D] hover:bg-gray-800"*/}
                                                    {/*            }`}*/}
                                                    {/*        >*/}
                                                    {/*            {validatePromoMutation.isPending*/}
                                                    {/*                ? "Checking..."*/}
                                                    {/*                : promo ? "Applied" : "Apply"*/}
                                                    {/*            }*/}
                                                    {/*        </button>*/}
                                                    {/*    </td>*/}
                                                    {/*</tr>*/}

                                                    {repairPromo ? (
                                                        /* --- APPLIED STATE --- */
                                                        <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                                            <td className="py-2 px-3 pb-2 text-green-600 font-medium">
                                                                Promo Applied: {getPromoForType('Repair')?.code}
                                                            </td>
                                                            <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold">
                                                                <button
                                                                    onClick={() => removePromo(repairPromo.code)}
                                                                    className="font-bold text-red-500 hover:text-red-700 underline text-base px-16 py-2"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        /* --- INPUT STATE (Using your original styling) --- */
                                                        <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                                            <td className="py-2 px-3 pb-2 text-[#1D1D1D] font-medium">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Promo Code"
                                                                    value={promoInputs.repairs}
                                                                    disabled={loadingCategory === 'repairs'}
                                                                    onChange={(e) => handleInputChange('repairs', e.target.value)}
                                                                    className="border-none focus:border-none focus:outline-none w-full bg-transparent placeholder-gray-400"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold">
                                                                <button
                                                                    onClick={() => handleApplyCategoryPromo('repairs', 'Repair')}
                                                                    className={`font-bold text-[#FFFFFF] bg-[#1D1D1D] rounded-[20] px-16 py-2 hover:bg-gray-800 transition-all ${
                                                                        loadingCategory === 'repairs' ? "opacity-70 cursor-not-allowed" : ""
                                                                    }`}
                                                                >
                                                                    {loadingCategory === 'repairs' ? "..." : "Apply"}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            )}
                                            {paintsTotal > 0 && (
                                                <>
                                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                                        <td className="py-4 px-4 text-[#1D1D1D] font-semibold">Paints</td>
                                                        <td className="py-4 px-4 text-right text-[#1D1D1D] font-semibold">
                                                            LKR {paintsTotal.toLocaleString()}
                                                        </td>
                                                    </tr>

                                                    {paintPromo ? (
                                                        <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                                            <td className="py-2 px-3 pb-2 text-green-600 font-medium">
                                                                Promo Applied: {paintPromo.code}
                                                            </td>
                                                            <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold">
                                                                <button
                                                                    onClick={() => removePromo(paintPromo.code)}
                                                                    className="font-bold text-red-500 hover:text-red-700 underline text-base px-16 py-2"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                                            <td className="py-2 px-3 pb-2 text-[#1D1D1D] font-medium">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Promo Code"
                                                                    value={promoInputs.paints}
                                                                    onChange={(e) => handleInputChange('paints', e.target.value)}
                                                                    disabled={loadingCategory === 'paints'}
                                                                    className="border-none focus:border-none focus:outline-none w-full bg-transparent placeholder-gray-400"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold">
                                                                <button
                                                                    onClick={() => handleApplyCategoryPromo('paints', 'Paint')}
                                                                    disabled={loadingCategory === 'paints'}
                                                                    className={`font-bold text-[#FFFFFF] bg-[#1D1D1D] rounded-[20] px-16 py-2 hover:bg-gray-800 transition-all ${
                                                                        loadingCategory === 'paints' ? "opacity-70 cursor-not-allowed" : ""
                                                                    }`}
                                                                >
                                                                    {loadingCategory === 'paints' ? "..." : "Apply"}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            )}
                                            {addOnsTotal > 0 && (
                                                <>
                                                    <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                                        <td className="py-4 px-4 text-[#1D1D1D] font-semibold">AddOns</td>
                                                        <td className="py-4 px-4 text-right text-[#1D1D1D] font-semibold">
                                                            LKR {addOnsTotal.toLocaleString()}
                                                        </td>
                                                    </tr>

                                                    {addOnPromo ? (
                                                        <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                                            <td className="py-2 px-3 pb-2 text-green-600 font-medium">
                                                                Promo Applied: {addOnPromo.code}
                                                            </td>
                                                            <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold">
                                                                <button
                                                                    onClick={() => removePromo(addOnPromo.code)}
                                                                    className="font-bold text-red-500 hover:text-red-700 underline text-base px-16 py-2"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <tr className="text-lg font-medium justify-between text-[#1D1D1D] px-6 pb-6">
                                                            <td className="py-2 px-3 pb-2 text-[#1D1D1D] font-medium">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Promo Code"
                                                                    value={promoInputs.addOns}
                                                                    onChange={(e) => handleInputChange('addOns', e.target.value)}
                                                                    disabled={loadingCategory === 'addOns'}
                                                                    className="border-none focus:border-none focus:outline-none w-full bg-transparent placeholder-gray-400"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold">
                                                                <button
                                                                    onClick={() => handleApplyCategoryPromo('addOns', 'AddOn')}
                                                                    disabled={loadingCategory === 'addOns'}
                                                                    className={`font-bold text-[#FFFFFF] bg-[#1D1D1D] rounded-[20] px-16 py-2 hover:bg-gray-800 transition-all ${
                                                                        loadingCategory === 'addOns' ? "opacity-70 cursor-not-allowed" : ""
                                                                    }`}
                                                                >
                                                                    {loadingCategory === 'addOns' ? "..." : "Apply"}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            )}

                                            <tr>
                                                <td>‎</td>
                                                <td>‎</td>
                                            </tr>
                                            <tr className="border-y-1 border-[#575757]">
                                                <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D] mt-8">Estimate
                                                    Price
                                                </td>
                                                <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D] mt-8">
                                                    LKR {totals.subTotal.toLocaleString()}
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
                                                <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR {totals.subTotal.toLocaleString()}</td>
                                            </tr>
                                            {/*<tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">*/}
                                            {/*    <td className="py-4 px-4 text-[#1D1D1D]">Applied Promo Code</td>*/}
                                            {/*    <td className="py-4 px-4 text-right text-[#1D1D1D]">NEWSERVICE500</td>*/}
                                            {/*</tr>*/}
                                            {/*<tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">*/}
                                            {/*    <td className="py-4 px-4 text-[#1D1D1D]">Discount Amount</td>*/}
                                            {/*    <td className="py-4 px-4 text-right text-[#1D1D1D]">LKR 30,000</td>*/}
                                            {/*</tr>*/}

                                            <>
                                                {/*<tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">*/}
                                                {/*    <td className="py-4 px-4 text-[#1D1D1D]">Applied Code</td>*/}
                                                {/*    <td className="py-4 px-4 text-right text-green-600 font-bold">{promo.code}</td>*/}
                                                {/*</tr>*/}
                                                <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                                    <td className="py-4 px-4 text-[#1D1D1D]">Discount Amount</td>
                                                    <td className="py-4 px-4 text-right text-red-600">
                                                        {totals.discount > 0 ? `- LKR ${totals.discount.toLocaleString()}` : "LKR 0"}
                                                    </td>
                                                </tr>
                                            </>


                                            <tr className="border-t-1 border-[#575757]">
                                                <td className="py-4 px-4 font-bold text-xl text-[#DB2727] mt-8">
                                                    Final Estimate Price
                                                </td>
                                                <td className="py-4 px-4 font-bold text-xl text-right text-[#DB2727] mt-8">
                                                    LKR {totals.total.toLocaleString()}
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
                        )}


                        <section
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                            <form className="flex flex-col">
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="font-semibold text-[22px] text-[#000000] mb-6">Assign to
                                            Sales</h2>
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
                            </form>
                        </section>


                        <section
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center mb-8">
                            <div
                                className="w-full">
                                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Last
                                    Services</h2>

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

                    {
                        isServiceAvailabilityModalOpen && (
                            <Modal
                                title="Unavailable Service"
                                onClose={() => {
                                    setIsServiceAvailabilityModalOpen(false);
                                }}
                                actionButton={{
                                    label: "Submit",
                                    onClick: handleSubmitUnavailable(handleUnavailableSubmit),
                                }}
                                isPriorityAvailable={false}
                            >
                                <form onSubmit={handleSubmitUnavailable(handleUnavailableSubmit)}>
                                    <div className="mb-8">
                                        <div className="flex flex-col justify-center items-center">
                                            <Image src="/search.gif" alt="search" width={128} height={128}
                                                   className="w-32 h-32"/>
                                            <div className="text-center">
                                                <h2 className="font-semibold text-xl text-[#000000]">Oops! That that service
                                                    is
                                                    Not
                                                    Available</h2>
                                                <h3 className="text-[#575757] text-[15px] font-medium">Please add it to the
                                                    unavailable service list.</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <FormField
                                            label="Unavailable Repair"
                                            type="text"
                                            placeholder="Unavailable Repair"
                                            isIcon={false}
                                            register={registerUnavailable("unavailable_repair")}
                                            error={unavailableErrors.unavailable_repair}
                                        />

                                        <FormField
                                            label="Unavailable Paint"
                                            type="text"
                                            placeholder="Unavailable Paint"
                                            isIcon={false}
                                            register={registerUnavailable("unavailable_paint")}
                                            error={unavailableErrors.unavailable_paint}
                                        />
                                        <FormField
                                            label="Unavailable Add-Ons"
                                            type="text"
                                            placeholder="Unavailable Add-Ons"
                                            isIcon={false}
                                            register={registerUnavailable("unavailable_add_on")}
                                            error={unavailableErrors.unavailable_add_on}
                                        />
                                        <FormField
                                            label="Note"
                                            type="text"
                                            placeholder="Enter your note"
                                            isIcon={false}
                                            register={registerUnavailable("note")}
                                            error={unavailableErrors.note}
                                        />
                                    </div>
                                </form>
                            </Modal>
                        )
                    }
                </div>
            </div>
        </>
    )
        ;
}

export default ServicePark;
