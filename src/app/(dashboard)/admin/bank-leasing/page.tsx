/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, {useState} from "react";
import {useCurrentUser} from "@/utils/auth";
import {useToast} from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { useAllBanks, useCreateBank, useDeleteBank, useUpdateBank } from "@/hooks/useLeasing";
import {Plus, Trash2} from "lucide-react";

const STANDARD_MONTHS = [12, 24, 36, 48, 60];

export default function BankLeasing() {

    const user = useCurrentUser();

    const { data: banks = [], isLoading } = useAllBanks();
    const createBankMutation = useCreateBank();
    const updateBankMutation = useUpdateBank();
    const deleteBankMutation = useDeleteBank();


    const {toast, showToast, hideToast} = useToast();

    const [selectedBank, setSelectedBank] = useState<any | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [bankName, setBankName] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [selectedMonths, setSelectedMonths] = useState<number[]>([12, 24, 36, 48, 60]);
    const [isActive, setIsActive] = useState(true);

    const [customMonthInput, setCustomMonthInput] = useState("");

    const parseMonths = (data: any): number[] => {
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    const resetForm = () => {
        setBankName("");
        setInterestRate("");
        setSelectedMonths([12, 24, 36, 48, 60]);
        setIsActive(true);
        setSelectedBank(null);
        setCustomMonthInput("");
    };

    const toggleMonthSelection = (month: number) => {
        if (selectedMonths.includes(month)) {
            // Prevent removing the last month (optional validation)
            if (selectedMonths.length > 1) {
                setSelectedMonths(selectedMonths.filter(m => m !== month).sort((a, b) => a - b));
            } else {
                showToast("At least one month duration is required", "error");
            }
        } else {
            setSelectedMonths([...selectedMonths, month].sort((a, b) => a - b));
        }
    };

    const addCustomMonth = () => {
        const val = parseInt(customMonthInput);

        if (!val || isNaN(val) || val <= 0) {
            return; // Ignore invalid
        }

        if (selectedMonths.includes(val)) {
            showToast("This duration is already selected.", "error");
            setCustomMonthInput("");
            return;
        }

        // Add to selection and sort
        setSelectedMonths([...selectedMonths, val].sort((a, b) => a - b));
        setCustomMonthInput("");
    };

    const getDisplayMonths = () => {
        // Create a unique Set of standard months AND whatever is currently selected
        const uniqueMonths = new Set([...STANDARD_MONTHS, ...selectedMonths]);
        // Convert back to array and sort numerically
        return Array.from(uniqueMonths).sort((a, b) => a - b);
    };

    const handleCreate = async () => {
        if (!bankName || !interestRate) {
            showToast("Bank Name and Interest Rate are required", "error");
            return;
        }

        try {
            await createBankMutation.mutateAsync({
                bank_name: bankName,
                interest_rate: parseFloat(interestRate),
                available_months: selectedMonths,
                is_active: isActive
            });
            showToast("Bank added successfully!", "success");
            setIsAddModalOpen(false);
            resetForm();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to add bank";
            showToast(msg, "error");
        }
    };

    const handleUpdate = async () => {
        if (!selectedBank) return;

        try {
            await updateBankMutation.mutateAsync({
                id: selectedBank.id,
                data: {
                    bank_name: bankName,
                    interest_rate: parseFloat(interestRate),
                    available_months: selectedMonths,
                    is_active: isActive
                }
            });
            showToast("Bank updated successfully!", "success");
            setIsEditModalOpen(false);
            resetForm();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to update bank";
            showToast(msg, "error");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this bank?")) return;

        try {
            await deleteBankMutation.mutateAsync(id);
            showToast("Bank deleted successfully!", "success");
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to delete bank";
            showToast(msg, "error");
        }
    };

    const openEditModal = (bank: any) => {
        setSelectedBank(bank);
        setBankName(bank.bank_name);
        setInterestRate(bank.interest_rate.toString());
        setSelectedMonths(parseMonths(bank.available_months));
        setIsActive(bank.is_active);
        setCustomMonthInput("");
        setIsEditModalOpen(true);
    };


    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name={user?.full_name || "Sophie Eleanor"}
                    location={user?.branch || "Bambalapitiya"}
                    title="Leasing Configuration"
                />

                {/* User Management Section */}
                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Bank Details Management</span>
                        <div className="flex gap-5">
                            <button
                                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={() => {
                                    resetForm();
                                    setIsAddModalOpen(true);
                                }}
                            >
                                <Image
                                    src={"/images/sales/plus.svg"}
                                    width={24}
                                    height={24}
                                    alt="Add icon"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="w-full mt-5 ">
                        <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                            <div className="min-w-[1000px] ">
                                {/* Table header */}
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/5 px-3 py-2 text-center">Bank Name</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Interest Rate (%)</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Available Months</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Status</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Action</div>
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {isLoading ? (
                                        <div className="text-center py-5">Loading banks...</div>
                                    ) : banks.length === 0 ? (
                                        <div className="text-center py-5 text-gray-500">No banks configured yet.</div>
                                    ) : (
                                        banks.map((bank: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex text-lg mt-1 text-black hover:bg-gray-50 transition items-center cursor-pointer"
                                            >
                                                <div
                                                    className="w-1/5 px-3 py-2 font-medium text-center cursor-pointer"
                                                    onClick={() => openEditModal(bank)}
                                                >
                                                    {bank.bank_name}
                                                </div>

                                                <div
                                                    className="w-1/5 px-3 py-2 text-center cursor-pointer"
                                                    onClick={() => openEditModal(bank)}
                                                >
                                                    {bank.interest_rate}%
                                                </div>

                                                <div
                                                    className="w-1/5 px-3 py-2 justify-center flex gap-2 flex-wrap cursor-pointer"
                                                    onClick={() => openEditModal(bank)}
                                                >
                                                    {parseMonths(bank.available_months).map((m) => (
                                                        <span key={m} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">
                                                            {m}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="w-1/5 px-3 py-2 flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bank.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                        {bank.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </div>

                                                <div className="w-1/5 px-3 py-2 flex justify-center">
                                                    <button
                                                        onClick={() => handleDelete(bank.id)}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {isAddModalOpen && (
                <Modal
                    title="Add New Leasing Bank"
                    onClose={() => setIsAddModalOpen(false)}
                    actionButton={{
                        label: createBankMutation.isPending ? "Adding..." : "Add Bank",
                        onClick: handleCreate,
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div>
                            <label className="block mb-2 font-medium">Bank Name</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="e.g. Sampath Bank"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Interest Rate (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="e.g. 18.5"
                            />
                        </div>
                    </div>

                    <div className="w-full mt-6">
                        <label className="block mb-3 font-medium">Available Lease Durations (Months)</label>

                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Render Buttons (Combined Standard + Custom) */}
                            {getDisplayMonths().map((month) => {
                                const isSelected = selectedMonths.includes(month);
                                return (
                                    <button
                                        key={month}
                                        type="button"
                                        onClick={() => toggleMonthSelection(month)}
                                        className={`px-5 py-2 rounded-full border text-sm font-medium transition shadow-sm
                                            ${isSelected
                                            ? "bg-[#DB2727] text-white border-[#DB2727]"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }
                                        `}
                                    >
                                        {month}
                                    </button>
                                )
                            })}

                            {/* Custom Month Input */}
                            <div className="flex items-center bg-white border border-black/50 rounded-full px-2 h-[40px] ml-2">
                                <input
                                    type="number"
                                    placeholder="Add..."
                                    value={customMonthInput}
                                    onChange={(e) => setCustomMonthInput(e.target.value)}
                                    className="w-[60px] bg-transparent outline-none text-sm px-2"
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomMonth()}
                                />
                                <button
                                    type="button"
                                    onClick={addCustomMonth}
                                    className="w-7 h-7 bg-[#DB2727] rounded-full flex items-center justify-center text-white hover:bg-red-700 transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 ml-1">Tip: Click a month to toggle selection. Use the input to add non-standard durations (e.g. 18).</p>
                    </div>

                    <div className="w-full mt-6 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-5 h-5 accent-[#DB2727]"
                        />
                        <label htmlFor="isActive" className="font-medium cursor-pointer">Bank is Active (Visible in Calculator)</label>
                    </div>
                </Modal>
            )}

            {isEditModalOpen && selectedBank && (
                <Modal
                    title="Edit Bank Details"
                    onClose={() => setIsEditModalOpen(false)}
                    actionButton={{
                        label: updateBankMutation.isPending ? "Updating..." : "Update",
                        onClick: handleUpdate,
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div>
                            <label className="block mb-2 font-medium">Bank Name</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Interest Rate (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                            />
                        </div>
                    </div>

                    <div className="w-full mt-6">
                        <label className="block mb-3 font-medium">Available Lease Durations (Months)</label>

                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Render Buttons (Combined Standard + Custom) */}
                            {getDisplayMonths().map((month) => {
                                const isSelected = selectedMonths.includes(month);
                                return (
                                    <button
                                        key={month}
                                        type="button"
                                        onClick={() => toggleMonthSelection(month)}
                                        className={`px-5 py-2 rounded-full border text-sm font-medium transition shadow-sm
                                            ${isSelected
                                            ? "bg-[#DB2727] text-white border-[#DB2727]"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }
                                        `}
                                    >
                                        {month}
                                    </button>
                                )
                            })}

                            {/* Custom Month Input */}
                            <div className="flex items-center bg-white border border-black/50 rounded-full px-2 h-[40px] ml-2">
                                <input
                                    type="number"
                                    placeholder="Add..."
                                    value={customMonthInput}
                                    onChange={(e) => setCustomMonthInput(e.target.value)}
                                    className="w-[60px] bg-transparent outline-none text-sm px-2"
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomMonth()}
                                />
                                <button
                                    type="button"
                                    onClick={addCustomMonth}
                                    className="w-7 h-7 bg-[#DB2727] rounded-full flex items-center justify-center text-white hover:bg-red-700 transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 ml-1">Tip: Click a month to toggle selection.</p>
                    </div>

                    <div className="w-full mt-6 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActiveEdit"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-5 h-5 accent-[#DB2727]"
                        />
                        <label htmlFor="isActiveEdit" className="font-medium cursor-pointer">Bank is Active (Visible in Calculator)</label>
                    </div>
                </Modal>
            )}
        </div>
    );
}
