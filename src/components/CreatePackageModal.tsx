/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect } from 'react';
import Modal from "@/components/Modal";
import { useAllServices } from "@/hooks/useServicePark";

interface Props {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
}

export default function CreatePackageModal({ onClose, onSubmit, initialData }: Props) {
    const { data: services = [] } = useAllServices();

    const [name, setName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setShortDescription(initialData.short_description || "");
            setDescription(initialData.description || "");
            if (initialData.services) {
                setSelectedServiceIds(initialData.services.map((s: any) => s.id));
            }
        }
    }, [initialData]);

    const calculatedTotal = useMemo(() => {
        return services
            .filter((s: any) => selectedServiceIds.includes(s.id))
            .reduce((sum: number, s: any) => sum + Number(s.base_price), 0);
    }, [selectedServiceIds, services]);

    const handleToggleService = (id: number) => {
        setSelectedServiceIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        onSubmit({
            name,
            short_description: shortDescription,
            description,
            serviceIds: selectedServiceIds
        });
    };

    return (
        <Modal
            title={initialData ? "Edit Package" : "Create New Package"}
            onClose={onClose}
            actionButton={{ label: initialData ? "Update" : "Create", onClick: handleSubmit }}
        >
            <div className="space-y-4 w-[800px]">
                <div>
                    <label className="block text-sm font-medium mb-1">Package Name</label>
                    <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Gold Service Bundle" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Short Description</label>
                    <input className="input-field" value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="e.g. Complete exterior wash + wax" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Detailed Description</label>
                    <textarea className="input-field h-20 pt-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="List specific details..." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Select Included Services</label>
                    <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto p-2 bg-white/50 space-y-1">
                        {services.map((svc: any) => (
                            <div key={svc.id} onClick={() => handleToggleService(svc.id)}
                                 className={`flex justify-between items-center p-2 rounded-lg cursor-pointer border transition ${selectedServiceIds.includes(svc.id) ? "border-red-500 bg-red-50" : "border-transparent hover:bg-gray-100"}`}>
                                <div className="text-sm">
                                    <span className="font-medium">{svc.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">({svc.type})</span>
                                </div>
                                <div className="text-sm font-semibold text-gray-700">LKR {Number(svc.base_price).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Package Value:</span>
                    <span className="text-xl font-bold text-[#DB2727]">LKR {calculatedTotal.toLocaleString()}</span>
                </div>
            </div>
            <style jsx>{`
                .input-field { width: 100%; height: 45px; border-radius: 12px; background-color: rgba(255, 255, 255, 0.5); border: 1px solid rgba(0, 0, 0, 0.2); padding: 0 16px; outline: none; transition: all 0.2s; }
                .input-field:focus { border-color: #DB2727; background-color: rgba(255, 255, 255, 0.8); }
            `}</style>
        </Modal>
    );
}