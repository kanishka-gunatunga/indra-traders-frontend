/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import FormField from "@/components/FormField";
import z from "zod";
import {useForm} from "react-hook-form";
import {
    useAssignToSale, useAvailablePromos,
    useBranchCatalog,
    useBranchDetails,
    useServiceIntake,
    useValidatePromo,
    useBranches
} from "@/hooks/useServicePark";
import {zodResolver} from "@hookform/resolvers/zod";
import Modal from "@/components/Modal";
import {useCreateUnavailableService} from "@/hooks/useUnavailable";
import Toast from "@/components/Toast";
import {useToast} from "@/hooks/useToast";
import {useCurrentUser} from "@/utils/auth";
import {useServiceCart, CartItem} from "@/hooks/useServiceCart";
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';
import {setBookingData} from "@/redux/slices/bookingSlice";


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

    const [vehicleCustomerData, setVehicleCustomerData] = useState<{
        customer_id: string;
        vehicle_id: string;
        customer_no: string;
    } | null>(null);


    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        packages: false,
        repairs: false,
        paints: false,
        maintenance: false,
        addOns: false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };


    const user = useCurrentUser();
    const userId = Number(user?.id) || 1;

    const dispatch = useDispatch();
    const router = useRouter();

    const allServicesSectionRef = useRef<HTMLElement>(null);


    const [packageData, setPackageData] = useState(initialPackageData);
    const [maintenanceData, setMaintenanceData] = useState(initialMaintenanceData);
    const [allServicesData, setAllServicesData] = useState(initialAllServicesData);

    const [value, setValue] = useState("Services");

    const [copiedIndex, setCopiedIndex] = useState<null | number>(null);

    const [isServiceAvailabilityModalOpen, setIsServiceAvailabilityModalOpen] = useState(false);

    const [isPackageExpanded, setIsPackageExpanded] = useState(false);
    const [isServicesExpanded, setIsServicesExpanded] = useState(false);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(15);

    const [promoInput, setPromoInput] = useState("");
    const [isPromoValidating, setIsPromoValidating] = useState(false);

    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

    const {data: catalog, isLoading: loadingCatalog} = useBranchCatalog(selectedBranchId);
    const validatePromoMutation = useValidatePromo();
    const {data: promoList, isLoading: loadingPromos} = useAvailablePromos();

    const [allServicesView, setAllServicesView] = useState<"Services" | "Packages">("Services");


    const [searchServiceQuery, setSearchServiceQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isServiceSearchActive, setIsServiceSearchActive] = useState(false);

    const sourceData = allServicesView === "Services"
        ? catalog?.services || []
        : catalog?.packages || [];

    const filteredData = React.useMemo(() => {
        if (!searchServiceQuery) return sourceData;
        const lowerQuery = searchServiceQuery.toLowerCase();

        return sourceData.filter((item: any) => {
            const nameMatch = item.name?.toLowerCase().includes(lowerQuery);
            const descMatch = (item.description || item.short_description)?.toLowerCase().includes(lowerQuery);
            const typeMatch = item.type?.toLowerCase().includes(lowerQuery);
            return nameMatch || descMatch || typeMatch;
        });
    }, [sourceData, searchServiceQuery]);


    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [allServicesView, searchQuery]);


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
        groupedItems, totals, removePromo, selectedItems, applyPromo, activePromo
    } = useServiceCart();


    // const getCategoryTotal = (items: CartItem[]) => {
    //     return items.reduce((sum, item) => sum + item.price, 0);
    // };
    //
    // const packagesTotal = getCategoryTotal(groupedItems.packages);
    // const maintenanceTotal = getCategoryTotal(groupedItems.maintenance);
    // const repairsTotal = getCategoryTotal(groupedItems.repairs);
    // const paintsTotal = getCategoryTotal(groupedItems.paints);
    // const addOnsTotal = getCategoryTotal(groupedItems.addOns);


    const {
        register: registerVehicle,
        handleSubmit: handleVehicleSubmit,
        reset: resetVehicle,
        formState: {errors: vehicleErrors},
        getValues
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

    const { data: branches, isLoading: loadingBranches } = useBranches();

    const {toast, showToast, hideToast} = useToast();

    const {mutate: createUnavailableServiceMutation, isPending: isUnavailablePending} = useCreateUnavailableService();


    const branchOptions = branches?.map((branch: any) => ({
        value: branch.name,
        label: branch.name
    })) || [];


    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;

        const selectedBranch = branches?.find((b: any) => b.name === selectedName);

        if (selectedBranch) {
            console.log("Selected Branch Name:", selectedName);
            console.log("Selected Branch ID:", selectedBranch.id);

            setSelectedBranchId(selectedBranch.id);
        } else {
            setSelectedBranchId(null);
        }
    };

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
        const id = item.id;
        const isActive = isSelected(id, type);

        if (isActive) {
            removeItem(id, type);
        } else {
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

    const handleApplyGlobalPromo = () => {
        if (!promoInput.trim()) {
            showToast("Please enter a promo code", "error");
            return;
        }

        setIsPromoValidating(true);

        validatePromoMutation.mutate(promoInput, {
            onSuccess: (data) => {
                if (data.isValid) {
                    applyPromo({
                        code: data.code,
                        discountType: data.discountType,
                        amount: data.amount,
                        applicableTypes: data.applicableTypes
                    });
                    showToast("Promo applied successfully!", "success");
                    setPromoInput("");
                }
            },
            onError: (error: any) => {
                const msg = error.response?.data?.message || "Invalid Promo Code";
                showToast(msg, "error");
            },
            onSettled: () => {
                setIsPromoValidating(false);
            }
        });
    };

    const categoryTitles: Record<string, string> = {
        packages: "Packages",
        repairs: "Repairs",
        paints: "Paints",
        maintenance: "Maintenance",
        addOns: "Add-Ons"
    };


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

    const handleBookNow = () => {
        const vehicleValues = getValues();

        dispatch(setBookingData({
            vehicleData: vehicleValues,
            selectedServices: selectedItems,
            totals: totals
        }));

        router.push('/call-agent/service-park/book');
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
                                        {/*<FormField*/}
                                        {/*    label="Service Center"*/}
                                        {/*    type="select"*/}
                                        {/*    placeholder="Service Center"*/}
                                        {/*    register={registerVehicle("service_center")}*/}
                                        {/*    error={vehicleErrors.service_center}*/}
                                        {/*/>*/}

                                        <FormField
                                            label="Service Center"
                                            type="select"
                                            placeholder="Select Branch"
                                            options={branchOptions}
                                            disabled={loadingBranches}
                                            register={registerVehicle("service_center", {
                                                onChange: handleBranchChange
                                            })}
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
                                    <h2 className="text-xl md:text-[22px] font-semibold text-black px-4">Recommended
                                        Package Details</h2>
                                    <div className="flex gap-5">
                                        {isPackageExpanded && (
                                            <div className="relative flex items-center justify-end">
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onBlur={() => !searchQuery && setIsSearchActive(false)}
                                                    placeholder="Search packages..."
                                                    className={`
                                                        bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500
                                                        rounded-full border border-gray-300 outline-none
                                                        transition-all duration-300 ease-in-out
                                                        ${isSearchActive ? 'w-64 px-4 py-2 opacity-100 mr-2' : 'w-0 px-0 py-2 opacity-0 border-none'}
                                                     `}
                                                    autoFocus={isSearchActive}
                                                />
                                                <button
                                                    id="package-search-button"
                                                    aria-label="Search packages"
                                                    onClick={() => setIsSearchActive(!isSearchActive)}
                                                    className={`ml-auto text-white text-base font-medium rounded-full animate-fade-in z-10 cursor-pointer ${isSearchActive ? 'bg-[#DB2727] p-1 scale-90' : ''}`}
                                                >
                                                    <Image
                                                        src="/search.svg"
                                                        alt="search"
                                                        height={36}
                                                        width={36}
                                                        className="h-12 w-12"
                                                    />
                                                </button>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsPackageExpanded(!isPackageExpanded)}
                                            aria-expanded={isPackageExpanded}
                                            aria-controls="package-table-content"
                                            aria-label={isPackageExpanded ? "Collapse package details" : "Expand package details"}
                                            className="ml-auto text-white text-base font-medium rounded-full cursor-pointer">
                                            <Image src="/expand-arrow.svg" alt="search" height={36}
                                                   width={36}
                                                   className={`h-12 w-12 transition-transform duration-300 ease-in-out ${isPackageExpanded ? 'rotate-180' : ''}`}/>
                                        </button>
                                    </div>
                                </div>
                                {isPackageExpanded && (
                                    <div id="package-table-content" className="overflow-x-auto animate-slide-down mt-8">
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
                                )}
                            </div>
                        </section>


                        <section
                            id="maintaince-section"
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                            <div
                                className="w-full">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="text-xl md:text-[22px] font-semibold text-black px-4">Recommended
                                        Maintenance Details</h2>
                                    <div className="flex gap-5">
                                        {isServicesExpanded && (
                                            <button
                                                className="ml-auto text-white text-base font-medium rounded-full animate-fade-in">
                                                <Image src="/search.svg" alt="search" height={36}
                                                       width={36} className="h-12 w-12"/>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsServicesExpanded(!isServicesExpanded)}
                                            aria-expanded={isServicesExpanded}
                                            aria-controls="service-table-content"
                                            aria-label={isServicesExpanded ? "Collapse service details" : "Expand service details"}
                                            className="ml-auto text-white text-base font-medium rounded-full">
                                            <Image src="/expand-arrow.svg" alt="search" height={36}
                                                   width={36}
                                                   className={`h-12 w-12 transition-transform duration-300 ease-in-out ${isServicesExpanded ? 'rotate-180' : ''}`}/>
                                        </button>
                                    </div>
                                </div>

                                {isServicesExpanded && (
                                    <div id="service-table-content" className="overflow-x-auto animate-slide-down mt-8">
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
                                )}
                            </div>
                        </section>


                        <section
                            id="all-service-section"
                            ref={allServicesSectionRef}
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                            <div
                                className="w-full">
                                <div className="flex flex-row items-center mb-8 justify-between">
                                    <h2 className="text-xl md:text-[22px] font-semibold text-black px-4">All
                                        Services</h2>
                                    <div className="flex flex-row gap-6">
                                        <div className="relative flex items-center justify-end">
                                            <input
                                                type="text"
                                                value={searchServiceQuery}
                                                onChange={(e) => setSearchServiceQuery(e.target.value)}
                                                onBlur={() => !searchServiceQuery && setIsServiceSearchActive(false)}
                                                placeholder={`Search ${allServicesView.toLowerCase()}...`}
                                                className={`
                                    bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500
                                    rounded-full border border-gray-300 outline-none
                                    transition-all duration-300 ease-in-out h-10 text-sm
                                    ${isServiceSearchActive ? 'w-64 px-4 opacity-100 mr-2 border' : 'w-0 px-0 opacity-0 border-none'}
                                `}
                                                autoFocus={isServiceSearchActive}
                                            />
                                            <button
                                                onClick={() => setIsServiceSearchActive(!isServiceSearchActive)}
                                                className={`ml-auto text-white text-base font-medium rounded-full z-10 transition-transform duration-200 cursor-pointer ${isServiceSearchActive ? 'scale-90' : ''}`}
                                            >
                                                <Image src="/search.svg" alt="search" height={36} width={36}
                                                       className="h-12 w-12"/>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setIsServiceAvailabilityModalOpen(true)}
                                            className="ml-auto text-white text-base font-medium rounded-full cursor-pointer">
                                            <Image src="/repair.svg" alt="search" height={36}
                                                   width={36} className="h-12 w-12"/>
                                        </button>

                                        <div id="toggle-buttons"
                                             className="flex justify-center bg-[#FFFFFF] rounded-full">
                                            <button
                                                type="button"
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

                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((item: any, index: number) => {
                                                const typeMap: any = {
                                                    'REPAIR': 'Repair',
                                                    'PAINT': 'Paint',
                                                    'Maintenance': 'Maintenance',
                                                    'ADDON': 'AddOn'
                                                };

                                                const isService = allServicesView === "Services";
                                                const cartType = isService ? (typeMap[item.type] || 'Repair') : 'Package';
                                                const isActive = isSelected(item.id, cartType);

                                                // Display values
                                                const name = item.name;
                                                const description = isService ? item.type : (
                                                    <div className="flex items-center">
                                                        <span
                                                            className="mr-2 truncate max-w-[200px]">{item.short_description}</span>
                                                        <button
                                                            className="font-medium rounded-full hover:bg-gray-200 p-1 transition">
                                                            <Image src="/info.svg" alt="info" height={20} width={20}/>
                                                        </button>
                                                    </div>
                                                );
                                                const price = isService ? item.price : item.total_price;

                                                return (
                                                    <tr key={item.id || index}
                                                        className="text-lg font-medium text-[#1D1D1D] hover:bg-white/40 transition-colors border-b border-gray-200 last:border-0">
                                                        <td className="py-4 px-4"><a>{name}</a></td>
                                                        <td className="py-4 px-4">{description}</td>
                                                        <td className="py-4 px-4">LKR {price.toLocaleString()}</td>
                                                        <td className="py-4 px-4">
                                                            <button
                                                                onClick={() => handleToggleItem(item, cartType)}
                                                                className={`px-6 py-2 rounded-[20px] cursor-pointer transition-all duration-200 ${
                                                                    !isActive
                                                                        ? "bg-[#DFDFDF] text-[#1D1D1D] hover:bg-gray-300"
                                                                        : "bg-[#DB2727] text-[#FFFFFF] hover:bg-red-700 shadow-md"
                                                                }`}
                                                            >
                                                                {!isActive ? "Select" : "Selected"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-10 text-center text-gray-500">
                                                    No {allServicesView.toLowerCase()} found
                                                    matching &quot;{searchQuery}&quot;.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="flex justify-center items-center h-8 px-4 rounded-md bg-white/50 text-gray-600 font-medium hover:bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                Prev
                                            </button>

                                            <div className="flex items-center space-x-2">
                                                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`w-8 h-8 text-[13px] rounded-lg font-semibold transition-all cursor-pointer duration-200 ${
                                                            currentPage === page
                                                                ? "bg-[#DB2727] text-white shadow-md transform scale-105"
                                                                : "bg-white/30 text-[#333333] hover:bg-white/60"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="flex text-sm justify-center items-center h-8 px-4 rounded-md bg-white/50 text-[#333333] font-medium hover:bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </section>

                        {totals.total > 0 && (
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

                                            {Object.entries(groupedItems).map(([key, items]) => {
                                                if (items.length === 0) return null;

                                                const isExpanded = expandedSections[key];
                                                const categoryTotal = items.reduce((sum, item) => sum + item.price, 0);

                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr
                                                            onClick={() => toggleSection(key)}
                                                            className="bg-white/20">
                                                            <td
                                                                className="py-3 px-4 font-semibold text-[#1D1D1D] text-[18px] tracking-wide items-center flex opacity-70 gap-2">
                                                                <svg
                                                                    className={`w-5 h-5 text-[#1D1D1D] cursor-pointer transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                                                </svg>
                                                                {categoryTitles[key]}

                                                                <span
                                                                    className="font-medium text-[14px] text-[#575757]">
                                                                    ({items.length} services)
                                                                  </span>
                                                            </td>

                                                            <td className="py-3 px-4 text-right font-semibold text-[#1D1D1D] text-[18px] opacity-80">
                                                                LKR {categoryTotal.toLocaleString()}
                                                            </td>
                                                        </tr>

                                                        {isExpanded && items.map((item) => (
                                                            <tr key={`${item.type}-${item.id}`}
                                                                className="group border-b border-gray-200/50 last:border-0 hover:bg-red-50/30 transition-colors duration-200 animate-slide-down">
                                                                <td className="py-3 px-4 font-medium text-[#575757] text-[16px] pl-12">
                                                                    {item.name}
                                                                </td>

                                                                <td className="py-3 px-4 text-right pr-6">
                                                                    <div
                                                                        className="flex items-center justify-end gap-4">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removeItem(item.id, item.type)
                                                                            }}
                                                                            className="opacity-0 group-hover:opacity-100 cursor-pointer transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 p-1 hover:bg-red-100 rounded-full"
                                                                            title="Remove item"
                                                                            aria-label={`Remove ${item.name}`}
                                                                        >
                                                                            <Image
                                                                                src="/close.svg"
                                                                                alt="remove"
                                                                                width={32}
                                                                                height={32}
                                                                                className="w-7 h-7 opacity-100"
                                                                            />
                                                                        </button>
                                                                        <span
                                                                            className="text-[#575757] text-[16px] font-medium group-hover:mr-2 transition-all duration-200">
                                                                            LKR {item.price.toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })}

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

                                            {!activePromo && (
                                                <tr>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-4 max-w-md">
                                                            <input
                                                                type="text"
                                                                value={promoInput}
                                                                onChange={(e) => setPromoInput(e.target.value)}
                                                                placeholder="Enter Promo Code"
                                                                disabled={isPromoValidating}
                                                                className="border-none focus:border-none focus:outline-none w-full bg-transparent placeholder-gray-400"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-3 pb-2 text-right text-[#1D1D1D] font-semibold">
                                                        <button
                                                            onClick={handleApplyGlobalPromo}
                                                            disabled={isPromoValidating || !promoInput}
                                                            className="font-bold text-[#FFFFFF] bg-[#1D1D1D] rounded-[20] px-16 py-2 hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isPromoValidating ? "..." : "Apply"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}


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

                                            {activePromo && (
                                                <tr className="text-lg font-medium justify-between text-[#1D1D1D] space-y-2">
                                                    <td className="py-4 px-4 text-[#1D1D1D]">Applied Promo Code</td>
                                                    <td className="py-4 px-4 text-right text-[#1D1D1D] gap-3 flex items-center justify-end">
                                                        <span>{activePromo.code}</span>
                                                        <button
                                                            onClick={removePromo}
                                                            className="text-red-500 underline text-sm hover:text-red-700 font-medium"
                                                        >
                                                            <Image src="/close.svg" alt="" width={32} height={32}
                                                                   className="w-10 h-10"/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}

                                            <>
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
                                                        onClick={handleBookNow}
                                                        className="font-bold text-[#FFFFFF] bg-[#DB2727] cursor-pointer rounded-[20] px-14 py-2">
                                                        Book Now
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
                            <form className="flex flex-col" style={{width: "-webkit-fill-available"}}>
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-row items-center justify-between">
                                        <h2 className="font-semibold text-[22px] text-[#000000] mb-6">Assign to
                                            Sales</h2>
                                        <div>
                                            <button
                                                onClick={handleSaleSubmit(handleAssignToSales)}
                                                disabled={assignToSale.isPending}
                                                className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition disabled:bg-gray-400 cursor-pointer">
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
