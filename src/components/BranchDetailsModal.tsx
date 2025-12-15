/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {useState} from "react";
import {X, Plus, Save, User as UserIcon} from "lucide-react";
import {
    useBranchDetails,
    useAddServiceToBranch,
    useCreateServiceLine,
    useAllServices
} from "@/hooks/useServicePark"; // Assumes hooks
import {useToast} from "@/hooks/useToast";

interface Props {
    branchId: number;
    onClose: () => void;
}

export default function BranchDetailsModal({branchId, onClose}: Props) {
    const {data: branch, isLoading} = useBranchDetails(branchId);
    const {data: allServices = []} = useAllServices();
    const addServiceMutation = useAddServiceToBranch();
    const createLineMutation = useCreateServiceLine();
    const {showToast} = useToast();

    const [activeTab, setActiveTab] = useState<"SERVICES" | "LINES">("SERVICES");

    // Add Service Form
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [customPrice, setCustomPrice] = useState("");

    // Add Line Form
    const [lineName, setLineName] = useState("");
    const [lineType, setLineType] = useState("REPAIR");
    const [advisorId, setAdvisorId] = useState(""); // Would typically be a dropdown of Users

    const handleAddService = async () => {
        try {
            await addServiceMutation.mutateAsync({
                branchId,
                data: {service_id: Number(selectedServiceId), custom_price: Number(customPrice)}
            });
            showToast("Price updated successfully", "success");
            setSelectedServiceId("");
            setCustomPrice("");
        } catch (e) {
            showToast("Error updating price", "error");
        }
    };

    const handleCreateLine = async () => {
        try {
            await createLineMutation.mutateAsync({
                branchId,
                data: {name: lineName, type: lineType, advisor: Number(advisorId)}
            });
            showToast("Service line added", "success");
            setLineName("");
            setAdvisorId("");
        } catch (e) {
            showToast("Error adding line", "error");
        }
    };

    if (isLoading) return null; // Or a spinner overlay

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
                className="bg-[#F5F5F5] w-full max-w-4xl h-[80vh] rounded-[30px] shadow-2xl flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="bg-white px-8 py-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{branch?.name}</h2>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                            <span>{branch?.location_code}</span>
                            <span>•</span>
                            <span>{branch?.contact_number}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{branch?.address}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <X size={24}/>
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-8 pt-4 flex gap-6 border-b bg-white/50">
                    <button
                        onClick={() => setActiveTab("SERVICES")}
                        className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition ${activeTab === "SERVICES" ? "border-[#DB2727] text-[#DB2727]" : "border-transparent text-gray-400"}`}
                    >
                        Services & Pricing
                    </button>
                    <button
                        onClick={() => setActiveTab("LINES")}
                        className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition ${activeTab === "LINES" ? "border-[#DB2727] text-[#DB2727]" : "border-transparent text-gray-400"}`}
                    >
                        Service Lines & Advisors
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">

                    {activeTab === "SERVICES" && (
                        <div className="space-y-6">
                            {/* Add Service Section */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Manage Branch
                                    Pricing</h3>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 mb-1 block">Select Service</label>
                                        <select
                                            value={selectedServiceId}
                                            onChange={e => setSelectedServiceId(e.target.value)}
                                            className="w-full h-10 rounded-lg border px-3 text-sm bg-gray-50"
                                        >
                                            <option value="">-- Select Global Service --</option>
                                            {allServices.map((s: any) => (
                                                <option key={s.id} value={s.id}>{s.name} (Base: {s.base_price})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/4">
                                        <label className="text-xs text-gray-500 mb-1 block">Branch Price (LKR)</label>
                                        <input
                                            type="number"
                                            value={customPrice}
                                            onChange={e => setCustomPrice(e.target.value)}
                                            className="w-full h-10 rounded-lg border px-3 text-sm bg-gray-50"
                                            placeholder="e.g. 5000"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddService}
                                        disabled={!selectedServiceId || !customPrice}
                                        className="h-10 px-6 bg-[#DB2727] text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Update / Add
                                    </button>
                                </div>
                            </div>

                            {/* List of Branch Services */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Service Name</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3 text-right">Branch Price (LKR)</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {branch?.services?.length > 0 ? (
                                        branch.services.map((svc: any) => (
                                            <tr key={svc.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 font-medium">{svc.name}</td>
                                                <td className="px-6 py-3 text-xs">
                                                    <span
                                                        className="bg-blue-50 text-blue-600 px-2 py-1 rounded">{svc.type}</span>
                                                </td>
                                                <td className="px-6 py-3 text-right font-bold text-gray-800">
                                                    {parseFloat(svc.BranchService?.price || svc.price).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <span
                                                        className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">Active</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-400">No specific
                                                pricing configured yet.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "LINES" && (
                        <div className="space-y-6">
                            {/* Add Line Section */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Add New Booth / Bay</h3>
                                <div className="grid grid-cols-4 gap-4 items-end">
                                    <div className="col-span-1">
                                        <input
                                            value={lineName}
                                            onChange={e => setLineName(e.target.value)}
                                            className="w-full h-10 rounded-lg border px-3 text-sm bg-gray-50"
                                            placeholder="Name (e.g. Paint Booth A)"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <select
                                            value={lineType}
                                            onChange={e => setLineType(e.target.value)}
                                            className="w-full h-10 rounded-lg border px-3 text-sm bg-gray-50"
                                        >
                                            <option value="REPAIR">Repair Bay</option>
                                            <option value="PAINT">Paint Booth</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <input
                                            type="number"
                                            value={advisorId}
                                            onChange={e => setAdvisorId(e.target.value)}
                                            className="w-full h-10 rounded-lg border px-3 text-sm bg-gray-50"
                                            placeholder="Advisor User ID (e.g. 5)"
                                        />
                                    </div>
                                    <button
                                        onClick={handleCreateLine}
                                        className="h-10 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 col-span-1"
                                    >
                                        <Plus size={16} className="inline mr-1"/> Add Line
                                    </button>
                                </div>
                            </div>

                            {/* List Lines */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {branch?.serviceLines?.map((line: any) => (
                                    <div key={line.id}
                                         className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{line.name}</h4>
                                            <span
                                                className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{line.type}</span>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className="flex items-center gap-1 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                                <UserIcon size={12}/>
                                                {line.advisor ? line.advisor.full_name : `ID: ${line.advisor_id}`}
                                            </div>
                                            <div className="mt-1 text-xs text-green-600 font-medium">Available</div>
                                        </div>
                                    </div>
                                ))}
                                {(!branch?.serviceLines || branch.serviceLines.length === 0) && (
                                    <p className="col-span-2 text-center text-gray-400 py-4">No service lines
                                        configured.</p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}