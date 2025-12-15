/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, {useState} from "react";
import {useCurrentUser} from "@/utils/auth";
import {useToast} from "@/hooks/useToast";
import Toast from "@/components/Toast";
import {Eye, Plus, Trash2, Edit2, Package as PackageIcon, Wrench} from "lucide-react";
import {
    useAllServices,
    useBranches,
    useCreateService,
    useCreatePackage,
    useCreateBranch
} from "@/hooks/useServicePark" ;
import BranchDetailsModal from "@/components/BranchDetailsModal"; // Assumes hooks from previous steps

export default function ServiceParkConfig() {
    const user = useCurrentUser();
    const {toast, showToast, hideToast} = useToast();

    // --- Data Hooks ---
    const {data: services = [], isLoading: loadingServices} = useAllServices();
    // For this example, assume we have a hook for packages (mocked if not created yet)
    // const { data: packages = [] } = usePackages();
    const packages = []; // Placeholder
    const {data: branches = [], isLoading: loadingBranches} = useBranches();

    // --- Mutations ---
    const createServiceMutation = useCreateService();
    const createPackageMutation = useCreatePackage();
    const createBranchMutation = useCreateBranch();

    // --- State ---
    const [activeTab, setActiveTab] = useState<"SERVICES" | "PACKAGES">("SERVICES");
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

    // "See More" State
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

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
                                Global Services
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
                            onClick={() => setIsServiceModalOpen(true)}
                        >
                            <Image src={"/images/sales/plus.svg"} width={24} height={24} alt="Add"/>
                        </button>
                    </div>

                    <div className="w-full h-[350px] overflow-y-auto no-scrollbar">
                        <div className="min-w-[900px]">
                            {/* Table Header */}
                            <div
                                className="flex bg-gray-100/80 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC] rounded-t-lg sticky top-0 backdrop-blur-sm z-10">
                                <div className="w-1/4 px-3 py-3 text-left pl-8">Name</div>
                                <div className="w-1/4 px-3 py-3 text-center">Type / Description</div>
                                <div
                                    className="w-1/4 px-3 py-3 text-center">{activeTab === "SERVICES" ? "Base Price (LKR)" : "Total Price (LKR)"}</div>
                                <div className="w-1/4 px-3 py-3 text-center">Action</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col gap-1">
                                {activeTab === "SERVICES" ? (
                                    loadingServices ? <p className="text-center py-4">Loading...</p> :
                                        services.map((svc: any) => (
                                            <div key={svc.id}
                                                 className="flex text-lg bg-white/40 hover:bg-white/80 transition items-center rounded-lg py-2 border border-transparent hover:border-gray-200">
                                                <div className="w-1/4 px-3 pl-8 font-medium flex items-center gap-2">
                                                    <Wrench size={16} className="text-gray-500"/> {svc.name}
                                                </div>
                                                <div className="w-1/4 px-3 text-center text-sm">
                                                    <span
                                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{svc.type}</span>
                                                </div>
                                                <div className="w-1/4 px-3 text-center font-semibold">
                                                    {parseFloat(svc.base_price).toLocaleString()}
                                                </div>
                                                <div className="w-1/4 px-3 flex justify-center gap-3">
                                                    <button className="text-gray-500 hover:text-blue-600"><Edit2
                                                        size={18}/></button>
                                                    <button className="text-red-400 hover:text-red-600"><Trash2
                                                        size={18}/></button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    // Packages Mock
                                    <div className="text-center text-gray-500 py-4">No packages configured yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: Branch Management --- */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-8 flex flex-col">
                    <div className="w-full flex justify-between items-center mb-6">
                        <span className="font-semibold text-[22px]">Service Centers (Branches)</span>
                        <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
                            onClick={() => setIsBranchModalOpen(true)}
                        >
                            <Image src={"/images/sales/plus.svg"} width={24} height={24} alt="Add"/>
                        </button>
                    </div>

                    <div className="w-full h-[350px] overflow-y-auto no-scrollbar">
                        <div className="min-w-[900px]">
                            {/* Table Header */}
                            <div
                                className="flex bg-gray-100/80 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC] rounded-t-lg sticky top-0 backdrop-blur-sm z-10">
                                <div className="w-1/5 px-3 py-3 text-left pl-8">Branch Name</div>
                                <div className="w-1/5 px-3 py-3 text-center">Code</div>
                                <div className="w-1/5 px-3 py-3 text-center">Contact</div>
                                <div className="w-1/5 px-3 py-3 text-left">Address</div>
                                <div className="w-1/5 px-3 py-3 text-center">Action</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col gap-1">
                                {loadingBranches ? <p className="text-center py-4">Loading...</p> :
                                    branches.map((branch: any) => (
                                        <div key={branch.id}
                                             className="flex text-lg bg-white/40 hover:bg-white/80 transition items-center rounded-lg py-3 border border-transparent hover:border-gray-200">
                                            <div className="w-1/5 px-3 pl-8 font-medium">{branch.name}</div>
                                            <div
                                                className="w-1/5 px-3 text-center text-sm font-mono text-gray-600">{branch.location_code}</div>
                                            <div
                                                className="w-1/5 px-3 text-center text-sm">{branch.contact_number}</div>
                                            <div className="w-1/5 px-3 text-sm truncate"
                                                 title={branch.address}>{branch.address}</div>
                                            <div className="w-1/5 px-3 flex justify-center">
                                                <button
                                                    onClick={() => setSelectedBranchId(branch.id)}
                                                    className="bg-[#DB2727] text-white px-4 py-1.5 rounded-full text-xs hover:bg-red-700 transition flex items-center gap-2"
                                                >
                                                    See More <Eye size={14}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- Modals --- */}

            {/* Add Service Modal */}
            {isServiceModalOpen && (
                <Modal
                    title={activeTab === "SERVICES" ? "Add New Global Service" : "Add New Package"}
                    onClose={() => setIsServiceModalOpen(false)}
                    actionButton={{label: "Create", onClick: handleCreateService}}
                >
                    <div className="space-y-4 w-full">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input value={newItemName} onChange={e => setNewItemName(e.target.value)}
                                   className="input-field" placeholder="e.g. Full Body Wash"/>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select value={newItemType} onChange={e => setNewItemType(e.target.value)}
                                        className="input-field">
                                    <option value="REPAIR">Repair</option>
                                    <option value="PAINT">Paint</option>
                                    <option value="ADDON">Add-on</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium mb-1">Base Price (LKR)</label>
                                <input type="number" value={newItemPrice}
                                       onChange={e => setNewItemPrice(e.target.value)} className="input-field"
                                       placeholder="0.00"/>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Add Branch Modal */}
            {isBranchModalOpen && (
                <Modal
                    title="Add New Service Center"
                    onClose={() => setIsBranchModalOpen(false)}
                    actionButton={{label: "Create Branch", onClick: handleCreateBranch}}
                >
                    <div className="space-y-4 w-full">
                        <div className="flex gap-4">
                            <div className="w-2/3">
                                <label className="block text-sm font-medium mb-1">Branch Name</label>
                                <input value={branchName} onChange={e => setBranchName(e.target.value)}
                                       className="input-field" placeholder="e.g. Indra Service Park - Kandy"/>
                            </div>
                            <div className="w-1/3">
                                <label className="block text-sm font-medium mb-1">Location Code</label>
                                <input value={branchLocation} onChange={e => setBranchLocation(e.target.value)}
                                       className="input-field" placeholder="KANDY"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contact Number</label>
                            <input value={branchContact} onChange={e => setBranchContact(e.target.value)}
                                   className="input-field" placeholder="077..."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea value={branchAddress} onChange={e => setBranchAddress(e.target.value)}
                                      className="input-field h-24 pt-2" placeholder="Full Address..."/>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Detail View (See More) */}
            {selectedBranchId && (
                <BranchDetailsModal
                    branchId={selectedBranchId}
                    onClose={() => setSelectedBranchId(null)}
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