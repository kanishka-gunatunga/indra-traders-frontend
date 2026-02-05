/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/Modal";
import { z } from "zod";
import { useCreateBydSale, useCreateBydUnavailableSale } from "@/hooks/useBydSales";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import FormField from "@/components/FormField";
import { useCreateUnavailableVehicleSale } from "@/hooks/useUnavailable";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { useCurrentUser } from "@/utils/auth";
import VehicleGallery from "@/components/VehicleGallery";
import LeasingCalculator from "@/components/LeasingCalculator";
import { useActiveBanks } from "@/hooks/useLeasing";
import { calculateLeasingDetails } from "@/utils/leasing";


const vehicleSaleSchema = z.object({
    date: z.string().min(1, "Date is required"),
    customer_id: z.string().min(1, "Customer ID is required"),
    call_agent_id: z.number().int().positive("Call Agent ID is required"),
    vehicle_model: z.string().min(1, "Vehicle model is required"),
    manufacture_year: z.string().min(1, "Manufacture year is required"),
    // transmission: z.string().min(1, "Transmission is required"),
    color: z.string().min(1, "Color is required"),
    type: z.string().min(1, "Type is required"),
    down_payment: z.string().optional(),
    price_from: z.string().optional(),
    price_to: z.string().optional(),
    additional_note: z.string().optional(),
    contact_number: z.string().min(1, "Contact number is required"),
    customer_name: z.string().min(1, "Customer name is required"),

    enable_leasing: z.boolean().optional(),
    leasing_vehicle_price: z.string().optional(),
    leasing_bank: z.string().optional(),
    leasing_time_period: z.string().optional(),
    leasing_promo_code: z.string().optional(),
    leasing_interest_rate: z.string().optional(),
    leasing_monthly_installment: z.string().optional(),
    leasing_total_amount: z.string().optional(),
});

export type VehicleSaleFormData = z.infer<typeof vehicleSaleSchema>;

const unavailableVehicleSaleSchema = z.object({
    model: z.string().min(1, "Vehicle model is required"),
    manufacture_year: z.string().optional(),
    color: z.string().optional(),
    type: z.string().optional(),
    down_payment: z.string().optional(),
    price_from: z.string().optional(),
    price_to: z.string().optional(),
});

const filterSchema = z.object({
    byd_model: z.string().optional(),
    manufacture_year: z.string().optional(),
    color: z.string().optional(),
    type: z.string().optional(),
    down_payment: z.string().optional(),
    price_from: z.string().optional(),
    price_to: z.string().optional(),
});

export type FilterFormData = z.infer<typeof filterSchema>;

export type UnavailableVehicleSaleFormData = z.infer<
    typeof unavailableVehicleSaleSchema
>;


const BydSales = () => {

    const user = useCurrentUser();
    const userId = user?.id;

    console.log("user id", userId);

    const { data: banks = [], isLoading: isBanksLoading } = useActiveBanks();

    const { mutate: createSale, isPending } = useCreateBydSale();
    // const [submitSuccess, setSubmitSuccess] = useState(false);

    const { mutate: createUnavailableSale, isPending: isUnavailablePending } = useCreateBydUnavailableSale();
    const [unavailableSubmitSuccess, setUnavailableSubmitSuccess] = useState(false);

    const [showVehicleDetailsAndLoyaltyAndPromotions, setShowVehicleDetailsAndLoyaltyAndPromotions] = useState(false);

    const [externalCalculatorData, setExternalCalculatorData] = useState<any>(null);


    const [copiedIndex, setCopiedIndex] = useState<null | number>(null);

    const { toast, showToast, hideToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        control,
        reset,
    } = useForm<VehicleSaleFormData>({
        resolver: zodResolver(vehicleSaleSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0], // Default to today
            call_agent_id: Number(userId) || 1,
            customer_id: "CUS1760976040167",
            enable_leasing: false,
            vehicle_model: "",
            manufacture_year: "",
            // transmission: "",
            color: "",
            type: "",
            down_payment: "",
            price_from: "",
            price_to: "",
            additional_note: "",
            contact_number: "",
            customer_name: "",
        },
    });

    const {
        register: registerUnavailable,
        handleSubmit: handleSubmitUnavailable,
        formState: { errors: unavailableErrors },
        reset: resetUnavailable,
    } = useForm<UnavailableVehicleSaleFormData>({
        resolver: zodResolver(unavailableVehicleSaleSchema),
        defaultValues: {
            model: "",
            manufacture_year: "",
            color: "",
            type: "",
            down_payment: "",
            price_from: "",
            price_to: "",
        },
    });

    const {
        register: registerFilter,
        handleSubmit: handleSubmitFilter,
        reset: resetFilter,
        control: controlFilter,
    } = useForm<FilterFormData>({
        defaultValues: {
            byd_model: "",
            manufacture_year: "",
            color: "",
            type: "",
            down_payment: "",
            price_from: "",
            price_to: "",
        }
    });

    const vehicleData = [
        { model: 'SEALION 6', year: 2025, type: 'E-Hybrid', color: 'Arctic White', price: 'Rs 75,300,000' },
        { model: 'SEALION 6', year: 2025, type: 'E-Hybrid', color: 'Arctic White', price: 'Rs 75,300,000' },
        { model: 'SEALION 6', year: 2025, type: 'E-Hybrid', color: 'Arctic White', price: 'Rs 75,300,000' },
        { model: 'SEALION 6', year: 2025, type: 'E-Hybrid', color: 'Arctic White', price: 'Rs 75,300,000' },
    ];

    const uniqueModels = Array.from(new Set(vehicleData.map(v => v.model)));
    const bydModelOptions = uniqueModels.map(model => ({ value: model, label: model }));

    const colorOptions = [
        { value: "Arctic White", label: "Arctic White" },
        { value: "Jet Black", label: "Jet Black" },
        { value: "Metal Grey", label: "Metal Grey" },
        { value: "Crimson Red", label: "Crimson Red" },
    ];

    const typeOptions = [
        { value: "E-Hybrid", label: "E-Hybrid" },
        { value: "Electric", label: "Electric" },
    ];

    const onSubmit = (data: VehicleSaleFormData) => {
        const submissionData = {
            ...data,
            ticket_number: `ITPL${Date.now()}`,
            manufacture_year: parseInt(data.manufacture_year, 10),
            down_payment: data.down_payment ? parseFloat(data.down_payment) : 0,
            price_from: data.price_from ? parseFloat(data.price_from) : 0,
            price_to: data.price_to ? parseFloat(data.price_to) : 0,
        };

        createSale(submissionData, {
            onSuccess: () => {
                // setSubmitSuccess(true);
                showToast("BYD sale created successfully", "success");
                reset();
                // setTimeout(() => setSubmitSuccess(false), 3000);
            },
            onError: (error) => {
                console.error("Error creating BYD sale:", error);
            },
        });
    };

    const onUnavailableSubmit = (data: UnavailableVehicleSaleFormData) => {
        const submissionData = {
            call_agent_id: Number(userId) || 1,
            vehicle_model: data.model,
            manufacture_year: data.manufacture_year ? parseInt(data.manufacture_year, 10) : null,
            color: data.color,
            type: data.type,
            down_payment: data.down_payment ? parseFloat(data.down_payment) : null,
            price_from: data.price_from ? parseFloat(data.price_from) : null,
            price_to: data.price_to ? parseFloat(data.price_to) : null,
        };
        createUnavailableSale(submissionData, {
            onSuccess: () => {
                // setUnavailableSubmitSuccess(true);
                showToast("Unavailable vehicle added successfully", "success");
                resetUnavailable();
                // setTimeout(() => setUnavailableSubmitSuccess(false), 3000);
            },
            onError: (error) => {
                console.error("Error creating unavailable vehicle sale:", error);
            },
        });
    };


    useEffect(() => {
        if (userId) {
            console.log("Updating form with Logged In User ID:", userId);
            setValue("call_agent_id", Number(userId));
        }
    }, [userId, setValue]);



    const [showStockAvailability, setShowStockAvailability] = useState(false);
    const [isVehicleAvailabilityModalOpen, setIsVehicleAvailabilityModalOpen] = useState(false);

    const [priceFrom, setPriceFrom] = useState<number | "">("");
    const [priceTo, setPriceTo] = useState<number | "">("");

    const handleIncrement = (
        setter: React.Dispatch<React.SetStateAction<number | "">>,
        value: number | ""
    ) => {
        setter(value === "" ? 1 : value + 1);
    };

    const handleDecrement = (
        setter: React.Dispatch<React.SetStateAction<number | "">>,
        value: number | ""
    ) => {
        setter(value === "" ? 0 : Math.max(0, value - 1));
    };


    const isLeasingEnabled = useWatch({ control, name: "enable_leasing" });
    const watchedLeasingPrice = useWatch({ control, name: "leasing_vehicle_price" });
    const watchedLeasingDownPayment = useWatch({ control, name: "down_payment" });
    const watchedInterestRate = useWatch({ control, name: "leasing_interest_rate" });
    const watchedTimePeriod = useWatch({ control, name: "leasing_time_period" });

    const watchedLeasingBank = useWatch({ control, name: "leasing_bank" });

    const bankOptions = useMemo(() => {
        return banks.map((bank) => ({
            value: bank.bank_name,
            label: bank.bank_name
        }));
    }, [banks]);

    const timePeriodOptions = useMemo(() => {
        const selectedBank = banks.find(b => b.bank_name === watchedLeasingBank);

        if (!selectedBank) {
            // Default options if no bank selected
            return [12, 24, 36, 48, 60].map(m => ({ value: m.toString(), label: `${m} Months` }));
        }

        let months = selectedBank.available_months;
        // Parse string JSON if necessary (e.g. "[12, 24]")
        if (typeof months === "string") {
            try {
                months = JSON.parse(months);
            } catch (error) {
                console.error("Error parsing months:", error);
                months = [12, 24, 36, 48, 60];
            }
        }

        const monthArray = Array.isArray(months) ? months : [12, 24, 36, 48, 60];

        return monthArray.map((m: number) => ({
            value: m.toString(),
            label: `${m} Months`
        }));
    }, [watchedLeasingBank, banks]);


    useEffect(() => {
        if (!watchedLeasingBank) return;

        const selectedBank = banks.find(b => b.bank_name === watchedLeasingBank);
        if (selectedBank) {
            setValue("leasing_interest_rate", selectedBank.interest_rate.toString());
        }
    }, [watchedLeasingBank, banks, setValue]);


    const handleCalculatorSuccess = (data: any) => {
        setExternalCalculatorData(data);

        if (isLeasingEnabled) {
            applyCalculatorDataToForm(data);
        }
    };

    const applyCalculatorDataToForm = (data: any) => {
        setValue("leasing_bank", data.bankName);
        setValue("leasing_time_period", data.months.toString());
        setValue("leasing_interest_rate", data.interestRate.toString());
        setValue("down_payment", data.downPayment.toString());

        // We assume the calculator used the vehicle price provided (or entered).
        // Since Calculator component prop 'vehiclePrice' was hardcoded to 1000000 in your example:
        setValue("leasing_vehicle_price", "1000000");

        // Results
        setValue("leasing_monthly_installment", data.monthlyInstallment.toString());
        setValue("leasing_total_amount", data.totalAmount.toString());

        showToast("Leasing details applied from calculator", "success");
    }

    useEffect(() => {
        if (isLeasingEnabled && externalCalculatorData) {
            applyCalculatorDataToForm(externalCalculatorData);
        }
    }, [isLeasingEnabled, externalCalculatorData, setValue]);

    useEffect(() => {
        // Only run calculation if leasing is enabled and we have the necessary inputs
        if (!isLeasingEnabled) return;

        const price = parseFloat(watchedLeasingPrice || "0");
        const down = parseFloat(watchedLeasingDownPayment || "0");
        const rate = parseFloat(watchedInterestRate || "0");
        const months = parseFloat(watchedTimePeriod || "0");

        // Avoid infinite loops or unnecessary calcs if fields are empty
        if (price > 0 && months > 0) {
            const { monthly, total } = calculateLeasingDetails(price, down, rate, months);

            // Update read-only fields
            setValue("leasing_monthly_installment", monthly.toString());
            setValue("leasing_total_amount", total.toString());
        }
    }, [watchedLeasingPrice, watchedLeasingDownPayment, watchedInterestRate, watchedTimePeriod, isLeasingEnabled, setValue]);


    const stockData = [
        {
            physical: 'BYD SEALION 6 E-Hybrid Smoke Grey',
            onOrder: 'BYD SEALION 6 E-Hybrid Arctic White',
        },
        {
            physical: 'BYD SEALION 6 E-Hybrid Crimson Red',
            onOrder: 'BYD SEALION 6 E-Hybrid Ocean Blue',
        },
        {
            physical: 'BYD SEALION 6 E-Hybrid Desert Sand',
            onOrder: 'BYD SEALION 6 E-Hybrid Forest Green',
        },
        {
            physical: 'BYD SEALION 6 E-Hybrid Midnight Black',
            onOrder: 'BYD SEALION 6 E-Hybrid Silver Metallic',
        },
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


    const handleStockItemClick = () => {
        setShowVehicleDetailsAndLoyaltyAndPromotions(true);
    };




    const vehicleModelOptions = Array.from(
        new Set(vehicleData.map((vehicle) => vehicle.model))
    ).map((model) => ({
        value: model,
        label: model,
    }));


    const manufactureYearOptions = [2020, 2021, 2022, 2023, 2024, 2025].map((year) => ({
        value: year.toString(),
        label: year.toString(),
    }));

    const transmissionOptions = [
        { value: "AUTO", label: "Automatic" },
        { value: "MANUAL", label: "Manual" },
    ];

    const fuelTypeOptions = [
        { value: "PETROL", label: "Petrol" },
        { value: "DIESEL", label: "Diesel" },
        { value: "HYBRID", label: "Hybrid" },
        { value: "ELECTRIC", label: "Electric" },
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
                    <h1 className="text-2xl font-extrabold mb-4">Indra Traders Dashboard</h1>

                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="font-semibold text-[22px] mb-6">Filters</h2>
                                <div>
                                    <button
                                        className="ml-auto mt-8 md:mt-0 text-[#DB2727] text-base font-medium rounded-full px-9 py-2 hover:text-red-400 cursor-pointer transition">
                                        Clear all
                                    </button>
                                    <button
                                        id="applyBtn"
                                        onClick={() => setShowStockAvailability(true)}
                                        className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 cursor-pointer transition">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <FormField
                                    label="BYD Model"
                                    placeholder="Select BYD Model"
                                    isIcon={true}
                                    type="select"
                                    options={bydModelOptions}
                                    register={registerFilter("byd_model")}
                                />
                                <FormField
                                    label="Manufacture Year"
                                    placeholder="Manufacture Year"
                                    isIcon={true}
                                    type="select"
                                    options={manufactureYearOptions}
                                    register={registerFilter("manufacture_year")}
                                />
                                <FormField
                                    label="Color"
                                    placeholder="Select Color"
                                    isIcon={false}
                                    type="select"
                                    options={colorOptions}
                                    register={registerFilter("color")}
                                />
                                <FormField
                                    label="Type"
                                    placeholder="Select Type"
                                    isIcon={false}
                                    type="select"
                                    options={typeOptions}
                                    register={registerFilter("type")}
                                />
                                <FormField
                                    label="Down Payment"
                                    placeholder="Enter Down Payment"
                                    isIcon={false}
                                    type="text"
                                    register={registerFilter("down_payment")}
                                />

                                <div className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">
                                        Price Range
                                    </span>

                                    <div className="flex gap-4">
                                        {/* Price From */}
                                        <div className="relative w-1/2">
                                            <input
                                                type="number"
                                                placeholder="Price From"
                                                value={priceFrom}
                                                onChange={(e) => setPriceFrom(e.target.value === "" ? "" : Number(e.target.value))}
                                                className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                                            />
                                            <div
                                                className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrement(setPriceFrom, priceFrom)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(setPriceFrom, priceFrom)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price To */}
                                        <div className="relative w-1/2">
                                            <input
                                                type="number"
                                                placeholder="Price To"
                                                value={priceTo}
                                                onChange={(e) => setPriceTo(e.target.value === "" ? "" : Number(e.target.value))}
                                                className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                                            />
                                            <div
                                                className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrement(setPriceTo, priceTo)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(setPriceTo, priceTo)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


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
                                    <div>
                                        <button
                                            onClick={() => setIsVehicleAvailabilityModalOpen(true)}
                                            className="ml-auto text-white text-base font-medium rounded-full">
                                            <Image src="/dashboard/availability.svg" alt="availability" height={36}
                                                width={36} className="h-12 w-12" />
                                        </button>
                                    </div>
                                </div>

                                {/* Table Headers */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-black">
                                        <thead>
                                            <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                                <th className="py-5 px-4 text-left">Physical</th>
                                                <th className="py-5 px-4 text-left">On Order</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockData.map((item, index) => (
                                                <tr key={index} onClick={handleStockItemClick}
                                                    className="text-lg font-medium text-[#4353FF] underline">
                                                    <td className="py-4 px-4"><a>{item.physical}</a></td>
                                                    <td className="py-4 px-4">{item.onOrder}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {showStockAvailability && showVehicleDetailsAndLoyaltyAndPromotions && (
                        <section
                            className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                            <div className="w-full flex justify-between items-center">
                                <span className="font-semibold text-[22px]">
                                    2025 BYD SEALION 6 E-Hybrid Arctic White
                                </span>
                                <div className="flex gap-3">
                                    <button
                                        className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                                        <Image
                                            src={"/images/material-symbols_sms-outline.svg"}
                                            alt="material-symbols_sms-outline"
                                            width={24}
                                            height={24}
                                        />
                                    </button>

                                    <button
                                        className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                                        <Image
                                            src={"/images/ri_whatsapp-line.svg"}
                                            alt="ri_whatsapp-line"
                                            width={24}
                                            height={24}
                                        />
                                    </button>
                                    <button
                                        className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                                        <Image
                                            src={"/images/material-symbols_mail-outline.svg"}
                                            alt="material-symbols_mail-outline"
                                            width={24}
                                            height={24}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="w-full flex justify-center mt-8">
                                <div className="w-1/2">
                                    <VehicleGallery
                                        mainImage="/images/main-vehicle.png"
                                        images={[
                                            "/images/vehicle1.png",
                                            "/images/vehicle2.png",
                                            "/images/vehicle3.png",
                                            "/images/vehicle4.png",
                                        ]}
                                    />
                                </div>
                                <div className="w-1/2 px-10 flex flex-col">
                                    <span className="text-[20px] font-semibold tracking-wide">
                                        Vehicle Details
                                    </span>
                                    <div className="text-[23px] mb-3 font-semibold tracking-wide text-[#DB2727] mt-5">
                                        Rs. 20,000,000 - 22,000,000
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {/*{vehicle ? (*/}
                                        {
                                            [
                                                { label: "Millage:", value: `N/A km` },
                                                { label: "No. of Owners:", value: '0' },
                                                { label: "Vehicle No:", value: 'Brand New' },
                                                { label: "Color:", value: 'Arctic White' },
                                                { label: "Capacity:", value: `2000cc` },
                                                { label: "Model:", value: '2025 BYD SEALION 6 E-Hybrid' },
                                                { label: "Type:", value: 'Sport Touring Hybrid' },
                                                { label: "Year:", value: '2025' },
                                            ].map((detail, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-full flex text-lg font-medium tracking-wide"
                                                >
                                                    <div className="w-2/6">{detail.label}</div>
                                                    <div className="w-4/6 text-[#575757]">{detail.value}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {showStockAvailability && showVehicleDetailsAndLoyaltyAndPromotions && (
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
                                                                width={36} className="h-5 w-5" />
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

                    {showStockAvailability && showVehicleDetailsAndLoyaltyAndPromotions && (
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

                    {showStockAvailability && showVehicleDetailsAndLoyaltyAndPromotions && (
                        <section className="w-full">
                            <LeasingCalculator onCalculationSuccess={handleCalculatorSuccess} vehiclePrice={1000000} />
                        </section>
                    )}


                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                            <div className="flex-1 space-y-6">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[22px] text-[#000000] mb-6">Assign to Sales</h2>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition disabled:bg-gray-400 cursor-pointer">
                                            {isPending ? "Submitting..." : "Send"}
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
                                        placeholder="Customer Name"
                                        type="text"
                                        register={register("customer_name")}
                                        error={errors.customer_name}
                                    />

                                    <FormField
                                        label="Contact Number"
                                        placeholder="077 1234567"
                                        type="text"
                                        register={register("contact_number")}
                                        error={errors.contact_number}
                                    />
                                </div>
                            </div>


                            <div className="flex-1 space-y-6 mt-10">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[19px] mb-6">Vehicle Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <FormField
                                        label="BYD Model"
                                        type="select"
                                        isIcon={true}
                                        options={vehicleModelOptions}
                                        register={register("vehicle_model")}
                                        error={errors.vehicle_model}
                                    />

                                    <FormField
                                        label="Manufacture Year"
                                        type="select"
                                        isIcon={true}
                                        options={manufactureYearOptions}
                                        register={register("manufacture_year")}
                                        error={errors.manufacture_year}
                                    />

                                    <FormField
                                        label="Color"
                                        type="select"
                                        options={colorOptions}
                                        register={register("color")}
                                        error={errors.color}
                                    />

                                    <FormField
                                        label="Type"
                                        type="select"
                                        options={typeOptions}
                                        register={register("type")}
                                        error={errors.type}
                                    />

                                    <FormField
                                        label="Down Payment"
                                        type="number"
                                        placeholder="Enter Down Payment"
                                        register={register("down_payment")}
                                        error={errors.down_payment}
                                    />

                                    <div className="flex flex-col space-y-2 font-medium text-gray-900">
                                        <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">
                                            Price Range
                                        </span>

                                        <div className="flex gap-4">
                                            {/* Price From */}
                                            <div className="relative w-1/2">
                                                <input
                                                    type="number"
                                                    placeholder="Price From"
                                                    value={priceFrom}
                                                    {...register("price_from", {
                                                        onChange: (e) =>
                                                            setPriceFrom(e.target.value === "" ? "" : Number(e.target.value)),
                                                    })}
                                                    className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                                                />
                                                {errors.price_from && <span
                                                    className="text-red-600 text-sm">{errors.price_from.message}</span>}
                                                <div
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleIncrement(setPriceFrom, priceFrom)}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                    >
                                                        <svg
                                                            width="10"
                                                            height="6"
                                                            viewBox="0 0 10 6"
                                                            fill="none"
                                                        >
                                                            <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDecrement(setPriceFrom, priceFrom)}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                    >
                                                        <svg
                                                            width="10"
                                                            height="6"
                                                            viewBox="0 0 10 6"
                                                            fill="none"
                                                        >
                                                            <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price To */}
                                            <div className="relative w-1/2">
                                                <input
                                                    type="number"
                                                    placeholder="Price To"
                                                    value={priceTo}
                                                    {...register("price_to", {
                                                        onChange: (e) =>
                                                            setPriceTo(e.target.value === "" ? "" : Number(e.target.value)),
                                                    })}
                                                    className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                                                />
                                                {errors.price_to && <span
                                                    className="text-red-600 text-sm">{errors.price_to.message}</span>}
                                                <div
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleIncrement(setPriceTo, priceTo)}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                    >
                                                        <svg
                                                            width="10"
                                                            height="6"
                                                            viewBox="0 0 10 6"
                                                            fill="none"
                                                        >
                                                            <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDecrement(setPriceTo, priceTo)}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                    >
                                                        <svg
                                                            width="10"
                                                            height="6"
                                                            viewBox="0 0 10 6"
                                                            fill="none"
                                                        >
                                                            <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <FormField
                                    label="Additional Note"
                                    type="textarea"
                                    placeholder="Enter Your Note"
                                    register={register("additional_note")}
                                    error={errors.additional_note}
                                />

                                <div className="my-8 flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-4 accent-[#DB2727] h-4 w-4 cursor-pointer"
                                        id="enable-leasing"
                                        {...register("enable_leasing")}
                                    />
                                    <label htmlFor="enable-leasing" className="text-[19px] font-semibold">
                                        Leasing Details
                                    </label>
                                    <br />
                                </div>

                                {isLeasingEnabled && (
                                    <div className="animate-fade-in transition-all duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <FormField
                                                label="Vehicle Price"
                                                type="number"
                                                placeholder="Vehicle Price"
                                                register={register("leasing_vehicle_price")}
                                                error={errors.leasing_vehicle_price}
                                            />
                                            <FormField
                                                label="Select Bank"
                                                type="select"
                                                isIcon={true}
                                                options={bankOptions} // Pass dynamic options
                                                register={register("leasing_bank")}
                                                error={errors.leasing_bank}
                                            />
                                            <FormField
                                                label="Time Period"
                                                type="select"
                                                isIcon={false}
                                                options={timePeriodOptions}
                                                register={register("leasing_time_period")}
                                                error={errors.leasing_time_period}
                                            />
                                            <FormField
                                                label="Promo Code"
                                                type="text"
                                                placeholder="Promo Code"
                                                register={register("leasing_promo_code")}
                                                error={errors.leasing_promo_code}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
                                            <FormField
                                                label="Interest Rate"
                                                type="number"
                                                placeholder="Interest Rate"
                                                register={register("leasing_interest_rate")}
                                                error={errors.leasing_interest_rate}
                                            />
                                            <FormField
                                                label="Monthly Installment"
                                                type="text"
                                                placeholder="Monthly Installment"
                                                register={register("leasing_monthly_installment")}
                                                error={errors.leasing_monthly_installment}
                                            />
                                            <FormField
                                                label="Total Amount"
                                                type="text"
                                                placeholder="Total Amount"
                                                register={register("leasing_total_amount")}
                                                error={errors.leasing_total_amount}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </section>

                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div
                            className="w-full">
                            <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Last BYD
                                Purchases</h2>

                            {/* Table Headers */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300 text-gray-500 font-medium text-lg">
                                            <th className="py-5 px-4 text-left">Manufacture Year</th>
                                            <th className="py-5 px-4 text-left">Model</th>
                                            <th className="py-5 px-4 text-left">Type</th>
                                            <th className="py-5 px-4 text-left">Color</th>
                                            <th className="py-5 px-4 text-left">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicleData.map((vehicle, index) => (
                                            <tr key={index} className="text-lg font-medium">
                                                <td className="py-4 px-4">{vehicle.year}</td>
                                                <td className="py-4 px-4">{vehicle.model}</td>
                                                <td className="py-4 px-4">{vehicle.type}</td>
                                                <td className="py-4 px-4">{vehicle.color}</td>
                                                <td className="py-4 px-4">{vehicle.price}</td>
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

                {isVehicleAvailabilityModalOpen && (
                    <Modal
                        title="Unavailable BYD Vehicle"
                        onClose={() => {
                            setIsVehicleAvailabilityModalOpen(false);
                            // setUnavailableSubmitSuccess(false);
                        }}
                        actionButton={{
                            label: "Submit",
                            onClick: handleSubmitUnavailable(onUnavailableSubmit),
                            // disabled: isUnavailablePending,
                        }}
                        isPriorityAvailable={false}
                    >
                        <form onSubmit={handleSubmitUnavailable(onUnavailableSubmit)}>
                            <div className="mb-8">
                                <div className="flex flex-col justify-center items-center">
                                    <Image src="/search.gif" alt="search" width={128} height={128}
                                        className="w-32 h-32" />
                                    <div className="text-center">
                                        <h2 className="font-semibold text-xl text-[#000000]">Oops! That Vehicle is Not Available</h2>
                                        <h3 className="text-[#575757] text-[15px] font-medium">Please add it to the
                                            unavailable vehicle list.</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


                                <FormField
                                    label="BYD Model"
                                    type="select"
                                    isIcon={true}
                                    options={vehicleModelOptions}
                                    register={registerUnavailable("model")}
                                    error={unavailableErrors.model}
                                />

                                <FormField
                                    label="Manufacture Year"
                                    type="select"
                                    isIcon={true}
                                    options={manufactureYearOptions}
                                    register={registerUnavailable("manufacture_year")}
                                    error={unavailableErrors.manufacture_year}
                                />

                                <FormField
                                    label="Color"
                                    type="select"
                                    options={colorOptions}
                                    register={registerUnavailable("color")}
                                    error={unavailableErrors.color}
                                />

                                <FormField
                                    label="Type"
                                    type="select"
                                    options={typeOptions}
                                    register={registerUnavailable("type")}
                                    error={unavailableErrors.type}
                                />

                                <FormField
                                    label="Down Payment"
                                    type="number"
                                    placeholder="Enter Down Payment"
                                    register={registerUnavailable("down_payment")}
                                    error={unavailableErrors.down_payment}
                                />

                                <div className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">
                                        Price Range
                                    </span>

                                    <div className="flex gap-4">
                                        {/* Price From */}
                                        <div className="relative w-1/2">
                                            <input
                                                type="number"
                                                placeholder="Price From"
                                                value={priceFrom}
                                                {...registerUnavailable("price_from", {
                                                    onChange: (e) =>
                                                        setPriceFrom(e.target.value === "" ? "" : Number(e.target.value)),
                                                })}
                                                className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                                            />
                                            {unavailableErrors.price_from && <span
                                                className="text-red-600 text-sm">{unavailableErrors.price_from.message}</span>}
                                            <div
                                                className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrement(setPriceFrom, priceFrom)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(setPriceFrom, priceFrom)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price To */}
                                        <div className="relative w-1/2">
                                            <input
                                                type="number"
                                                placeholder="Price To"
                                                value={priceTo}
                                                {...registerUnavailable("price_to", {
                                                    onChange: (e) =>
                                                        setPriceTo(e.target.value === "" ? "" : Number(e.target.value)),
                                                })}
                                                className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700 appearance-none"
                                            />
                                            {unavailableErrors.price_to && <span
                                                className="text-red-600 text-sm">{unavailableErrors.price_to.message}</span>}
                                            <div
                                                className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrement(setPriceTo, priceTo)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 6L5 0L10 6H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(setPriceTo, priceTo)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                >
                                                    <svg
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </>
    );
}



export default BydSales;
