// "use client";
// import React, {useState, useRef, useEffect, useMemo} from "react";
// import {ChevronDown} from "lucide-react";
// import {useActiveBanks} from "@/hooks/useLeasing";
//
// interface LeasingCalculatorProps {
//     vehiclePrice?: number;
// }
//
//
// export default function LeasingCalculator({vehiclePrice = 0}: LeasingCalculatorProps) {
//
//     const {data: banks = [], isLoading} = useActiveBanks();
//
//     console.log("--------bank details", banks);
//
//     // State
//     const [selectedBankName, setSelectedBankName] = useState<string>("Select Bank");
//     const [selectedMonth, setSelectedMonth] = useState<number>(24);
//     const [customRate, setCustomRate] = useState<string>("");
//     const [downPayment, setDownPayment] = useState<string>("");
//
//     const selectedBank = useMemo(() =>
//             banks.find((b) => b.bank_name === selectedBankName),
//         [banks, selectedBankName]);
//
//
//     const monthOptions = useMemo(() => {
//         if (!selectedBank) return [12, 24, 36, 48, 60];
//
//         let months = selectedBank.available_months;
//
//         // If API returns string "[12, 24]", parse it to array [12, 24]
//         if (typeof months === "string") {
//             try {
//                 months = JSON.parse(months);
//             } catch (error) {
//                 console.error("Error parsing months:", error);
//                 return [12, 24, 36, 48, 60]; // Fallback
//             }
//         }
//
//         // Ensure it is actually an array before returning
//         return Array.isArray(months) ? months : [12, 24, 36, 48, 60];
//     }, [selectedBank]);
//
//
//     // Results State
//     const [results, setResults] = useState({monthly: 0, total: 0});
//
//     // UI Dropdown States
//     const [isBankOpen, setIsBankOpen] = useState(false);
//     const [isMonthOpen, setIsMonthOpen] = useState(false);
//
//     const bankDropdownRef = useRef<HTMLDivElement>(null);
//     const monthDropdownRef = useRef<HTMLDivElement>(null);
//
//     useEffect(() => {
//         if (monthOptions.length > 0 && !monthOptions.includes(selectedMonth)) {
//             setSelectedMonth(monthOptions[0]);
//         }
//     }, [selectedBank, monthOptions, selectedMonth]);
//
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
//                 setIsBankOpen(false);
//             }
//             if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
//                 setIsMonthOpen(false);
//             }
//         }
//
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);
//
//     const formatCurrency = (amount: number) => {
//         return `LKR ${amount.toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
//     };
//
//     const getActiveRate = () => {
//         if (selectedBank) {
//             return Number(selectedBank.interest_rate);
//         }
//         return parseFloat(customRate) || 0;
//     };
//
//
//     const handleCalculate = () => {
//         const principal = Math.max(0, vehiclePrice - (parseFloat(downPayment) || 0));
//         const rate = getActiveRate();
//         const termMonth = selectedMonth;
//
//         if (principal <= 0) {
//             alert("Principal amount must be greater than 0. Check Vehicle Price and Down Payment.");
//             return;
//         }
//
//         const oneMonthInterest = rate / 100 / 12;
//
//         let monthlyInstallment = 0;
//         let totalAmount = 0;
//
//         if (rate === 0) {
//             monthlyInstallment = principal / termMonth;
//             totalAmount = principal;
//         } else {
//             const ratePower = Math.pow(1 + oneMonthInterest, termMonth);
//
//             const factor = (oneMonthInterest * ratePower) / (ratePower - 1);
//             monthlyInstallment = factor * principal;
//
//             totalAmount = monthlyInstallment * termMonth;
//         }
//
//         setResults({
//             monthly: monthlyInstallment,
//             total: totalAmount,
//         });
//     };
//
//     return (
//
//         <div
//             className="relative w-full bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-8 md:px-14 py-10 flex flex-col font-montserrat text-[#1D1D1D]">
//
//             {/* --- Header Section --- */}
//             <div className="flex flex-row md:items-center items-center mb-6 gap-4">
//                 <h2 className="text-[22px] font-semibold">Leasing Calculator</h2>
//
//                 <div className="flex items-center gap-6">
//                     {/* Bank Dropdown */}
//                     <div className="relative z-20" ref={bankDropdownRef}>
//                         <button
//                             onClick={() => setIsBankOpen(!isBankOpen)}
//                             className="flex items-center gap-2 font-medium text-[17px] text-[#1D1D1D] hover:text-gray-600 transition-colors"
//                         >
//                             {isLoading ? "Loading..." : selectedBankName}
//                             <ChevronDown
//                                 className={`w-5 h-5 text-[#575757] transition-transform ${isBankOpen ? 'rotate-180' : ''}`}/>
//                         </button>
//
//                         {isBankOpen && (
//                             <div
//                                 className="absolute top-full right-0 mt-2 w-[220px] flex flex-col bg-white backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2">
//                                 <button
//                                     onClick={() => {
//                                         setSelectedBankName("Select Bank");
//                                         setIsBankOpen(false);
//                                     }}
//                                     className="px-4 py-3 text-left text-[14px] hover:bg-gray-100 transition-colors text-gray-500 font-medium"
//                                 >
//                                     None (Custom Rate)
//                                 </button>
//                                 {banks.map((bank) => (
//                                     <button
//                                         key={bank.id}
//                                         onClick={() => {
//                                             setSelectedBankName(bank.bank_name);
//                                             setIsBankOpen(false);
//                                         }}
//                                         className="px-4 py-3 text-left text-[14px] hover:bg-gray-100 transition-colors border-t border-gray-100 text-[#1D1D1D]"
//                                     >
//                                         {bank.bank_name} <span
//                                         className="text-xs text-gray-400 ml-1">({bank.interest_rate}%)</span>
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Month Dropdown */}
//                     <div className="relative z-20" ref={monthDropdownRef}>
//                         <button
//                             onClick={() => setIsMonthOpen(!isMonthOpen)}
//                             className="flex items-center gap-2 min-w-[280px] font-medium text-[17px] text-[#1D1D1D] hover:text-gray-600 transition-colors"
//                         >
//                             {selectedMonth} months
//                             <ChevronDown
//                                 className={`w-5 h-5 text-[#575757] transition-transform ${isMonthOpen ? 'rotate-180' : ''}`}/>
//                         </button>
//
//                         {isMonthOpen && (
//                             <div
//                                 className="absolute top-full right-0 mt-2 min-w-[280px] flex flex-col bg-white backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2">
//                                 {monthOptions.map((month) => (
//                                     <button
//                                         key={month}
//                                         onClick={() => {
//                                             setSelectedMonth(month);
//                                             setIsMonthOpen(false);
//                                         }}
//                                         className="px-4 py-3 text-left text-[14px] hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 text-[#1D1D1D]"
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
//             {/* --- Calculator Card (Table) --- */}
//             <div
//                 className="w-full bg-white/40 backdrop-blur-[25px] rounded-[30px] p-6 md:p-8 shadow-inner border border-white/50">
//                 <table className="w-full border-collapse">
//                     <thead>
//                     <tr className="border-b-[1.5px] border-[#CCCCCC]">
//                         <th className="text-left pb-4 text-[18px] font-medium text-[#575757] w-1/2">Payment Details</th>
//                         <th className="text-center pb-4 text-[18px] font-medium text-[#575757] w-1/2">Amount</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {/* Down Payment Row */}
//                     <tr className="group">
//                         <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">Down Payment</td>
//                         <td className="py-5 text-center">
//                             <div className="flex justify-center">
//                                 <input
//                                     type="number"
//                                     value={downPayment}
//                                     onChange={(e) => setDownPayment(e.target.value)}
//                                     placeholder="Enter Down Payment"
//                                     className="w-[220px] h-[60px] px-4 py-2 bg-white rounded-[45px] text-[16px] font-medium text-[#1D1D1D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#DB2727] text-center shadow-sm"
//                                 />
//                             </div>
//                         </td>
//                     </tr>
//
//                     {/* Interest Rate Row */}
//                     <tr>
//                         <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">
//                             Interest Rate {selectedBank &&
//                             <span className="text-sm font-normal text-[#DB2727] ml-2">({selectedBank.bank_name})</span>}
//                         </td>
//                         <td className="py-5 text-center">
//                             <div className="flex justify-center items-center h-[46px]">
//                                 {selectedBank ? (
//                                     <div
//                                         className="w-[220px] px-4 py-2 bg-[#E6E6E6] rounded-[18px] text-[18px] font-semibold text-[#575757] text-right shadow-inner flex items-center justify-end">
//                                         {selectedBank.interest_rate}%
//                                     </div>
//                                 ) : (
//                                     <div className="relative w-[220px]">
//                                         <input
//                                             type="number"
//                                             value={customRate}
//                                             onChange={(e) => setCustomRate(e.target.value)}
//                                             placeholder="Enter Custom Rate"
//                                             className="w-full h-[46px] px-4 py-2 bg-white rounded-[45px] text-[16px] font-medium text-[#1D1D1D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#DB2727] text-center shadow-sm pr-8"
//                                         />
//                                         {/*<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>*/}
//                                     </div>
//                                 )}
//                             </div>
//                         </td>
//                     </tr>
//
//                     {/* Monthly Installment Row */}
//                     <tr className="border-b-[1.5px] border-[#575757]">
//                         <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">Monthly Installment</td>
//                         <td className="py-5 text-[18px] font-medium text-[#1D1D1D] text-center">
//                             {formatCurrency(results.monthly)}
//                         </td>
//                     </tr>
//
//                     {/* Total Payable Row */}
//                     <tr className="border-b-[1.5px] border-t-[1.5px] border-[#575757]">
//                         <td className="py-5 text-[18px] font-bold text-[#1D1D1D]">Total Payable Amount</td>
//                         <td className="py-5 text-[18px] font-bold text-[#1D1D1D] text-center">
//                             {formatCurrency(results.total)}
//                         </td>
//                     </tr>
//                     </tbody>
//                 </table>
//
//                 {/* --- Footer / Button --- */}
//                 <div className="mt-6 flex justify-end">
//                     <button
//                         onClick={handleCalculate}
//                         className="bg-[#DB2727] hover:bg-[#b91c1c] text-white text-[16px] font-semibold py-3 px-8 rounded-full transition-all shadow-md active:scale-95"
//                     >
//                         Calculate
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useActiveBanks } from "@/hooks/useLeasing";
import { calculateLeasingDetails } from "@/utils/leasing";

interface LeasingCalculatorProps {
    vehiclePrice?: number;
    onCalculationSuccess?: (data: {
        bankName: string;
        interestRate: number;
        months: number;
        downPayment: number;
        monthlyInstallment: number;
        totalAmount: number;
    }) => void;
}


export default function LeasingCalculator({ vehiclePrice = 0, onCalculationSuccess }: LeasingCalculatorProps) {

    const { data: banks = [], isLoading } = useActiveBanks();

    console.log("--------bank details", banks);

    // State
    const [selectedBankName, setSelectedBankName] = useState<string>("Select Bank");
    const [selectedMonth, setSelectedMonth] = useState<number>(24);
    const [customRate, setCustomRate] = useState<string>("");
    const [downPayment, setDownPayment] = useState<string>("");
    const [priceInput, setPriceInput] = useState<string>(vehiclePrice ? vehiclePrice.toString() : "");
    const [promoCode, setPromoCode] = useState<string>("");

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
    const [results, setResults] = useState({ monthly: 0, total: 0 });

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
        setPriceInput(vehiclePrice ? vehiclePrice.toString() : "");
    }, [vehiclePrice]);

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

    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getActiveRate = () => {
        if (selectedBank) {
            return Number(selectedBank.interest_rate);
        }
        return parseFloat(customRate) || 0;
    };


    const handleCalculate = () => {
        const vPrice = parseFloat(priceInput) || 0;
        const dpValue = parseFloat(downPayment) || 0;
        const rateValue = getActiveRate();

        const { monthly, total } = calculateLeasingDetails(vPrice, dpValue, rateValue, selectedMonth);

        setResults({ monthly, total });

        if (onCalculationSuccess) {
            onCalculationSuccess({
                bankName: selectedBankName === "Select Bank" ? "" : selectedBankName,
                interestRate: rateValue,
                months: selectedMonth,
                downPayment: dpValue,
                monthlyInstallment: monthly,
                totalAmount: total
            });
        }
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
                                className={`w-5 h-5 text-[#575757] transition-transform ${isBankOpen ? 'rotate-180' : ''}`} />
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
                                className={`w-5 h-5 text-[#575757] transition-transform ${isMonthOpen ? 'rotate-180' : ''}`} />
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
                        {/* Vehicle Price Row */}
                        <tr className="group">
                            <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">Vehicle Price</td>
                            <td className="py-5 text-center">
                                <div className="flex justify-center">
                                    <input
                                        type="number"
                                        value={priceInput}
                                        onChange={(e) => setPriceInput(e.target.value)}
                                        placeholder="Enter Vehicle Price"
                                        className="w-[220px] h-[60px] px-4 py-2 bg-white rounded-[45px] text-[16px] font-medium text-[#1D1D1D] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#DB2727] text-center shadow-sm"
                                    />
                                </div>
                            </td>
                        </tr>

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

                        {/* Promo Code Row */}
                        <tr className="group">
                            <td className="py-5 text-[18px] font-medium text-[#1D1D1D]">Promo Code</td>
                            <td className="py-5 text-center">
                                <div className="flex justify-center">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter Promo Code"
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
                        type="button"
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