// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { ChevronDown } from "lucide-react";
//
// interface LeasingCalculatorProps {
//     vehiclePrice?: number; // The base price of the vehicle
// }
//
// // Sample rates for the predefined banks
// const BANK_RATES: Record<string, number> = {
//     "Sampath Bank": 13.5,
//     "Commercial Bank": 12.0,
//     "People's Bank": 11.5,
// };
//
// export default function LeasingCalculator({ vehiclePrice = 5000000 }: LeasingCalculatorProps) {
//     // Form States
//     const [selectedBank, setSelectedBank] = useState<string>("Select Bank");
//     const [selectedMonth, setSelectedMonth] = useState<number>(24);
//     const [customInterestRate, setCustomInterestRate] = useState<string>("");
//     const [downPayment, setDownPayment] = useState<string>("");
//
//     // Results States
//     const [calculatedResults, setCalculatedResults] = useState({ monthly: 0, total: 0 });
//
//     // UI States for dropdowns
//     const [isBankOpen, setIsBankOpen] = useState(false);
//     const [isMonthOpen, setIsMonthOpen] = useState(false);
//
//     const bankOptions = ["Sampath Bank", "Commercial Bank", "People's Bank"];
//     const monthOptions = [12, 24, 36, 48, 60];
//
//     const bankDropdownRef = useRef<HTMLDivElement>(null);
//     const monthDropdownRef = useRef<HTMLDivElement>(null);
//
//     const isBankSelected = selectedBank !== "Select Bank" && BANK_RATES[selectedBank] !== undefined;
//     const activeInterestRate = isBankSelected ? BANK_RATES[selectedBank] : parseFloat(customInterestRate);
//
//     // Close dropdowns when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
//                 setIsBankOpen(false);
//             }
//             if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
//                 setIsMonthOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);
//
//
//     const handleCalculate = () => {
//         const dp = parseFloat(downPayment) || 0;
//         const rate = activeInterestRate;
//
//         // Basic validation
//         if (!rate || isNaN(rate) || dp >= vehiclePrice) {
//             setCalculatedResults({ monthly: 0, total: 0 });
//             return;
//         }
//
//         // Flat Rate Calculation Logic
//         const principal = vehiclePrice - dp;
//         const years = selectedMonth / 12;
//         const totalInterest = principal * (rate / 100) * years;
//         const totalPayable = principal + totalInterest;
//         const monthlyInstallment = totalPayable / selectedMonth;
//
//         setCalculatedResults({
//             monthly: Math.round(monthlyInstallment),
//             total: Math.round(totalPayable),
//         });
//     };
//
//     const formatCurrency = (amount: number) => {
//         return `LKR ${amount.toLocaleString()}`;
//     };
//
//     return (
//         // Outer container matching the greyish glass look of the image
//         <div className="relative w-full bg-white/30 backdrop-blur-xl rounded-[45px] p-8 md:p-12 flex flex-col font-montserrat text-[#1D1D1D] border border-white/20 shadow-xl">
//             {/* Header Section */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pl-2">
//                 <h2 className="text-[22px] font-extrabold tracking-tight">Leasing Calculator</h2>
//
//                 {/* Filters Wrapper */}
//                 <div className="flex items-center gap-6">
//                     {/* Custom Bank Dropdown */}
//                     <div className="relative z-20" ref={bankDropdownRef}>
//                         <button
//                             onClick={() => setIsBankOpen(!isBankOpen)}
//                             className="flex items-center gap-2 font-semibold text-[16px] hover:text-gray-600 transition-colors"
//                         >
//                             {selectedBank}
//                             <ChevronDown className={`w-4 h-4 text-[#1D1D1D] transition-transform ${isBankOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
//                         </button>
//
//                         {isBankOpen && (
//                             <div className="absolute top-full right-0 mt-2 w-[180px] flex flex-col bg-white/70 backdrop-blur-[30px] border border-white/40 shadow-lg rounded-2xl overflow-hidden p-1">
//                                 <button
//                                     onClick={() => {
//                                         setSelectedBank("Select Bank");
//                                         setIsBankOpen(false);
//                                     }}
//                                     className="px-4 py-2 text-left text-[14px] font-medium hover:bg-white/50 rounded-xl transition-colors text-gray-500"
//                                 >
//                                     None (Custom Rate)
//                                 </button>
//                                 {bankOptions.map((bank) => (
//                                     <button
//                                         key={bank}
//                                         onClick={() => {
//                                             setSelectedBank(bank);
//                                             setIsBankOpen(false);
//                                             // Clear custom rate if a bank is selected to avoid confusion
//                                             setCustomInterestRate("");
//                                         }}
//                                         className="px-4 py-2 text-left text-[14px] font-medium hover:bg-white/50 rounded-xl transition-colors text-[#1D1D1D]"
//                                     >
//                                         {bank}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Custom Months Dropdown */}
//                     <div className="relative z-20" ref={monthDropdownRef}>
//                         <button
//                             onClick={() => setIsMonthOpen(!isMonthOpen)}
//                             className="flex items-center gap-2 font-semibold text-[16px] hover:text-gray-600 transition-colors"
//                         >
//                             {selectedMonth} months
//                             <ChevronDown className={`w-4 h-4 text-[#1D1D1D] transition-transform ${isMonthOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
//                         </button>
//
//                         {isMonthOpen && (
//                             <div className="absolute top-full right-0 mt-2 w-[140px] flex flex-col bg-white/70 backdrop-blur-[30px] border border-white/40 shadow-lg rounded-2xl overflow-hidden p-1">
//                                 {monthOptions.map((month) => (
//                                     <button
//                                         key={month}
//                                         onClick={() => {
//                                             setSelectedMonth(month);
//                                             setIsMonthOpen(false);
//                                         }}
//                                         className="px-4 py-2 text-left text-[14px] font-medium hover:bg-white/50 rounded-xl transition-colors text-[#1D1D1D]"
//                                     >
//                                         {month} Months
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//
//             {/* Calculator Body - Inner brighter glass container */}
//             <div className="w-full bg-white/40 backdrop-blur-md rounded-[35px] py-2 px-6 shadow-sm border border-white/30">
//                 <div className="flex flex-col">
//
//                     {/* Row 1: Headers */}
//                     <div className="flex justify-between items-center py-5 border-b border-[#a3a3a3]/30">
//                         <span className="text-[18px] font-medium text-[#575757]">Payment Details</span>
//                         <span className="text-[18px] font-medium text-[#575757] w-1/3 text-right pr-2">Amount</span>
//                     </div>
//
//                     {/* Row: Vehicle Price (Reference) */}
//                     <div className="flex justify-between items-center py-5">
//                         <span className="text-[18px] font-medium text-[#1D1D1D]">Vehicle Price</span>
//                         <span className="text-[18px] font-semibold text-[#1D1D1D] w-1/3 text-right pr-4">
//                              {formatCurrency(vehiclePrice)}
//                         </span>
//                     </div>
//
//
//                     {/* Row 2: Down Payment Input */}
//                     <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
//                         <label htmlFor="downPaymentInput" className="text-[18px] font-medium text-[#1D1D1D] flex-1">Down Payment (LKR)</label>
//                         <div className="w-full md:w-1/3">
//                             <input
//                                 id="downPaymentInput"
//                                 type="number"
//                                 value={downPayment}
//                                 onChange={(e) => setDownPayment(e.target.value)}
//                                 placeholder="Enter Down Payment"
//                                 className="w-full h-[50px] px-6 bg-white rounded-[25px] text-[18px] font-medium text-[#1D1D1D] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#DB2727] text-right shadow-sm"
//                             />
//                         </div>
//                     </div>
//
//                     {/* Row 3: Interest Rate (Conditional Input vs Display) */}
//                     <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
//                         <label htmlFor="interestRateInput" className="text-[18px] font-medium text-[#1D1D1D] flex-1">
//                             {isBankSelected ? `${selectedBank} Rate (%)` : "Custom Interest Rate (%)"}
//                         </label>
//                         <div className="w-full md:w-1/3 flex justify-end">
//                             {isBankSelected ? (
//                                 // Read-only display if bank selected
//                                 <div className="h-[50px] px-6 flex items-center justify-end text-[20px] font-bold text-[#1D1D1D] pr-4">
//                                     {activeInterestRate.toFixed(1)}%
//                                 </div>
//                             ) : (
//                                 // Input field if no bank selected
//                                 <input
//                                     id="interestRateInput"
//                                     type="number"
//                                     value={customInterestRate}
//                                     onChange={(e) => setCustomInterestRate(e.target.value)}
//                                     placeholder="Enter Custom Rate"
//                                     className="w-full h-[50px] px-6 bg-white rounded-[25px] text-[18px] font-medium text-[#1D1D1D] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#DB2727] text-right shadow-sm"
//                                 />
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Calculate Button */}
//                     <div className="flex justify-end py-6 border-b border-[#a3a3a3]/30">
//                         <button
//                             onClick={handleCalculate}
//                             className="bg-[#DB2727] hover:bg-red-700 text-white text-[18px] font-semibold px-12 py-3 rounded-full transition-all shadow-md active:scale-95"
//                         >
//                             Calculate
//                         </button>
//                     </div>
//
//                     {/* Row 4: Monthly Installment Result */}
//                     <div className="flex justify-between items-center py-5 border-b border-[#a3a3a3]/30">
//                         <span className="text-[18px] font-medium text-[#1D1D1D]">Monthly Installment</span>
//                         <span className="text-[18px] font-semibold text-[#1D1D1D] w-1/3 text-right pr-4">
//                             {formatCurrency(calculatedResults.monthly)}
//                         </span>
//                     </div>
//
//                     {/* Row 5: Total Payable Result */}
//                     <div className="flex justify-between items-center pt-5 pb-2">
//                         <span className="text-[20px] font-extrabold text-[#1D1D1D]">Total Payable Amount</span>
//                         <span className="text-[20px] font-extrabold text-[#1D1D1D] w-1/3 text-right pr-4">
//                             {formatCurrency(calculatedResults.total)}
//                         </span>
//                     </div>
//
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";
import React, {useState, useRef, useEffect, useMemo} from "react";
import {ChevronDown} from "lucide-react";
import {useActiveBanks} from "@/hooks/useLeasing";

interface LeasingCalculatorProps {
    vehiclePrice?: number;
}


export default function LeasingCalculator({vehiclePrice = 0}: LeasingCalculatorProps) {

    const {data: banks = [], isLoading} = useActiveBanks();

    console.log("--------bank details", banks);

    // State
    const [selectedBankName, setSelectedBankName] = useState<string>("Select Bank");
    const [selectedMonth, setSelectedMonth] = useState<number>(24);
    const [customRate, setCustomRate] = useState<string>("");
    const [downPayment, setDownPayment] = useState<string>("");

    const selectedBank = useMemo(() =>
            banks.find((b) => b.bank_name === selectedBankName),
        [banks, selectedBankName]);


    const monthOptions = useMemo(() => {
        if (!selectedBank) return [12, 24, 36, 48, 60];

        let months = selectedBank.available_months;

        // If API returns string "[12, 24]", parse it to array [12, 24]
        if (typeof months === "string") {
            try {
                months = JSON.parse(months);
            } catch (error) {
                console.error("Error parsing months:", error);
                return [12, 24, 36, 48, 60]; // Fallback
            }
        }

        // Ensure it is actually an array before returning
        return Array.isArray(months) ? months : [12, 24, 36, 48, 60];
    }, [selectedBank]);


    // Results State
    const [results, setResults] = useState({monthly: 0, total: 0});

    // UI Dropdown States
    const [isBankOpen, setIsBankOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);

    const bankDropdownRef = useRef<HTMLDivElement>(null);
    const monthDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (monthOptions.length > 0 && !monthOptions.includes(selectedMonth)) {
            setSelectedMonth(monthOptions[0]);
        }
    }, [selectedBank, monthOptions, selectedMonth]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
                setIsBankOpen(false);
            }
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
                setIsMonthOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper: Format Currency
    // const formatCurrency = (amount: number) => {
    //     return `LKR ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    // };

    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    };

    const getActiveRate = () => {
        if (selectedBank) {
            return Number(selectedBank.interest_rate);
        }
        return parseFloat(customRate) || 0;
    };


    // const handleCalculate = () => {
    //     const principal = Math.max(0, vehiclePrice - (parseFloat(downPayment) || 0));
    //     const rate = getActiveRate();
    //     const months = selectedMonth;
    //
    //     if (principal === 0) {
    //         alert("Please ensure the Vehicle Price is set and Down Payment is valid.");
    //         return;
    //     }
    //
    //     const years = months / 12;
    //     const totalInterest = principal * (rate / 100) * years;
    //     const totalPayable = principal + totalInterest;
    //     const monthlyInstallment = totalPayable / months;
    //
    //     setResults({
    //         monthly: Math.round(monthlyInstallment),
    //         total: Math.round(totalPayable),
    //     });
    // };

    const handleCalculate = () => {
        const principal = Math.max(0, vehiclePrice - (parseFloat(downPayment) || 0));
        const rate = getActiveRate();
        const termMonth = selectedMonth;

        if (principal <= 0) {
            alert("Principal amount must be greater than 0. Check Vehicle Price and Down Payment.");
            return;
        }

        const oneMonthInterest = rate / 100 / 12;

        let monthlyInstallment = 0;
        let totalAmount = 0;

        if (rate === 0) {
            monthlyInstallment = principal / termMonth;
            totalAmount = principal;
        } else {
            const ratePower = Math.pow(1 + oneMonthInterest, termMonth);

            const factor = (oneMonthInterest * ratePower) / (ratePower - 1);
            monthlyInstallment = factor * principal;

            totalAmount = monthlyInstallment * termMonth;
        }

        setResults({
            monthly: monthlyInstallment,
            total: totalAmount,
        });
    };

    return (

        <div
            className="relative w-full bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-8 md:px-14 py-10 flex flex-col font-montserrat text-[#1D1D1D]">

            {/* --- Header Section --- */}
            <div className="flex flex-row md:items-center items-center mb-6 gap-4">
                <h2 className="text-[22px] font-semibold">Leasing Calculator</h2>

                <div className="flex items-center gap-6">
                    {/* Bank Dropdown */}
                    <div className="relative z-20" ref={bankDropdownRef}>
                        <button
                            onClick={() => setIsBankOpen(!isBankOpen)}
                            className="flex items-center gap-2 font-medium text-[17px] text-[#1D1D1D] hover:text-gray-600 transition-colors"
                        >
                            {isLoading ? "Loading..." : selectedBankName}
                            <ChevronDown
                                className={`w-5 h-5 text-[#575757] transition-transform ${isBankOpen ? 'rotate-180' : ''}`}/>
                        </button>

                        {isBankOpen && (
                            <div
                                className="absolute top-full right-0 mt-2 w-[220px] flex flex-col bg-white backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2">
                                <button
                                    onClick={() => {
                                        setSelectedBankName("Select Bank");
                                        setIsBankOpen(false);
                                    }}
                                    className="px-4 py-3 text-left text-[14px] hover:bg-gray-100 transition-colors text-gray-500 font-medium"
                                >
                                    None (Custom Rate)
                                </button>
                                {banks.map((bank) => (
                                    <button
                                        key={bank.id}
                                        onClick={() => {
                                            setSelectedBankName(bank.bank_name);
                                            setIsBankOpen(false);
                                        }}
                                        className="px-4 py-3 text-left text-[14px] hover:bg-gray-100 transition-colors border-t border-gray-100 text-[#1D1D1D]"
                                    >
                                        {bank.bank_name} <span
                                        className="text-xs text-gray-400 ml-1">({bank.interest_rate}%)</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Month Dropdown */}
                    <div className="relative z-20" ref={monthDropdownRef}>
                        <button
                            onClick={() => setIsMonthOpen(!isMonthOpen)}
                            className="flex items-center gap-2 min-w-[280px] font-medium text-[17px] text-[#1D1D1D] hover:text-gray-600 transition-colors"
                        >
                            {selectedMonth} months
                            <ChevronDown
                                className={`w-5 h-5 text-[#575757] transition-transform ${isMonthOpen ? 'rotate-180' : ''}`}/>
                        </button>

                        {isMonthOpen && (
                            <div
                                className="absolute top-full right-0 mt-2 min-w-[280px] flex flex-col bg-white backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2">
                                {monthOptions.map((month) => (
                                    <button
                                        key={month}
                                        onClick={() => {
                                            setSelectedMonth(month);
                                            setIsMonthOpen(false);
                                        }}
                                        className="px-4 py-3 text-left text-[14px] hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 text-[#1D1D1D]"
                                    >
                                        {month} Months
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Calculator Card (Table) --- */}
            <div
                className="w-full bg-white/40 backdrop-blur-[25px] rounded-[30px] p-6 md:p-8 shadow-inner border border-white/50">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b-[1.5px] border-[#CCCCCC]">
                        <th className="text-left pb-4 text-[18px] font-medium text-[#575757] w-1/2">Payment Details</th>
                        <th className="text-center pb-4 text-[18px] font-medium text-[#575757] w-1/2">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Down Payment Row */}
                    <tr className="group">
                        <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">Down Payment</td>
                        <td className="py-5 text-center">
                            <div className="flex justify-center">
                                <input
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value)}
                                    placeholder="Enter Down Payment"
                                    className="w-[220px] h-[60px] px-4 py-2 bg-white rounded-[45px] text-[16px] font-medium text-[#1D1D1D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#DB2727] text-center shadow-sm"
                                />
                            </div>
                        </td>
                    </tr>

                    {/* Interest Rate Row */}
                    <tr>
                        <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">
                            Interest Rate {selectedBank &&
                            <span className="text-sm font-normal text-[#DB2727] ml-2">({selectedBank.bank_name})</span>}
                        </td>
                        <td className="py-5 text-center">
                            <div className="flex justify-center items-center h-[46px]">
                                {selectedBank ? (
                                    <div
                                        className="w-[220px] px-4 py-2 bg-[#E6E6E6] rounded-[18px] text-[18px] font-semibold text-[#575757] text-right shadow-inner flex items-center justify-end">
                                        {selectedBank.interest_rate}%
                                    </div>
                                ) : (
                                    <div className="relative w-[220px]">
                                        <input
                                            type="number"
                                            value={customRate}
                                            onChange={(e) => setCustomRate(e.target.value)}
                                            placeholder="Enter Custom Rate"
                                            className="w-full h-[46px] px-4 py-2 bg-white rounded-[45px] text-[16px] font-medium text-[#1D1D1D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#DB2727] text-center shadow-sm pr-8"
                                        />
                                        {/*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>*/}
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>

                    {/* Monthly Installment Row */}
                    <tr className="border-b-[1.5px] border-[#575757]">
                        <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">Monthly Installment</td>
                        <td className="py-5 text-[18px] font-medium text-[#1D1D1D] text-center">
                            {formatCurrency(results.monthly)}
                        </td>
                    </tr>

                    {/* Total Payable Row */}
                    <tr className="border-b-[1.5px] border-t-[1.5px] border-[#575757]">
                        <td className="py-5 text-[18px] font-bold text-[#1D1D1D]">Total Payable Amount</td>
                        <td className="py-5 text-[18px] font-bold text-[#1D1D1D] text-center">
                            {formatCurrency(results.total)}
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* --- Footer / Button --- */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleCalculate}
                        className="bg-[#DB2727] hover:bg-[#b91c1c] text-white text-[16px] font-semibold py-3 px-8 rounded-full transition-all shadow-md active:scale-95"
                    >
                        Calculate
                    </button>
                </div>
            </div>
        </div>
    );
}