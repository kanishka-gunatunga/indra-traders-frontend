"use client";

import React, {useState, useMemo, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    CheckSquare,
    Square, Loader2,
} from "lucide-react";
import {useToast} from "@/hooks/useToast";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal"; // Importing the Modal component
import {useAllServices, useCreateBranch} from "@/hooks/useServicePark";

import {Calendar, Modal as AntModal, ConfigProvider, Badge} from 'antd';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';


// --- Types ---

type BranchForm = {
    name: string;
    email: string;
    contact_number: string;
    address: string;
    location_code: string;
};

type UnavailableDate = {
    id: string;
    date: string;
    reason: string;
};

type ServiceLineTemp = {
    id: string;
    name: string;
    advisor: string;
    type: "REPAIR" | "PAINT" | "WASH";
};

type ServiceSelection = {
    isSelected: boolean;
    customPrice: number;
};

type BranchFormProps = {
    initialData?: any; // The branch object from API
    isEditMode?: boolean;
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
};


// --- Reusable Glass Input (Matches your requested style) ---
const GlassInput = ({
                        label,
                        value,
                        onChange,
                        placeholder,
                        type = "text",
                        error,
                        required = false
                    }: {
    label?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    error?: string;
    required?: boolean;
}) => (
    <div className="w-full">
        {label && (
            <label className="block mb-2 font-medium text-gray-800 ml-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        <input
            type={type}
            value={value}
            onChange={onChange}
            className={`w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border ${
                error ? "border-red-500" : "border-black/50"
            } backdrop-blur-[50px] px-6 outline-none focus:border-[#DB2727] focus:bg-white/90 transition-all text-gray-800 placeholder:text-gray-500`}
            placeholder={placeholder}
        />
        {error && <p className="text-red-500 text-xs mt-1 ml-4">{error}</p>}
    </div>
);

export default function BranchForm({initialData, isEditMode = false, onSubmit, isSubmitting}: BranchFormProps) {
    const router = useRouter();

    const {toast, showToast, hideToast} = useToast();

    // --- API Hooks ---
    const {data: services = [], isLoading: loadingServices} = useAllServices();
    const createBranchMutation = useCreateBranch();

    // --- State ---
    const [form, setForm] = useState<BranchForm>({
        name: "",
        email: "",
        contact_number: "",
        address: "",
        location_code: ""
    });
    const [errors, setErrors] = useState<Partial<BranchForm>>({});

    // Services
    const [serviceSelections, setServiceSelections] = useState<Record<number, ServiceSelection>>({});

    // Unavailable Dates
    const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);
    const [isDateModalVisible, setIsDateModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [dateReason, setDateReason] = useState("");
    const [editingDateId, setEditingDateId] = useState<string | null>(null);

    // Service Lines
    const [lines, setLines] = useState<ServiceLineTemp[]>([]);
    const [lineFilter, setLineFilter] = useState("ALL");

    // Modal State
    const [isLineModalOpen, setIsLineModalOpen] = useState(false);
    const [newLine, setNewLine] = useState<ServiceLineTemp>({
        id: "",
        name: "",
        advisor: "",
        type: "REPAIR"
    });


    useEffect(() => {
        if (isEditMode && initialData) {
            // 1. Fill Basic Info
            setForm({
                name: initialData.name || "",
                email: initialData.email || "",
                contact_number: initialData.contact_number || "",
                address: initialData.address || "",
                location_code: initialData.location_code || ""
            });

            // 2. Fill Services (Map API response to selection state)
            const selections: any = {};
            if (initialData.services) {
                initialData.services.forEach((svc: any) => {
                    // Check logic depending on how API returns the join table data (BranchService)
                    // Usually it's in svc.BranchService.price or similar
                    const price = svc.BranchService?.price || svc.base_price;
                    selections[svc.id] = {isSelected: true, customPrice: parseFloat(price)};
                });
            }
            setServiceSelections(selections);

            // 3. Fill Unavailable Dates
            // Assuming API returns array of objects { date: "2023-01-01", reason: "..." }
            if (initialData.unavailable_dates) {
                // If API returns just strings:
                // const dates = initialData.unavailable_dates.map((d: string, i: number) => ({ id: i.toString(), date: d, reason: "N/A" }));

                // If API returns objects (recommended for reason):
                const dates = initialData.BranchUnavailableDates?.map((d: any) => ({
                    id: d.id?.toString() || Math.random().toString(),
                    date: d.date,
                    reason: d.reason
                })) || [];
                setUnavailableDates(dates);
            }

            // 4. Fill Lines
            if (initialData.serviceLines) {
                const loadedLines = initialData.serviceLines.map((l: any) => ({
                    id: l.id?.toString() || Math.random().toString(),
                    name: l.name,
                    advisor: l.advisor?.toString(),
                    type: l.type
                }));
                setLines(loadedLines);
            }
        }
    }, [initialData, isEditMode]);


    // --- Handlers: Branch Info ---
    const handleInputChange = (field: keyof BranchForm, value: string) => {
        setForm((prev) => ({...prev, [field]: value}));
        if (errors[field]) setErrors((prev) => ({...prev, [field]: undefined}));
    };

    // --- Handlers: Services ---
    const toggleService = (serviceId: number, basePrice: number) => {
        setServiceSelections((prev) => {
            const current = prev[serviceId];
            if (current?.isSelected) {
                const copy = {...prev};
                delete copy[serviceId];
                return copy;
            } else {
                return {
                    ...prev,
                    [serviceId]: {isSelected: true, customPrice: basePrice}
                };
            }
        });
    };

    const updateServicePrice = (serviceId: number, price: string) => {
        setServiceSelections((prev) => ({
            ...prev,
            [serviceId]: {...prev[serviceId], customPrice: parseFloat(price) || 0}
        }));
    };

    const toggleCategory = (category: string, categoryServices: any[]) => {
        const allSelected = categoryServices.every(
            (s) => serviceSelections[s.id]?.isSelected
        );
        const newSelections = {...serviceSelections};
        categoryServices.forEach((svc) => {
            if (allSelected) {
                delete newSelections[svc.id];
            } else {
                newSelections[svc.id] = {
                    isSelected: true,
                    customPrice: svc.base_price
                };
            }
        });
        setServiceSelections(newSelections);
    };

    const handleAddLineFromModal = () => {
        if (!newLine.name || !newLine.advisor) {
            showToast("Line Name and Advisor are required", "error");
            return;
        }
        setLines((prev) => [
            ...prev,
            {...newLine, id: Date.now().toString()}
        ]);

        // Reset and Close
        setNewLine({id: "", name: "", advisor: "", type: "REPAIR"});
        setIsLineModalOpen(false);
        showToast("Service line added", "success");
    };

    const removeLine = (id: string) => {
        setLines((prev) => prev.filter((l) => l.id !== id));
    };

    // --- Final Submission ---
    const handleSubmit = async () => {
        const newErrors: Partial<BranchForm> = {};
        if (!form.name) newErrors.name = "Branch Name is required";
        if (!form.contact_number) newErrors.contact_number = "Contact is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast("Please fill in required fields", "error");
            return;
        }

        try {
            const payload = {
                name: form.name,
                email: form.email,
                contact_number: form.contact_number,
                address: form.address,
                location_code: form.location_code,
                unavailable_dates: unavailableDates.map(d => d.date),
                lines: lines.map(l => ({
                    name: l.name,
                    type: l.type,
                    advisor: l.advisor
                })),
                custom_pricing: Object.keys(serviceSelections).map(key => {
                    const id = parseInt(key);
                    return {
                        service_id: id,
                        price: serviceSelections[id].customPrice
                    };
                })
            };

            await createBranchMutation.mutateAsync(payload);
            showToast("Branch created successfully!", "success");
            setTimeout(() => router.push("/service-park"), 1500);

        } catch (error) {
            console.error(error);
            showToast("Failed to create branch. Check console.", "error");
        }
    };

    // --- Helpers ---
    const servicesByCategory = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        services.forEach((svc: any) => {
            if (!grouped[svc.type]) grouped[svc.type] = [];
            grouped[svc.type].push(svc);
        });
        return grouped;
    }, [services]);

    const filteredLines = lines.filter(l => lineFilter === "ALL" || l.type === lineFilter);

    const onDateSelect = (date: Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const existingRecord = unavailableDates.find(d => d.date === dateStr);

        setSelectedDate(date);

        if (existingRecord) {
            // Edit mode
            setDateReason(existingRecord.reason);
            setEditingDateId(existingRecord.id);
        } else {
            // Add mode
            setDateReason("");
            setEditingDateId(null);
        }

        setIsDateModalVisible(true);
    };

    const handleSaveDate = () => {
        if (!selectedDate || !dateReason) {
            showToast("Please enter a reason", "error");
            return;
        }

        const dateStr = selectedDate.format('YYYY-MM-DD');

        if (editingDateId) {
            // Update existing
            setUnavailableDates(prev => prev.map(item =>
                item.id === editingDateId ? {...item, reason: dateReason} : item
            ));
        } else {
            // Create new
            setUnavailableDates(prev => [
                ...prev,
                {id: Date.now().toString(), date: dateStr, reason: dateReason}
            ]);
        }

        setIsDateModalVisible(false);
        setDateReason("");
    };

    const handleDeleteDate = () => {
        if (editingDateId) {
            setUnavailableDates(prev => prev.filter(item => item.id !== editingDateId));
            setIsDateModalVisible(false);
            showToast("Date removed from unavailable list", "success");
        }
    };

    const dateCellRender = (value: Dayjs) => {
        const dateStr = value.format('YYYY-MM-DD');
        const match = unavailableDates.find(d => d.date === dateStr);

        if (match) {
            return (
                <div className="w-full h-full flex items-start justify-center pt-1">
                    <div
                        className="bg-[#DB2727] text-white text-[10px] px-2 py-1 rounded-md w-[90%] truncate text-center shadow-sm">
                        {match.reason}
                    </div>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat pb-20">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast}/>

            <main className="pt-30 px-8 max-w-[1440px] mx-auto flex flex-col gap-8">

                <div className="flex items-center gap-4 mb-4 ml-16">
                    <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/50 transition">
                        <ArrowLeft size={24}/>
                        {/*<h1 className="text-2xl font-bold">{isEditMode ? `Edit Branch: ${initialData?.name || ''}` : "Create New Branch"}</h1>*/}
                    </button>
                </div>

                {/* --- SECTION 1: Branch Info --- */}
                <section className="bg-[#FFFFFF4D] border border-[#E0E0E0] rounded-[45px] p-8 shadow-sm ml-16">
                    <h2 className="font-semibold text-[22px] mb-6">Branch Information</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <GlassInput
                            label="Branch Name"
                            value={form.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            error={errors.name}
                            required
                        />
                        <GlassInput
                            label="Contact Number"
                            value={form.contact_number}
                            onChange={(e) => handleInputChange("contact_number", e.target.value)}
                            error={errors.contact_number}
                            required
                        />
                        <GlassInput
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            error={errors.email}
                        />
                        <div className="lg:col-span-2">
                            <GlassInput
                                label="Address"
                                value={form.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                error={errors.address}
                            />
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: Services --- */}
                <section className="bg-[#FFFFFF4D] border border-[#E0E0E0] rounded-[45px] p-8 shadow-sm ml-16">
                    <h2 className="font-semibold text-[22px]">Available Services & Pricing</h2>
                    <div className="grid grid-cols-3 gap-6 mt-8">
                        {loadingServices ? (
                            <p>Loading services...</p>
                        ) : (
                            Object.keys(servicesByCategory).map((category) => (
                                <div key={category} className="mb-8 last:mb-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <button
                                            onClick={() => toggleCategory(category, servicesByCategory[category])}
                                            className="flex items-center gap-2 font-semibold text-lg hover:text-[#DB2727] transition"
                                        >
                                            {servicesByCategory[category].every(s => serviceSelections[s.id]?.isSelected) ? (
                                                <CheckSquare size={20} className="text-[#DB2727]"/>
                                            ) : (
                                                <Square size={20} className="text-gray-400"/>
                                            )}
                                            {category} Services
                                        </button>
                                        <span
                                            className="text-sm text-gray-500 font-normal ml-2">(Click to Select All)</span>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-4">
                                        {servicesByCategory[category].map((svc) => {
                                            const isSelected = !!serviceSelections[svc.id]?.isSelected;
                                            return (
                                                <div key={svc.id}
                                                     className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                         isSelected ? "bg-white border-[#DB2727] shadow-sm" : "bg-white/30 border-transparent hover:bg-white/50"
                                                     }`}>
                                                    <div className="flex items-center gap-3 cursor-pointer flex-1"
                                                         onClick={() => toggleService(svc.id, svc.base_price)}>
                                                        <div
                                                            className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-[#DB2727] border-[#DB2727]' : 'border-gray-400'}`}>
                                                            {isSelected &&
                                                                <CheckSquare size={16} className="text-white"/>}
                                                        </div>
                                                        <span
                                                            className={`${isSelected ? 'font-medium' : 'text-gray-600'}`}>{svc.name}</span>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-500">LKR</span>
                                                            <input
                                                                type="number"
                                                                value={serviceSelections[svc.id]?.customPrice || ""}
                                                                onChange={(e) => updateServicePrice(svc.id, e.target.value)}
                                                                className="w-24 h-9 rounded-lg border border-gray-300 px-2 text-right focus:border-[#DB2727] outline-none"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="bg-[#FFFFFF4D] border border-[#E0E0E0] rounded-[45px] p-8 shadow-sm ml-16">
                    <h2 className="font-semibold text-[22px] mb-6">Unavailable Dates</h2>
                    <div className="bg-white/60 rounded-[30px] p-6 border border-gray-200">
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: '#DB2727',
                                    fontFamily: 'Montserrat, sans-serif',
                                },
                            }}
                        >
                            <Calendar
                                cellRender={dateCellRender}
                                onSelect={onDateSelect}
                                className="glass-calendar"
                            />
                        </ConfigProvider>
                    </div>
                </section>

                {/* --- SECTION 4: Service Booth Lines --- */}
                <section className="bg-[#FFFFFF4D] border border-[#E0E0E0] rounded-[45px] p-8 shadow-sm ml-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-[22px]">Service Booth Lines</h2>
                        <button
                            onClick={() => setIsLineModalOpen(true)}
                            className="bg-[#DB2727] text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-red-700 transition"
                        >
                            <Plus size={18}/> Add New Line
                        </button>
                    </div>

                    <div className="w-full">

                        {/* Table */}
                        <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white/40">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100/80 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Line Name</th>
                                    <th className="p-4">Service Advisor</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredLines.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">No lines configured
                                            yet.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLines.map(line => (
                                        <tr key={line.id}
                                            className="border-b border-gray-100 last:border-0 hover:bg-white/60 transition">
                                            <td className="p-4 font-medium">{line.name}</td>
                                            <td className="p-4">{line.advisor}</td>
                                            <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        line.type === 'REPAIR' ? 'bg-blue-100 text-blue-700' :
                                                            line.type === 'PAINT' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {line.type}
                                                    </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => removeLine(line.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* --- Actions --- */}
                <div className="flex justify-end gap-4 ml-16 mt-4 pb-12">
                    <button onClick={() => router.back()}
                            className="px-8 py-3 rounded-[30px] border border-gray-400 text-gray-600 font-semibold hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting}
                            className="px-10 py-3 rounded-[30px] bg-[#DB2727] text-white font-bold text-lg hover:bg-red-700 transition shadow-lg flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ?
                            <Loader2 className="animate-spin"/> : <>{isEditMode ? "Update Branch" : "Create Branch"}</>}
                    </button>
                </div>
            </main>

            {/* --- ADD SERVICE LINE MODAL --- */}
            {isLineModalOpen && (
                <Modal
                    title="Add Service Line"
                    onClose={() => setIsLineModalOpen(false)}
                    actionButton={{
                        label: "Add",
                        onClick: handleAddLineFromModal,
                    }}
                >
                    <div className="grid grid-cols-3 gap-6 w-[800px]">
                        {/* Line Name Input */}
                        <div>
                            <label className="block mb-2 font-medium">Line Name</label>
                            <input
                                type="text"
                                value={newLine.name}
                                onChange={(e) => setNewLine({...newLine, name: e.target.value})}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 outline-none focus:border-[#DB2727]"
                                placeholder="e.g. Bay 01"
                            />
                        </div>

                        {/* Advisor ID Input */}
                        <div>
                            <label className="block mb-2 font-medium">Advisor Name</label>
                            <input
                                type="text"
                                value={newLine.advisor}
                                onChange={(e) => setNewLine({...newLine, advisor: e.target.value})}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 outline-none focus:border-[#DB2727]"
                                placeholder="Advisor Name"
                            />
                        </div>

                        {/* Type Selection */}
                        <div>
                            <label className="block mb-2 font-medium">Type</label>
                            <div
                                className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] flex items-center px-4">
                                <select
                                    value={newLine.type}
                                    onChange={(e: any) => setNewLine({...newLine, type: e.target.value})}
                                    className="w-full bg-transparent outline-none appearance-none"
                                >
                                    <option value="REPAIR">Repair</option>
                                    <option value="PAINT">Paint</option>
                                    <option value="WASH">Wash / Addon</option>
                                </select>
                                <span className="absolute right-4 pointer-events-none">
                                    <Image
                                        src={"/images/sales/icon-park-solid_down-one.svg"}
                                        width={19}
                                        height={19}
                                        alt="Arrow"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            <ConfigProvider theme={{token: {colorPrimary: '#DB2727'}}}>
                <AntModal
                    title={editingDateId ? "Edit Unavailable Date" : "Mark Date as Unavailable"}
                    open={isDateModalVisible}
                    onOk={handleSaveDate}
                    onCancel={() => {
                        setIsDateModalVisible(false);
                        setEditingDateId(null);
                        setDateReason("");
                    }}
                    okText="Save"
                    footer={[
                        editingDateId && (
                            <button key="delete" onClick={handleDeleteDate}
                                    className="mr-auto text-red-600 hover:text-red-800 font-medium px-4">
                                <Trash2 size={16} className="inline mr-1"/> Remove
                            </button>
                        ),
                        <button key="cancel" onClick={() => setIsDateModalVisible(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-2">
                            Cancel
                        </button>,
                        <button key="submit" onClick={handleSaveDate}
                                className="px-6 py-2 bg-[#DB2727] text-white rounded-lg hover:bg-red-700">
                            Save
                        </button>
                    ]}
                >
                    <div className="pt-4">
                        <div className="flex items-center gap-2 mb-4 text-gray-600">
                            <CalendarIcon size={18}/>
                            <span className="font-semibold text-lg">
                                {selectedDate?.format('MMMM D, YYYY')}
                            </span>
                        </div>

                        <label className="block mb-2 font-medium">Reason for Unavailability</label>
                        <input
                            type="text"
                            value={dateReason}
                            onChange={(e) => setDateReason(e.target.value)}
                            className="w-full h-[45px] rounded-[15px] border border-gray-300 px-4 outline-none focus:border-[#DB2727] focus:ring-1 focus:ring-[#DB2727]"
                            placeholder="e.g. Public Holiday, Maintenance, etc."
                            autoFocus
                        />
                    </div>
                </AntModal>
            </ConfigProvider>

            <style jsx global>{`
                .glass-calendar .ant-picker-calendar-header {
                    padding-bottom: 20px;
                }

                .glass-calendar .ant-picker-panel {
                    background: transparent !important;
                }

                .glass-calendar .ant-picker-calendar-date {
                    height: 70px !important;
                    width: 60%;
                }
            `}</style>
        </div>
    );
}