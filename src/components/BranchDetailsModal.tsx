import React, {useState, useEffect} from 'react';
import Modal from "@/components/Modal";
import {useAllServices} from "@/hooks/useServicePark";
import {Trash2, Plus, Calendar as CalendarIcon, ArrowRight, ArrowLeft, Check} from "lucide-react";

interface Props {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export default function CreateBranchModal({onClose, onSubmit}: Props) {
    const {data: globalServices = []} = useAllServices();
    const [step, setStep] = useState(1);

    // --- FORM STATE ---
    // Step 1: Info
    const [info, setInfo] = useState({name: "", code: "", contact: "", address: ""});
    // Step 2: Dates
    const [tempDate, setTempDate] = useState("");
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
    // Step 3: Lines
    const [lines, setLines] = useState<{ name: string, type: string, advisor_id: string }[]>([]);
    const [tempLine, setTempLine] = useState({name: "", type: "REPAIR", advisor_id: ""});
    // Step 4: Pricing
    // Map of serviceId -> price. Only services in this map will be added to the branch.
    const [customPricing, setCustomPricing] = useState<Record<number, number>>({});

    // Initialize pricing with global base prices when services load
    useEffect(() => {
        if (globalServices.length > 0 && Object.keys(customPricing).length === 0) {
            const initialMap: Record<number, number> = {};
            globalServices.forEach((s: any) => {
                initialMap[s.id] = Number(s.base_price);
            });
            setCustomPricing(initialMap);
        }
    }, [globalServices]);

    // --- HANDLERS ---

    // Date Logic
    const addDate = () => {
        if (tempDate && !unavailableDates.includes(tempDate)) {
            setUnavailableDates([...unavailableDates, tempDate]);
            setTempDate("");
        }
    };
    const removeDate = (date: string) => setUnavailableDates(prev => prev.filter(d => d !== date));

    // Line Logic
    const addLine = () => {
        if (tempLine.name && tempLine.advisor_id) {
            setLines([...lines, {...tempLine}]);
            setTempLine({name: "", type: "REPAIR", advisor_id: ""});
        }
    };
    const removeLine = (idx: number) => setLines(prev => prev.filter((_, i) => i !== idx));

    // Pricing Logic
    const handlePriceChange = (id: number, val: string) => {
        setCustomPricing(prev => ({...prev, [id]: parseFloat(val) || 0}));
    };

    // Submit Logic
    const handleFinalSubmit = () => {
        // Transform pricing map to array
        const pricingArray = Object.entries(customPricing).map(([svcId, price]) => ({
            service_id: Number(svcId),
            price: price
        }));

        const payload = {
            name: info.name,
            location_code: info.code,
            contact_number: info.contact,
            address: info.address,
            unavailable_dates: unavailableDates,
            lines: lines,
            custom_pricing: pricingArray
        };
        onSubmit(payload);
    };

    // --- RENDER STEPS ---

    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Step 1: General Information</h3>
            <div className="flex gap-4">
                <div className="w-2/3">
                    <label className="text-xs text-gray-500 mb-1 block">Branch Name</label>
                    <input className="input-field" value={info.name}
                           onChange={e => setInfo({...info, name: e.target.value})} placeholder="e.g. Colombo Center"/>
                </div>
                <div className="w-1/3">
                    <label className="text-xs text-gray-500 mb-1 block">Loc. Code</label>
                    <input className="input-field" value={info.code}
                           onChange={e => setInfo({...info, code: e.target.value})} placeholder="CMB"/>
                </div>
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Contact</label>
                <input className="input-field" value={info.contact}
                       onChange={e => setInfo({...info, contact: e.target.value})} placeholder="077..."/>
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Address</label>
                <textarea className="input-field h-20 pt-2" value={info.address}
                          onChange={e => setInfo({...info, address: e.target.value})}/>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Step 2: Unavailable Dates (Holidays)</h3>
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Pick Date</label>
                    <input type="date" className="input-field" value={tempDate}
                           onChange={e => setTempDate(e.target.value)}/>
                </div>
                <button onClick={addDate}
                        className="h-[45px] w-[45px] bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800">
                    <Plus size={20}/></button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 max-h-[200px] overflow-y-auto">
                {unavailableDates.map(date => (
                    <div key={date}
                         className="bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <CalendarIcon size={14}/> {date}
                        <button onClick={() => removeDate(date)} className="hover:text-red-800"><Trash2 size={14}/>
                        </button>
                    </div>
                ))}
                {unavailableDates.length === 0 &&
                    <p className="text-sm text-gray-400 italic w-full text-center">No dates added.</p>}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Step 3: Service Lines (Booths)</h3>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                    <label className="text-[10px] text-gray-500 uppercase">Name</label>
                    <input className="input-field h-9 text-sm" placeholder="e.g. Paint 1" value={tempLine.name}
                           onChange={e => setTempLine({...tempLine, name: e.target.value})}/>
                </div>
                <div className="col-span-3">
                    <label className="text-[10px] text-gray-500 uppercase">Type</label>
                    <select className="input-field h-9 text-sm py-0" value={tempLine.type}
                            onChange={e => setTempLine({...tempLine, type: e.target.value})}>
                        <option value="REPAIR">Repair</option>
                        <option value="PAINT">Paint</option>
                    </select>
                </div>
                <div className="col-span-3">
                    <label className="text-[10px] text-gray-500 uppercase">Advisor ID</label>
                    <input type="number" className="input-field h-9 text-sm" placeholder="User ID"
                           value={tempLine.advisor_id}
                           onChange={e => setTempLine({...tempLine, advisor_id: e.target.value})}/>
                </div>
                <div className="col-span-2">
                    <button onClick={addLine}
                            className="w-full h-9 bg-black text-white rounded-lg flex items-center justify-center"><Plus
                        size={18}/></button>
                </div>
            </div>

            <div className="max-h-[200px] overflow-y-auto space-y-2">
                {lines.map((l, idx) => (
                    <div key={idx}
                         className="flex justify-between items-center bg-white border px-3 py-2 rounded-lg shadow-sm">
                        <div className="text-sm">
                            <span className="font-semibold">{l.name}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded ml-2 text-gray-600">{l.type}</span>
                            <span className="text-xs text-gray-400 ml-2">Adv: {l.advisor_id}</span>
                        </div>
                        <button onClick={() => removeLine(idx)} className="text-gray-400 hover:text-red-500"><Trash2
                            size={16}/></button>
                    </div>
                ))}
                {lines.length === 0 &&
                    <p className="text-sm text-gray-400 italic text-center py-2">No lines configured.</p>}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Step 4: Configure Pricing</h3>
            <p className="text-xs text-gray-500">Set specific prices for this branch. Defaults to global base price.</p>

            <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[300px]">
                <div className="bg-gray-100 px-4 py-2 flex text-xs font-bold text-gray-600 uppercase">
                    <div className="flex-1">Service</div>
                    <div className="w-24 text-right">Base</div>
                    <div className="w-32 text-right">Branch Price</div>
                </div>
                <div className="overflow-y-auto flex-1 bg-white">
                    {globalServices.map((svc: any) => (
                        <div key={svc.id}
                             className="flex items-center px-4 py-2 border-b last:border-0 hover:bg-gray-50">
                            <div className="flex-1 text-sm font-medium">
                                {svc.name} <span className="text-gray-400 font-normal text-xs">({svc.type})</span>
                            </div>
                            <div className="w-24 text-right text-xs text-gray-500">
                                {Number(svc.base_price).toLocaleString()}
                            </div>
                            <div className="w-32 pl-4">
                                <input
                                    type="number"
                                    className="w-full text-right border rounded px-2 py-1 text-sm focus:border-red-500 outline-none"
                                    value={customPricing[svc.id] || ''}
                                    onChange={(e) => handlePriceChange(svc.id, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            title="Create New Service Center"
            onClose={onClose}
            actionButton={{
                label: step === 4 ? "Complete Setup" : "Next Step",
                onClick: () => step === 4 ? handleFinalSubmit() : setStep(s => s + 1)
            }}
            // If on step 1, show no secondary button, else show Back
            secondaryButton={step > 1 ? {label: "Back", onClick: () => setStep(s => s - 1)} : undefined}
        >
            <div className="w-[800px] min-w-[500px]">
                {/* Stepper Indicator */}
                <div className="flex justify-between mb-6 px-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i}
                             className={`h-2 flex-1 mx-1 rounded-full transition-all ${i <= step ? "bg-[#DB2727]" : "bg-gray-200"}`}/>
                    ))}
                </div>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>
        </Modal>
    );
}