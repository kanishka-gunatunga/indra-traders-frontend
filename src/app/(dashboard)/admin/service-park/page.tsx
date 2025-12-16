/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, {useState} from "react";
import {useCurrentUser} from "@/utils/auth";
import {useToast} from "@/hooks/useToast";
import Toast from "@/components/Toast";
import {Eye, Trash2, Edit2} from "lucide-react";
import {
    useAllServices,
    useBranches,
    useCreateService,
    useCreatePackage,
    useCreateBranch,
    usePackages,
    useUpdatePackage,
    useDeletePackage,
    useUpdateService,
    useDeleteService, useDeleteBranch,

} from "@/hooks/useServicePark" ;
import BranchDetailsModal from "@/components/BranchDetailsModal";
import CreateBranchModal from "@/components/BranchDetailsModal";
import CreatePackageModal from "@/components/CreatePackageModal";
import {useRouter} from "next/navigation"; // Assumes hooks from previous steps

export default function ServiceParkConfig() {
    const router = useRouter();
    const user = useCurrentUser();
    const {toast, showToast, hideToast} = useToast();

    const deleteBranchMutation = useDeleteBranch();

    // --- Data Hooks ---
    const {data: services = [], isLoading: loadingServices} = useAllServices();
    const {data: packages = [], isLoading: loadingPackages} = usePackages();
    const {data: branches = [], isLoading: loadingBranches} = useBranches();

    // --- Mutations ---
    const createServiceMutation = useCreateService();
    const updateServiceMutation = useUpdateService();
    const deleteServiceMutation = useDeleteService();

    const createPackageMutation = useCreatePackage();
    const updatePackageMutation = useUpdatePackage();
    const deletePackageMutation = useDeletePackage();

    const createBranchMutation = useCreateBranch();


    // --- State ---
    const [activeTab, setActiveTab] = useState<"SERVICES" | "PACKAGES">("SERVICES");
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

    const [editingService, setEditingService] = useState<any | null>(null);
    const [editingPackage, setEditingPackage] = useState<any | null>(null);

    // "See More" State
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

    const [serviceForm, setServiceForm] = useState({name: "", type: "REPAIR", base_price: ""});

    // Form States
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState("REPAIR");
    const [newItemPrice, setNewItemPrice] = useState("");

    const [branchName, setBranchName] = useState("");
    const [branchLocation, setBranchLocation] = useState("");
    const [branchContact, setBranchContact] = useState("");
    const [branchAddress, setBranchAddress] = useState("");

    // --- Handlers ---

    const handleCreateService = async () => {
        try {
            await createServiceMutation.mutateAsync({
                name: newItemName,
                type: newItemType,
                base_price: parseFloat(newItemPrice)
            });
            showToast("Service created successfully", "success");
            setIsServiceModalOpen(false);
            setNewItemName("");
            setNewItemPrice("");
        } catch (e) {
            showToast("Failed to create service", "error");
        }
    };

    const handleCreateBranch = async () => {
        try {
            await createBranchMutation.mutateAsync({
                name: branchName,
                location_code: branchLocation,
                contact_number: branchContact,
                address: branchAddress
            });
            showToast("Branch created successfully", "success");
            setIsBranchModalOpen(false);
            setBranchName("");
            setBranchLocation("");
            setBranchContact("");
        } catch (e) {
            showToast("Failed to create branch", "error");
        }
    };

    const handleCreatePackage = async (data: any) => {
        try {
            await createPackageMutation.mutateAsync(data);
            showToast("Package created successfully", "success");
            setIsPackageModalOpen(false);
        } catch (e) {
            showToast("Failed to create package", "error");
        }
    };

    const handleCreateBranchComplex = async (data: any) => {
        try {
            await createBranchMutation.mutateAsync(data);
            showToast("Branch configured successfully", "success");
            setIsBranchModalOpen(false);
        } catch (e) {
            showToast("Failed to create branch", "error");
        }
    };


    const openServiceModal = (service?: any) => {
        if (service) {
            setEditingService(service);
            setServiceForm({
                name: service.name,
                type: service.type,
                base_price: service.base_price
            });
        } else {
            setEditingService(null);
            setServiceForm({name: "", type: "REPAIR", base_price: ""});
        }
        setIsServiceModalOpen(true);
    };

    const openPackageModal = (pkg?: any) => {
        if (pkg) {
            setEditingPackage(pkg);
        } else {
            setEditingPackage(null);
        }
        setIsPackageModalOpen(true);
    };

    const handleSaveService = async () => {
        try {
            const payload = {
                name: serviceForm.name,
                type: serviceForm.type,
                base_price: parseFloat(serviceForm.base_price)
            };

            if (editingService) {
                // Update
                await updateServiceMutation.mutateAsync({id: editingService.id, data: payload});
                showToast("Service updated successfully", "success");
            } else {
                // Create
                await createServiceMutation.mutateAsync(payload);
                showToast("Service created successfully", "success");
            }
            setIsServiceModalOpen(false);
        } catch (e) {
            showToast("Failed to save service", "error");
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await deleteServiceMutation.mutateAsync(id);
            showToast("Service deleted", "success");
        } catch (e) {
            showToast("Failed to delete service", "error");
        }
    };

    const handleSavePackage = async (data: any) => {
        try {
            if (editingPackage) {
                await updatePackageMutation.mutateAsync({id: editingPackage.id, data});
                showToast("Package updated successfully", "success");
            } else {
                await createPackageMutation.mutateAsync(data);
                showToast("Package created successfully", "success");
            }
            setIsPackageModalOpen(false);
        } catch (e: any) {
            showToast("Failed to save package", "error");
        }
    };

    const handleDeletePackage = async (id: number) => {
        if (!confirm("Are you sure you want to delete this package?")) return;
        try {
            await deletePackageMutation.mutateAsync(id);
            showToast("Package deleted", "success");
        } catch (e) {
            showToast("Failed to delete package", "error");
        }
    };

    const handleViewBranch = (id: number) => {
        // Navigate to the edit/view page
        router.push(`/admin/service-park/branch/${id}`);
    };

    const handleDeleteBranch = async (id: number) => {
        if(!confirm("Are you sure you want to delete this branch? This cannot be undone.")) return;
        try {
            await deleteBranchMutation.mutateAsync(id);
            showToast("Branch deleted successfully", "success");
        } catch (e) {
            showToast("Failed to delete branch", "error");
        }
    };


    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast}/>

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8 pb-20">
                <Header
                    name={user?.full_name || "Admin User"}
                    location={user?.branch || "Head Office"}
                    title="Service Park Configuration"
                />

                {/* --- SECTION 1: Services & Packages --- */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-8 flex flex-col">
                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab("SERVICES")}
                                className={`text-[22px] font-semibold transition-colors ${activeTab === "SERVICES" ? "text-black border-b-2 border-[#DB2727]" : "text-gray-400"}`}
                            >
                                Services
                            </button>
                            <button
                                onClick={() => setActiveTab("PACKAGES")}
                                className={`text-[22px] font-semibold transition-colors ${activeTab === "PACKAGES" ? "text-black border-b-2 border-[#DB2727]" : "text-gray-400"}`}
                            >
                                Packages
                            </button>
                        </div>

                        <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
                            onClick={() => activeTab === "SERVICES" ? openServiceModal() : openPackageModal()}
                        >
                            <Image src={"/images/sales/plus.svg"} width={24} height={24} alt="Add"/>
                        </button>
                    </div>

                    <div className="w-full mt-5">
                        <div className="h-[400px] overflow-x-auto overflow-y-hidden">
                            <div className="min-w-[1000px]">
                                {/* Table Header */}
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/4 px-3 py-2 text-left pl-8">Name</div>
                                    {/* Dynamic Header for Column 2 */}
                                    <div className="w-1/4 px-3 py-2 text-center">
                                        {activeTab === "SERVICES" ? "Type" : "Short Description"}
                                    </div>
                                    {/* Dynamic Header for Column 3 */}
                                    <div className="w-1/4 px-3 py-2 text-center">
                                        {activeTab === "SERVICES" ? "Base Price (LKR)" : "Total Value (LKR)"}
                                    </div>
                                    <div className="w-1/4 px-3 py-2 text-center">Action</div>
                                </div>

                                {/* Table Body */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {activeTab === "SERVICES" ? (
                                        loadingServices ? (
                                            <div className="text-center py-5">Loading services...</div>
                                        ) : services.length === 0 ? (
                                            <div className="text-center py-5 text-gray-500">No services
                                                configured.</div>
                                        ) : (
                                            services.map((svc: any) => (
                                                <div key={svc.id}
                                                     className="flex text-lg mt-1 text-black hover:bg-gray-50 transition items-center cursor-pointer">
                                                    <div
                                                        onClick={() => openServiceModal(svc)}
                                                        className="w-1/4 px-3 py-2 pl-8 font-medium text-left flex items-center gap-2">
                                                        {svc.name}
                                                    </div>
                                                    <div className="w-1/4 px-3 py-2 text-center">
                                    <span
                                        onClick={() => openServiceModal(svc)}
                                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        {svc.type}
                                    </span>
                                                    </div>
                                                    <div
                                                        onClick={() => openServiceModal(svc)}
                                                        className="w-1/4 px-3 py-2 text-center font-semibold text-gray-700">
                                                        {parseFloat(svc.base_price).toLocaleString()}
                                                    </div>
                                                    <div className="w-1/4 px-3 py-2 flex justify-center gap-3">
                                                        <button
                                                            onClick={() => openServiceModal(svc)}
                                                            className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                                                            <Edit2 size={18}/>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteService(svc.id);
                                                            }}
                                                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
                                                            <Trash2 size={18}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    ) : (
                                        loadingPackages ? <div className="text-center py-5">Loading packages...</div> :
                                            packages.length === 0 ? (
                                                <div className="text-center py-5 text-gray-500">No packages configured
                                                    yet.</div>
                                            ) : (
                                                packages.map((pkg: any) => (
                                                    <div key={pkg.id}
                                                         className="flex text-lg mt-1 text-black hover:bg-gray-50 transition items-center cursor-pointer">
                                                        <div
                                                            onClick={() => openPackageModal(pkg)}
                                                            className="w-1/4 px-3 py-2 pl-8 font-medium text-left flex items-center gap-2">
                                                            {pkg.name}
                                                        </div>
                                                        <div
                                                            onClick={() => openPackageModal(pkg)}
                                                            className="w-1/4 px-3 py-2 text-center text-sm text-gray-500 truncate"
                                                            title={pkg.short_description}>
                                                            {pkg.short_description || "-"}
                                                        </div>
                                                        <div
                                                            onClick={() => openPackageModal(pkg)}
                                                            className="w-1/4 px-3 py-2 text-center font-semibold text-[#DB2727]">
                                                            {parseFloat(pkg.total_price).toLocaleString()}
                                                        </div>
                                                        <div className="w-1/4 px-3 py-2 flex justify-center gap-3">
                                                            <button onClick={() => openPackageModal(pkg)}
                                                                    className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50">
                                                                <Edit2 size={18}/></button>
                                                            <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePackage(pkg.id);
                                                            }}
                                                                    className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
                                                                <Trash2 size={18}/></button>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: Branch Management --- */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-8 flex flex-col">
                    <div className="w-full flex justify-between items-center mb-6">
                        <span className="font-semibold text-[22px]">Branches</span>
                        <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
                            onClick={() => setIsBranchModalOpen(true)}
                        >
                            <Image src={"/images/sales/plus.svg"} width={24} height={24} alt="Add"/>
                        </button>
                    </div>

                    <div className="w-full mt-5">
                        <div className="h-[400px] overflow-x-auto overflow-y-hidden">
                            <div className="min-w-[1000px]">
                                {/* Table Header */}
                                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/5 px-3 py-2 text-left pl-8">Branch Name</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Email</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Contact</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Address</div>
                                    <div className="w-1/5 px-3 py-2 text-center">Action</div>
                                </div>

                                {/* Table Body */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {loadingBranches ? (
                                        <div className="text-center py-5">Loading branches...</div>
                                    ) : branches.length === 0 ? (
                                        <div className="text-center py-5 text-gray-500">No branches configured yet.</div>
                                    ) : (
                                        branches.map((branch: any) => (
                                            <div
                                                key={branch.id}
                                                className="flex text-lg mt-1 text-black hover:bg-gray-50 transition items-center cursor-pointer"
                                            >
                                                {/* Name */}
                                                <div className="w-1/5 px-3 py-2 text-left pl-8 font-medium">
                                                    {branch.name}
                                                </div>

                                                {/* Code/Email */}
                                                <div className="w-1/5 px-3 py-2 text-center text-base text-gray-600">
                                                    {branch.location_code || branch.email || "-"}
                                                </div>

                                                {/* Contact */}
                                                <div className="w-1/5 px-3 py-2 text-center text-base">
                                                    {branch.contact_number}
                                                </div>

                                                {/* Address */}
                                                <div className="w-1/5 px-3 py-2 text-center text-base truncate" title={branch.address}>
                                                    {branch.address}
                                                </div>

                                                {/* Actions */}
                                                <div className="w-1/5 px-3 py-2 flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewBranch(branch.id)}
                                                        className="bg-[#DB2727] text-white px-3 py-1 rounded-full text-xs hover:bg-red-700 transition"
                                                    >
                                                        See More
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewBranch(branch.id)}
                                                        className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                                                    >
                                                        <Edit2 size={18}/>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteBranch(branch.id);
                                                        }}
                                                        className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                                                    >
                                                        <Trash2 size={18}/>
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

            {isServiceModalOpen && (
                <Modal
                    title={editingService ? "Edit Service" : "Add New Global Service"}
                    onClose={() => setIsServiceModalOpen(false)}
                    actionButton={{label: editingService ? "Save" : "Create", onClick: handleSaveService}}
                >
                    <div className="space-y-4 w-[800px]">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input value={serviceForm.name}
                                   onChange={e => setServiceForm({...serviceForm, name: e.target.value})}
                                   className="input-field" placeholder="e.g. Full Body Wash"/>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select value={serviceForm.type}
                                        onChange={e => setServiceForm({...serviceForm, type: e.target.value})}
                                        className="input-field">
                                    <option value="REPAIR">Repair</option>
                                    <option value="PAINT">Paint</option>
                                    <option value="ADDON">Add-on</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium mb-1">Base Price (LKR)</label>
                                <input type="number" value={serviceForm.base_price}
                                       onChange={e => setServiceForm({...serviceForm, base_price: e.target.value})}
                                       className="input-field" placeholder="0.00"/>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {isPackageModalOpen && (
                <CreatePackageModal
                    initialData={editingPackage}
                    onClose={() => setIsPackageModalOpen(false)}
                    onSubmit={handleSavePackage}
                />
            )}

            {isBranchModalOpen && (
                <CreateBranchModal
                    onClose={() => setIsBranchModalOpen(false)}
                    onSubmit={handleCreateBranchComplex}
                />
            )}

            <style jsx>{`
                .input-field {
                    width: 100%;
                    height: 45px;
                    border-radius: 12px;
                    background-color: rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    padding: 0 16px;
                    outline: none;
                    transition: all 0.2s;
                }

                .input-field:focus {
                    border-color: #DB2727;
                    background-color: rgba(255, 255, 255, 0.8);
                }
            `}</style>
        </div>
    );
}