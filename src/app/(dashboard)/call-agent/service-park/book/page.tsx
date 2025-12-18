// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client"
// import Image from "next/image";
// import React, {Key, useEffect, useState} from "react";
// import {Badge, Calendar, ConfigProvider, Select} from "antd";
// import dayjs from "dayjs";
// import {useSelector} from "react-redux";
// import {useToast} from "@/hooks/useToast";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {useForm} from "react-hook-form";
// import {
//     useBookingAvailability,
//     useBranchDetails,
//     useBranches,
//     useDailyBookings,
//     useSubmitBooking
// } from "@/hooks/useServicePark";
// import {vehicleHistorySchema} from "../page";
// import FormField from "@/components/FormField";
//
//
// interface ScheduleSlot {
//     time: string;
//     type: string;
//     cab: string | number | bigint | boolean;
//     duration: string | number | bigint | boolean;
//     status: string;
// }
//
// interface Schedules {
//     [date: string]: ScheduleSlot[];
// }
//
// interface DotsData {
//     [date: string]: string[];
// }
//
//
// const generateTimeSlots = () => {
//     const slots = [];
//     let start = 8 * 60; // 8:00 AM in minutes
//     const end = 17 * 60; // 5:00 PM
//
//     while (start < end) {
//         const startTime = `${Math.floor(start / 60).toString().padStart(2, '0')}:${(start % 60).toString().padStart(2, '0')}`;
//         const endMins = start + 30;
//         const endTime = `${Math.floor(endMins / 60).toString().padStart(2, '0')}:${(endMins % 60).toString().padStart(2, '0')}`;
//         slots.push({start: startTime, end: endTime, label: `${startTime} - ${endTime}`});
//         start += 30;
//     }
//     return slots;
// };
//
// const TIME_SLOTS = generateTimeSlots();
//
//
// const ServiceParkBooking = () => {
//
//     const {toast, showToast, hideToast} = useToast();
//     const bookingState = useSelector((state: any) => state.booking);
//
//     // const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs('2025-03-05'));
//     // const [calendarValue, setCalendarValue] = useState<dayjs.Dayjs>(dayjs('2025-03-05'));
//
//     const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
//     const [calendarMonth, setCalendarMonth] = useState<string>(dayjs().format('YYYY-MM'));
//
//     const selectedDateString = selectedDate.format('YYYY-MM-DD');
//
//
//     const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
//     const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
//     const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
//
//     const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
//
//     const {
//         register,
//         setValue,
//         formState: {errors},
//     } = useForm({
//         resolver: zodResolver(vehicleHistorySchema),
//         defaultValues: {
//             vehicle_no: "",
//             owner_name: "",
//             contact_no: "",
//             mileage: "",
//             oil_type: "",
//             service_center: "",
//             service_advisor: ""
//         }
//     });
//
//     useEffect(() => {
//         if (bookingState.isFromServicePark && bookingState.vehicleData) {
//             const vData = bookingState.vehicleData;
//             Object.keys(vData).forEach((key) => {
//                 setValue(key as any, vData[key]);
//             });
//             // Auto-select branch if it was in the data (assuming data has service_center mapping)
//             // if(vData.service_center) ...
//         }
//     }, [bookingState, setValue]);
//
//     const {data: branches} = useBranches();
//
//     const {data: branchDetails, isLoading: loadingDetails} = useBranchDetails(selectedBranchId!);
//
//     const serviceTypes = React.useMemo(() => {
//         if (!branchDetails?.serviceLines) return [];
//         const types = new Set(branchDetails.serviceLines.map((l: any) => l.type));
//         return Array.from(types).map(t => ({value: t, label: t}));
//     }, [branchDetails]);
//
//     const serviceLines = React.useMemo(() => {
//         if (!branchDetails?.serviceLines || !selectedServiceType) return [];
//         return branchDetails.serviceLines
//             .filter((l: any) => l.type === selectedServiceType && l.status === 'ACTIVE')
//             .map((l: any) => ({value: l.id, label: `${l.name} (${l.advisor})`}));
//     }, [branchDetails, selectedServiceType]);
//
//
//     const {
//         data: availabilityData,
//         isLoading: loadingAvailability
//     } = useBookingAvailability(selectedBranchId, selectedLineId, calendarMonth);
//
//     const {
//         data: dailyBookings,
//         isLoading: loadingSlots
//     } = useDailyBookings(selectedBranchId, selectedLineId, selectedDateString);
//
//     const bookingMutation = useSubmitBooking();
//
//     const disabledDate = (current: dayjs.Dayjs) => {
//         if (!availabilityData?.unavailableDates) return false;
//         const dateStr = current.format('YYYY-MM-DD');
//         return availabilityData.unavailableDates.some((d: any) => d.date === dateStr);
//     };
//
//     const dateCellRender = (date: dayjs.Dayjs) => {
//         const dateStr = date.format('YYYY-MM-DD');
//         const dotColors = availabilityData?.dots?.[dateStr] || []; // default empty if no data
//
//         return (
//             <div className="flex justify-center items-end h-full pb-2">
//                 {dotColors.map((color: string, i: number) => (
//                     <Badge key={i} color={color === 'green' ? '#039855' : color === 'red' ? '#DB2727' : '#FF961B'}/>
//                 ))}
//             </div>
//         );
//     };
//
//     const handlePanelChange = (value: dayjs.Dayjs) => {
//         setCalendarMonth(value.format('YYYY-MM'));
//         setSelectedDate(value);
//     };
//
//     const handleSelectDate = (value: dayjs.Dayjs) => {
//         setSelectedDate(value);
//         setSelectedSlots([]); // Clear slots on date change
//     };
//
//     const getSlotStatus = (slotStart: string) => {
//         // dailyBookings is now defined from Fix 2
//         if (!dailyBookings) return 'available';
//         const isBooked = dailyBookings.some((b: any) => b.start_time.substring(0, 5) === slotStart);
//         if (isBooked) return 'booked';
//         if (selectedSlots.includes(slotStart)) return 'pending';
//         return 'available';
//     };
//
//     const toggleSlot = (start: string) => {
//         if (getSlotStatus(start) === 'booked') return;
//
//         setSelectedSlots(prev =>
//             prev.includes(start)
//                 ? prev.filter(s => s !== start)
//                 : [...prev, start]
//         );
//     };
//
//     const handleSubmitBooking = () => {
//         if (!selectedBranchId || !selectedLineId || selectedSlots.length === 0) {
//             showToast("Please select slots", "error");
//             return;
//         }
//
//         const slotsPayload = selectedSlots.map(start => {
//             const slotObj = TIME_SLOTS.find(ts => ts.start === start);
//             return {start: slotObj?.start, end: slotObj?.end};
//         });
//
//         const payload = {
//             branch_id: selectedBranchId,
//             service_line_id: selectedLineId,
//             booking_date: selectedDateString, // Use the string format
//             slots: slotsPayload,
//             vehicle_no: bookingState.vehicleData?.vehicle_no,
//             customer_id: bookingState.vehicleData?.customer_id,
//         };
//
//         // bookingMutation is now defined from Fix 3
//         bookingMutation.mutate(payload, {
//             onSuccess: () => {
//                 showToast("Booking created successfully", "success");
//                 setSelectedSlots([]);
//             },
//             onError: (err: any) => {
//                 showToast(err.response?.data?.message || "Booking failed", "error");
//             }
//         });
//     };
//
//
//     const dotsData: DotsData = {
//         '2025-03-05': ['green'],
//         '2025-03-06': ['red'],
//         '2025-03-07': ['green', 'orange'],
//         '2025-03-08': ['green'],
//         '2025-03-09': ['red'],
//         '2025-03-10': ['green'],
//         '2025-03-11': ['orange'],
//         '2025-03-13': ['green'],
//         '2025-03-14': ['red'],
//         '2025-03-15': ['green', 'orange'],
//         '2025-03-16': ['green'],
//         '2025-03-18': ['green', 'orange'],
//         '2025-03-19': ['green', 'orange'],
//         '2025-03-20': ['green'],
//         '2025-03-21': ['green', 'orange'],
//         '2025-03-22': ['green', 'orange'],
//         '2025-03-23': ['green'],
//         '2025-03-24': ['red'],
//         '2025-03-25': ['green', 'orange'],
//         '2025-03-26': ['green', 'orange'],
//         '2025-03-27': ['red'],
//         '2025-03-28': ['green', 'orange'],
//         '2025-03-29': ['red'],
//         '2025-03-30': ['green'],
//         '2025-03-31': ['red'],
//     };
//
//
//     const schedules: Schedules = {
//         '2025-03-05': [
//             {time: '8:00', type: 'booked', cab: 'CAB - 5482', duration: '8:00 - 8:30', status: 'Booked'},
//             {time: '8:30', type: 'available', cab: 'Available', duration: '8:30 - 9:00', status: 'Available'},
//             {time: '9:00', type: 'booked', cab: 'CAB - 7824', duration: '9:00 - 9:30', status: 'Booked'},
//             {time: '9:30', type: 'pending', cab: 'CAB - 4862', duration: '9:30 - 10:00', status: 'Pending'},
//             {time: '10:00', type: 'available', cab: 'Available', duration: '10:00 - 10:30', status: 'Available'},
//             {time: '10:30', type: 'available', cab: 'Available', duration: '10:30 - 11:00', status: 'Available'},
//         ],
//     };
//
//     const getDotBadges = (dateStr: string) => {
//         const dots = dotsData[dateStr] || [];
//         return dots.map((color: string, index: Key | null | undefined) => (
//             <Badge
//                 key={index}
//                 color={color === 'green' ? '#039855' : color === 'red' ? '#DB2727' : '#FF961B'}
//                 style={{width: 8, height: 8, marginRight: 2}}
//             />
//         ));
//     };
//
//     // const dateCellRender = (date: dayjs.Dayjs) => {
//     //     const dateStr = date.format('YYYY-MM-DD');
//     //     const isSelected = date.isSame(selectedDate, 'day');
//     //     const dots = getDotBadges(dateStr);
//     //
//     //     return (
//     //         <div
//     //             className={`relative h-full flex flex-col justify-between p-1`}
//     //         >
//     //             {dots.length > 0 && (
//     //                 <div className="flex justify-start mt-auto pb-4 overflow-hidden">
//     //                     {dots}
//     //                 </div>
//     //             )}
//     //         </div>
//     //     );
//     // };
//
//     const onSelect = (date: dayjs.Dayjs) => {
//         setSelectedDate(date);
//     };
//
//     const getScheduleForDate = (date: dayjs.Dayjs) => {
//         return schedules[date.format("YYYY-MM-DD")] || [];
//     };
//
//     // const handlePrevMonth = () => {
//     //     setCalendarValue((prev) => prev.subtract(1, 'month'));
//     // };
//     //
//     // const handleNextMonth = () => {
//     //     setCalendarValue((prev) => prev.add(1, 'month'));
//     // };
//
//     return (
//         <div
//             className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
//
//             <div className="max-w-[1800px] mx-auto container">
//
//                 <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
//                     <h1 className="text-2xl font-extrabold mb-4">Indra Service Park Sales Dashboard</h1>
//
//                     <section
//                         className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
//                         <div className="flex-1 space-y-6">
//                             <div className="flex-1 space-y-6 mt-10">
//                                 <div className="flex flex-row items-center justify-between">
//                                     <h2 className="font-semibold text-[19px] mb-6">Last Service Details</h2>
//                                 </div>
//
//                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                                     <FormField
//                                         label="Mileage"
//                                         register={register("mileage")}
//                                     />
//                                     <FormField
//                                         label="Oil Type"
//                                         register={register("oil_type")}
//                                     />
//                                     <FormField
//                                         label="Service Center"
//                                         register={register("service_center")}
//                                     />
//                                     <FormField
//                                         label="Service Advisor"
//                                         register={register("service_advisor")}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//
//
//                     <section
//                         className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
//                         <div className="flex-1 space-y-6">
//                             <div className="flex flex-row items-center gap-10">
//                                 <h2 className="font-semibold text-[22px]">Service Schedule</h2>
//                                 {/*<div className="flex flex-row gap-12 mt-1">*/}
//                                 {/*    <div*/}
//                                 {/*        className="font-medium text-[17px] text-[#1D1D1D] flex flex-row gap-3 items-center">*/}
//                                 {/*        <h3>Kandy</h3>*/}
//                                 {/*        <svg className="" width="10" height="6"*/}
//                                 {/*             viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
//                                 {/*            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"*/}
//                                 {/*                  fill="#575757"/>*/}
//                                 {/*        </svg>*/}
//                                 {/*    </div>*/}
//
//                                 {/*    <div*/}
//                                 {/*        className="font-medium text-[17px] text-[#1D1D1D] flex flex-row gap-3 items-center">*/}
//                                 {/*        <h3>Repair</h3>*/}
//                                       <svg className="" width="10" height="6"
//                                            viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
//                                                  fill="#575757"/>
//                                       </svg>
//                                 {/*    </div>*/}
//                                 {/*</div>*/}
//
//                                 <div className="grid grid-cols-3 gap-8">
//                                     <div>
//                                         <label className="block mb-2 font-medium">Select Branch</label>
//                                         <Select
//                                             className="w-full h-12"
//                                             placeholder="Select Branch"
//                                             options={branches?.map((b: any) => ({value: b.id, label: b.name}))}
//                                             onChange={(val) => {
//                                                 setSelectedBranchId(val);
//                                                 setSelectedServiceType(null); // Reset downstream
//                                                 setSelectedLineId(null);
//                                             }}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block mb-2 font-medium">Service Type</label>
//                                         <Select
//                                             className="w-full h-12"
//                                             placeholder="Select Type"
//                                             disabled={!selectedBranchId}
//                                             options={serviceTypes}
//                                             value={selectedServiceType}
//                                             onChange={(val) => {
//                                                 setSelectedServiceType(val);
//                                                 setSelectedLineId(null);
//                                             }}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block mb-2 font-medium">Service Line</label>
//                                         <Select
//                                             className="w-full h-12"
//                                             placeholder="Select Line"
//                                             disabled={!selectedServiceType}
//                                             options={serviceLines}
//                                             value={selectedLineId}
//                                             onChange={setSelectedLineId}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="flex gap-8 mt-12">
//                                 <div className="w-1/2">
//                                     <div className="bg-white rounded-2xl overflow-hidden">
//                                         <ConfigProvider
//                                             theme={{
//                                                 token: {
//                                                     colorPrimary: '#DB2727',
//                                                     fontFamily: 'Montserrat, sans-serif',
//                                                 },
//                                             }}
//                                         >
//                                             <Calendar
//                                                 value={selectedDate}
//                                                 onSelect={handleSelectDate}
//                                                 onPanelChange={handlePanelChange}
//                                                 cellRender={dateCellRender}
//                                                 disabledDate={disabledDate}
//                                                 mode="month"
//                                                 className="custom-calendar glass-calendar"
//                                                 headerRender={({value, type, onTypeChange}) => (
//                                                     <div className="px-6 py-4 flex justify-between items-center">
//                                                         <div
//                                                             className="text-sm font-bold flex flex-row gap-2 items-center">
//                                                             {value.format('MMMM YYYY')} <span><Image
//                                                             src="/next-arrow.svg"
//                                                             alt="prev arrow"
//                                                             width={32} height={32}
//                                                             className="w-5 h-5"/></span>
//                                                         </div>
//                                                         {/*<div className="flex gap-2">*/}
//                                                         {/*    <button*/}
//                                                         {/*        onClick={handlePrevMonth}*/}
//                                                         {/*        className="text-gray-500 hover:text-gray-700"*/}
//                                                         {/*    >*/}
//                                                         {/*        <Image src="/prev-arrow.svg" alt="prev arrow" width={32}*/}
//                                                         {/*               height={32} className="w-5 h-5"/>*/}
//                                                         {/*    </button>*/}
//                                                         {/*    <button*/}
//                                                         {/*        onClick={handleNextMonth}*/}
//                                                         {/*        className="text-gray-500 hover:text-gray-700"*/}
//                                                         {/*    >*/}
//                                                         {/*        <Image src="/next-arrow.svg" alt="prev arrow" width={32}*/}
//                                                         {/*               height={32} className="w-5 h-5"/>*/}
//                                                         {/*    </button>*/}
//                                                         {/*</div>*/}
//                                                     </div>
//                                                 )}
//                                             />
//                                         </ConfigProvider>
//                                     </div>
//                                     <div className="flex flex-row items-center gap-8 mt-8 justify-center">
//                                         <h3 className="text-[#1D1D1D] text-[12px] font-medium flex gap-2 items-center">
//                                             <span className="bg-[#DB2727] w-2 h-2 rounded-full"></span> Booked
//                                         </h3>
//                                         <h3 className="text-[#1D1D1D] text-[12px] font-medium flex gap-2 items-center">
//                                             <span className="bg-[#FF961B] w-2 h-2 rounded-full"></span> Pending
//                                         </h3>
//                                         <h3 className="text-[#1D1D1D] text-[12px] font-medium flex gap-2 items-center">
//                                             <span className="bg-[#039855] w-2 h-2 rounded-full"></span> Available
//                                         </h3>
//                                     </div>
//                                 </div>
//
//                                 {/* Schedule Section */}
//                                 {/*<div className="w-1/2 flex flex-col gap-2">*/}
//                                 {/*    {getScheduleForDate(selectedDate).map((slot: {*/}
//                                 {/*        type: string;*/}
//                                 {/*        time: string;*/}
//                                 {/*        cab: string | number | bigint | boolean;*/}
//                                 {/*        duration: string | number | bigint | boolean;*/}
//                                 {/*    }, index: Key | null | undefined) => (*/}
//                                 {/*        <div*/}
//                                 {/*            key={index}*/}
//                                 {/*            className={`flex flex-row justify-between items-center gap-2 py-3 px-4 rounded-[20] ${*/}
//                                 {/*                slot.type === 'booked'*/}
//                                 {/*                    ? 'bg-[#FFA7A7]/50'*/}
//                                 {/*                    : slot.type === 'available'*/}
//                                 {/*                        ? 'bg-[#A7FFA7]/50'*/}
//                                 {/*                        : 'bg-[#FFCBA7]/50'*/}
//                                 {/*            }`}*/}
//                                 {/*        >*/}
//                                 {/*            <div className="flex flex-row gap-6 items-center">*/}
//                                 {/*                <div*/}
//                                 {/*                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black font-bold">*/}
//                                 {/*                    {slot.type === 'available' ? '+' : slot.time.slice(0, -3)}*/}
//                                 {/*                </div>*/}
//                                 {/*                <div className="flex flex-col">*/}
//                                 {/*                    <span*/}
//                                 {/*                        className="text-base text-[#1D1D1D] font-semibold">{slot.cab}</span>*/}
//                                 {/*                    <span className="text-sm text-[#1D1D1D]">{slot.duration}</span>*/}
//                                 {/*                </div>*/}
//                                 {/*            </div>*/}
//                                 {/*            <div className={`flex items-center gap-2 rounded-full px-3 py-1 shadow-md ${*/}
//                                 {/*                slot.type === 'booked'*/}
//                                 {/*                    ? 'bg-[#FFA7A7]'*/}
//                                 {/*                    : slot.type === 'available'*/}
//                                 {/*                        ? 'bg-[#A7FFA7]'*/}
//                                 {/*                        : 'bg-[#FFCBA7]'*/}
//                                 {/*            }`}>*/}
//                                 {/*                <span className="text-[#1D1D1D] text-[10px]">{slot.type}</span>*/}
//                                 {/*                <svg className="w-4 h-4 text-[#1D1D1D]" fill="none"*/}
//                                 {/*                     stroke="currentColor"*/}
//                                 {/*                     viewBox="0 0 24 24">*/}
//                                 {/*                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
//                                 {/*                          d="M19 9l-7 7-7-7"/>*/}
//                                 {/*                </svg>*/}
//                                 {/*            </div>*/}
//                                 {/*        </div>*/}
//                                 {/*    ))}*/}
//                                 {/*</div>*/}
//
//                                 <div className="w-1/2 bg-white/60 rounded-[30px] p-6 shadow-sm">
//                                     <div className="flex justify-between items-center mb-6">
//                                         <h3 className="text-xl font-bold">
//                                             Schedule for {selectedDate.format('DD MMM YYYY')}
//                                         </h3>
//                                         <div className="text-sm text-gray-500">
//                                             {selectedSlots.length} slots selected
//                                         </div>
//                                     </div>
//
//                                     <div
//                                         className="grid grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//                                         {TIME_SLOTS.map((slot) => {
//                                             const status = getSlotStatus(slot.start);
//
//                                             // Visual Styles
//                                             let bgClass = "bg-white border border-gray-200 hover:border-red-500 cursor-pointer";
//                                             let textClass = "text-gray-700";
//
//                                             if (status === 'booked') {
//                                                 bgClass = "bg-red-100 border-red-200 cursor-not-allowed opacity-60";
//                                                 textClass = "text-red-700";
//                                             } else if (status === 'pending') { // Selected by user
//                                                 bgClass = "bg-red-600 text-white shadow-md transform scale-[1.02]";
//                                                 textClass = "text-white";
//                                             }
//
//                                             return (
//                                                 <div
//                                                     key={slot.start}
//                                                     onClick={() => toggleSlot(slot.start)}
//                                                     className={`p-4 rounded-xl transition-all duration-200 flex justify-between items-center ${bgClass}`}
//                                                 >
//                                                     <span className={`font-semibold ${textClass}`}>{slot.label}</span>
//                                                     <span
//                                                         className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${
//                                                             status === 'booked' ? 'bg-red-200 text-red-800' :
//                                                                 status === 'pending' ? 'bg-white/20 text-white' :
//                                                                     'bg-green-100 text-green-700'
//                                                         }`}>
//                                                 {status === 'pending' ? 'Selected' : status}
//                                             </span>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//
//                                     <div className="mt-6 pt-4 border-t border-gray-200">
//                                         <div className="flex justify-between items-center mb-4">
//                                             <span className="text-lg font-medium">Estimated Cost:</span>
//                                             <span className="text-2xl font-bold text-[#DB2727]">
//                                         LKR {bookingState.totals.total.toLocaleString()}
//                                     </span>
//                                         </div>
//                                         <button
//                                             onClick={handleSubmitBooking}
//                                             disabled={bookingMutation.isPending || selectedSlots.length === 0}
//                                             className="w-full bg-[#DB2727] text-white font-bold text-lg py-3 rounded-full hover:bg-red-700 transition disabled:bg-gray-400"
//                                         >
//                                             {bookingMutation.isPending ? "Confirming..." : "Confirm Booking"}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//
//
//                         </div>
//                     </section>
//
//
//                 </main>
//             </div>
//             <style jsx global>{`
//                 .glass-calendar .ant-picker-calendar-header {
//                     padding-bottom: 20px;
//                 }
//
//                 .glass-calendar .ant-picker-panel {
//                     background: transparent !important;
//                 }
//
//                 .glass-calendar .ant-picker-calendar-date {
//                     height: 70px !important;
//                     width: 60%;
//                 }
//             `}</style>
//         </div>
//     );
// }
//
// export default ServiceParkBooking;
//

//
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
//
// "use client"
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { Badge, Calendar, ConfigProvider, Select, Spin } from "antd";
// import dayjs from "dayjs";
// import { useSelector } from "react-redux";
// import { useToast } from "@/hooks/useToast";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//     useBookingAvailability,
//     useBranchDetails,
//     useBranches,
//     useDailyBookings,
//     useSubmitBooking
// } from "@/hooks/useServicePark";
// import { vehicleHistorySchema } from "../page";
// import FormField from "@/components/FormField";
// import Toast from "@/components/Toast";
//
// // --- Types ---
// interface TimeSlot {
//     start: string;
//     end: string;
//     label: string;
// }
//
// interface SlotStatus {
//     status: 'available' | 'booked' | 'pending';
//     data: any | null;
// }
//
// // --- Helper: Generate Slots ---
// const generateTimeSlots = (): TimeSlot[] => {
//     const slots = [];
//     let start = 8 * 60; // 8:00 AM
//     const end = 17 * 60; // 5:00 PM
//
//     while (start < end) {
//         const startH = Math.floor(start / 60).toString().padStart(2, '0');
//         const startM = (start % 60).toString().padStart(2, '0');
//         const endMins = start + 30;
//         const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
//         const endM = (endMins % 60).toString().padStart(2, '0');
//
//         slots.push({
//             start: `${startH}:${startM}`,
//             end: `${endH}:${endM}`,
//             label: `${startH}:${startM} - ${endH}:${endM}`
//         });
//         start += 30;
//     }
//     return slots;
// };
//
// const TIME_SLOTS = generateTimeSlots();
//
// const ServiceParkBooking = () => {
//     const { toast, showToast, hideToast } = useToast();
//     const bookingState = useSelector((state: any) => state.booking);
//
//     // --- State ---
//     const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
//     const [calendarMonth, setCalendarMonth] = useState<string>(dayjs().format('YYYY-MM'));
//     const selectedDateString = selectedDate.format('YYYY-MM-DD');
//
//     const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
//     const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
//     const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
//     const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // Array of start times
//
//     // --- Form ---
//     const { register, setValue } = useForm({
//         resolver: zodResolver(vehicleHistorySchema),
//         defaultValues: {
//             vehicle_no: "", owner_name: "", contact_no: "",
//             mileage: "", oil_type: "", service_center: "", service_advisor: ""
//         }
//     });
//
//     useEffect(() => {
//         if (bookingState.isFromServicePark && bookingState.vehicleData) {
//             const vData = bookingState.vehicleData;
//             Object.keys(vData).forEach((key) => setValue(key as any, vData[key]));
//         }
//     }, [bookingState, setValue]);
//
//     // --- Queries ---
//     const { data: branches } = useBranches();
//     const { data: branchDetails } = useBranchDetails(selectedBranchId!);
//
//     const serviceTypes = React.useMemo(() => {
//         if (!branchDetails?.serviceLines) return [];
//         const types = new Set(branchDetails.serviceLines.map((l: any) => l.type));
//         return Array.from(types).map(t => ({ value: t, label: t }));
//     }, [branchDetails]);
//
//     const serviceLines = React.useMemo(() => {
//         if (!branchDetails?.serviceLines || !selectedServiceType) return [];
//         return branchDetails.serviceLines
//             .filter((l: any) => l.type === selectedServiceType && l.status === 'ACTIVE')
//             .map((l: any) => ({ value: l.id, label: `${l.name} (${l.advisor})` }));
//     }, [branchDetails, selectedServiceType]);
//
//     const { data: availabilityData } = useBookingAvailability(selectedBranchId, selectedLineId, calendarMonth);
//     const { data: dailyBookings, isLoading: loadingSlots } = useDailyBookings(selectedBranchId, selectedLineId, selectedDateString);
//     const bookingMutation = useSubmitBooking();
//
//     // --- Handlers ---
//     const disabledDate = (current: dayjs.Dayjs) => {
//         if (!availabilityData?.unavailableDates) return false;
//         const dateStr = current.format('YYYY-MM-DD');
//         return availabilityData.unavailableDates.some((d: any) => d.date === dateStr);
//     };
//
//     const dateCellRender = (date: dayjs.Dayjs) => {
//         const dateStr = date.format('YYYY-MM-DD');
//         const dotColors = availabilityData?.dots?.[dateStr] || [];
//         return (
//             <div className="flex justify-center items-end h-full pb-1 gap-1">
//                 {dotColors.slice(0, 3).map((color: string, i: number) => (
//                     <span key={i} className={`w-1.5 h-1.5 rounded-full ${
//                         color === 'green' ? 'bg-[#039855]' : color === 'red' ? 'bg-[#DB2727]' : 'bg-[#FF961B]'
//                     }`} />
//                 ))}
//             </div>
//         );
//     };
//
//     const handleSelectDate = (value: dayjs.Dayjs) => {
//         setSelectedDate(value);
//         setSelectedSlots([]); // Clear slots on date change
//     };
//
//     // --- FIX: Ensure consistent return type (Object) ---
//     const getSlotStatus = (slotStart: string): SlotStatus => {
//         // If data isn't loaded yet, default to available object structure
//         if (!dailyBookings) return { status: 'available', data: null };
//
//         // Check if booked in DB
//         const booking = dailyBookings.find((b: any) => b.start_time.substring(0, 5) === slotStart);
//         if (booking) return { status: 'booked', data: booking };
//
//         // Check if currently selected by user
//         if (selectedSlots.includes(slotStart)) return { status: 'pending', data: null };
//
//         // Default available
//         return { status: 'available', data: null };
//     };
//
//     const toggleSlot = (start: string) => {
//         const { status } = getSlotStatus(start);
//
//         // Prevent toggling if already booked in DB
//         if (status === 'booked') return;
//
//         setSelectedSlots(prev =>
//             prev.includes(start)
//                 ? prev.filter(s => s !== start)
//                 : [...prev, start]
//         );
//     };
//
//     const handleSubmitBooking = () => {
//         if (!selectedBranchId || !selectedLineId || selectedSlots.length === 0) {
//             showToast("Please select slots", "error");
//             return;
//         }
//         const slotsPayload = selectedSlots.map(start => {
//             const slotObj = TIME_SLOTS.find(ts => ts.start === start);
//             return { start: slotObj?.start, end: slotObj?.end };
//         });
//
//         bookingMutation.mutate({
//             branch_id: selectedBranchId,
//             service_line_id: selectedLineId,
//             booking_date: selectedDateString,
//             slots: slotsPayload,
//             vehicle_no: bookingState.vehicleData?.vehicle_no,
//             customer_id: bookingState.vehicleData?.customer_id,
//         }, {
//             onSuccess: () => {
//                 showToast("Booking created successfully", "success");
//                 setSelectedSlots([]);
//             },
//             onError: (err: any) => showToast(err.response?.data?.message || "Failed", "error")
//         });
//     };
//
//     return (
//         <div className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden pb-20">
//             <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
//
//             <div className="max-w-[1800px] mx-auto container pt-30 px-16">
//                 <h1 className="text-2xl font-extrabold mb-8">Indra Service Park Sales Dashboard</h1>
//
//                 {/* 1. Vehicle Details (Read Only / Prefilled) */}
//                 <section className="bg-white/60 rounded-[45px] px-14 py-10 mb-8 border border-white shadow-sm">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="font-semibold text-[22px]">Last Service Details</h2>
//                     </div>
//                     <div className="grid grid-cols-4 gap-6 opacity-80 pointer-events-none">
//                         <FormField label="Mileage" register={register("mileage")} />
//                         <FormField label="Oil Type" register={register("oil_type")} />
//                         <FormField label="Service Center" register={register("service_center")} />
//                         <FormField label="Service Advisor" register={register("service_advisor")} />
//                     </div>
//                 </section>
//
//                 {/* 2. Main Schedule Section */}
//                 <section className="bg-white/60 rounded-[45px] px-14 py-12 mb-8 border border-white shadow-sm">
//
//                     {/* Header Controls */}
//                     <div className="flex items-center justify-between mb-12">
//                         <h2 className="font-bold text-[28px] text-[#101828]">Service Schedule</h2>
//
//                         <div className="flex gap-4">
//                             <Select
//                                 className="w-48 h-10 custom-select"
//                                 placeholder="Select Branch"
//                                 bordered={false}
//                                 suffixIcon={<Image src="/chevron-down.svg" alt="down" width={12} height={12} />}
//                                 options={branches?.map((b: any) => ({value: b.id, label: b.name}))}
//                                 onChange={(val) => { setSelectedBranchId(val); setSelectedServiceType(null); setSelectedLineId(null); }}
//                             />
//                             <Select
//                                 className="w-40 h-10 custom-select"
//                                 placeholder="Service Type"
//                                 bordered={false}
//                                 disabled={!selectedBranchId}
//                                 suffixIcon={<Image src="/chevron-down.svg" alt="down" width={12} height={12} />}
//                                 options={serviceTypes}
//                                 value={selectedServiceType}
//                                 onChange={(val) => { setSelectedServiceType(val); setSelectedLineId(null); }}
//                             />
//                             <Select
//                                 className="w-48 h-10 custom-select"
//                                 placeholder="Select Line"
//                                 bordered={false}
//                                 disabled={!selectedServiceType}
//                                 suffixIcon={<Image src="/chevron-down.svg" alt="down" width={12} height={12} />}
//                                 options={serviceLines}
//                                 value={selectedLineId}
//                                 onChange={setSelectedLineId}
//                             />
//                         </div>
//                     </div>
//
//                     <div className="flex flex-col lg:flex-row gap-16">
//                         {/* LEFT: Calendar */}
//                         <div className="w-full lg:w-5/12">
//                             <ConfigProvider theme={{ token: { colorPrimary: '#DB2727', fontFamily: 'Montserrat' } }}>
//                                 <Calendar
//                                     value={selectedDate}
//                                     onSelect={handleSelectDate}
//                                     onPanelChange={(val) => { setCalendarMonth(val.format('YYYY-MM')); setSelectedDate(val); }}
//                                     cellRender={dateCellRender}
//                                     disabledDate={disabledDate}
//                                     fullscreen={false}
//                                     className="custom-calendar"
//                                     headerRender={({ value, onChange }) => {
//                                         const current = value.clone();
//                                         return (
//                                             <div className="flex items-center justify-between mb-6 px-2">
//                                                 <span className="text-xl font-bold text-gray-900">
//                                                     {current.format('MMMM YYYY')}
//                                                 </span>
//                                                 <div className="flex gap-4">
//                                                     <button onClick={() => onChange(current.subtract(1, 'month'))}>
//                                                         <Image src="/prev-arrow-red.svg" alt="prev" width={24} height={24} />
//                                                     </button>
//                                                     <button onClick={() => onChange(current.add(1, 'month'))}>
//                                                         <Image src="/next-arrow-red.svg" alt="next" width={24} height={24} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         );
//                                     }}
//                                 />
//                             </ConfigProvider>
//
//                             {/* Legend */}
//                             <div className="flex gap-6 mt-8 pl-4">
//                                 <div className="flex items-center gap-2">
//                                     <span className="w-2.5 h-2.5 rounded-full bg-[#DB2727]"></span>
//                                     <span className="text-sm font-medium text-gray-600">Booked</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="w-2.5 h-2.5 rounded-full bg-[#FF961B]"></span>
//                                     <span className="text-sm font-medium text-gray-600">Pending</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="w-2.5 h-2.5 rounded-full bg-[#039855]"></span>
//                                     <span className="text-sm font-medium text-gray-600">Available</span>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* RIGHT: Time Slots (Figma Accurate) */}
//                         <div className="w-full lg:w-7/12 relative">
//                             {/* Timeline Decoration Line */}
//                             <div className="absolute left-[60px] top-0 bottom-0 w-[1px] bg-gray-200 hidden md:block"></div>
//
//                             <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
//                                 {loadingSlots ? (
//                                     <div className="flex justify-center py-20"><Spin size="large" /></div>
//                                 ) : (
//                                     TIME_SLOTS.map((slot) => {
//                                         const { status, data } = getSlotStatus(slot.start);
//
//                                         // Dynamic Styling based on Status
//                                         let cardBg = "bg-[#D1FADF]"; // Green (Available)
//                                         let badgeBg = "bg-[#A6F4C5]";
//                                         let badgeText = "Available";
//                                         let badgeTextColor = "text-[#027A48]";
//                                         let iconColorClass = "bg-[#12B76A]"; // Green icon
//
//                                         if (status === 'booked') {
//                                             cardBg = "bg-[#FFD8D8]"; // Red (Booked)
//                                             badgeBg = "bg-[#FFBABA]";
//                                             badgeText = "Booked";
//                                             badgeTextColor = "text-[#7F1D1D]";
//                                             iconColorClass = "bg-[#F04438]"; // Red icon
//                                         } else if (status === 'pending') {
//                                             cardBg = "bg-[#FFECD1]"; // Orange (Pending/Selected)
//                                             badgeBg = "bg-[#FFD8A8]";
//                                             badgeText = "Pending";
//                                             badgeTextColor = "text-[#7C2D12]";
//                                             iconColorClass = "bg-[#F79009]"; // Orange icon
//                                         }
//
//                                         return (
//                                             <div key={slot.start} className="flex items-center gap-6 relative group">
//                                                 {/* Time Label (Left) */}
//                                                 <div className="w-[60px] text-right font-medium text-gray-500 text-lg">
//                                                     {slot.start}
//                                                 </div>
//
//                                                 {/* Card */}
//                                                 <div
//                                                     onClick={() => toggleSlot(slot.start)}
//                                                     className={`flex-1 rounded-[20px] p-4 flex justify-between items-center transition-all duration-200 ${cardBg} ${status !== 'booked' ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-90'}`}
//                                                 >
//                                                     {/* Left Content */}
//                                                     <div className="flex items-center gap-4">
//                                                         {/* Circle Icon */}
//                                                         <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white font-bold text-lg ${iconColorClass}`}>
//                                                             {status === 'available' ? '+' : (data ? dayjs(data.booking_date).date() : selectedDate.date())}
//                                                         </div>
//
//                                                         {/* Text Info */}
//                                                         <div>
//                                                             <h4 className="font-bold text-lg text-gray-900">
//                                                                 {status === 'booked'
//                                                                     ? `CAB - ${(data as any)?.vehicle_no || 'Unknown'}`
//                                                                     : status === 'pending'
//                                                                         ? `CAB - ${bookingState.vehicleData?.vehicle_no || 'You'}`
//                                                                         : 'Available'}
//                                                             </h4>
//                                                             <p className="text-gray-600 text-sm font-medium">{slot.label}</p>
//                                                         </div>
//                                                     </div>
//
//                                                     {/* Right Badge */}
//                                                     <div className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${badgeBg} ${badgeTextColor}`}>
//                                                         {badgeText}
//                                                         <Image src="/chevron-down-mini.svg" alt="v" width={10} height={10} className="opacity-60" />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })
//                                 )}
//                             </div>
//
//                             {/* Footer Action */}
//                             <div className="mt-8 pl-[80px] flex justify-between items-center border-t border-gray-200 pt-6">
//                                 <div>
//                                     <p className="text-gray-500 text-sm">Total Estimate</p>
//                                     <p className="text-[#DB2727] font-bold text-2xl">LKR {bookingState.totals.total.toLocaleString()}</p>
//                                 </div>
//                                 <button
//                                     onClick={handleSubmitBooking}
//                                     disabled={bookingMutation.isPending || selectedSlots.length === 0}
//                                     className="bg-[#DB2727] text-white px-10 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400 shadow-lg shadow-red-200"
//                                 >
//                                     {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//
//             {/* Global Styles for AntD Calendar overrides */}
//             <style jsx global>{`
//                 .custom-calendar .ant-picker-calendar-header {
//                     display: none; /* Hide default header as we built custom one */
//                 }
//                 .custom-calendar .ant-picker-body {
//                     padding: 0 !important;
//                 }
//                 .custom-calendar .ant-picker-content th {
//                     color: #9CA3AF !important;
//                     font-size: 12px;
//                     font-weight: 600;
//                 }
//                 .custom-calendar .ant-picker-cell {
//                     border-top: 1px solid #F3F4F6;
//                     color: #1F2937;
//                 }
//                 .custom-calendar .ant-picker-cell-inner {
//                     height: 80px !important;
//                     display: flex;
//                     flex-direction: column;
//                     justify-content: space-between;
//                     padding: 4px !important;
//                 }
//                 .custom-calendar .ant-picker-cell-selected .ant-picker-cell-inner {
//                     background: #FEF2F2 !important;
//                 }
//                 .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
//                     border: 1px solid #DB2727 !important;
//                 }
//
//                 /* Custom Select Dropdowns */
//                 .custom-select .ant-select-selector {
//                     background-color: transparent !important;
//                     border: none !important;
//                     font-size: 20px !important;
//                     font-weight: 600 !important;
//                     color: #101828 !important;
//                     padding: 0 !important;
//                     box-shadow: none !important;
//                 }
//             `}</style>
//         </div>
//     );
// }
//
// export default ServiceParkBooking;


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Badge, Calendar, ConfigProvider, Select, Spin} from "antd";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {useToast} from "@/hooks/useToast";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
    useBookingAvailability,
    useBranchDetails,
    useBranches,
    useDailyBookings,
    useSubmitBooking
} from "@/hooks/useServicePark";
import {vehicleHistorySchema} from "../page";
import FormField from "@/components/FormField";
import Toast from "@/components/Toast";

// --- Types ---
interface TimeSlot {
    start: string;
    end: string;
    label: string;
}

interface SlotStatus {
    status: 'available' | 'booked' | 'pending';
    data: any | null;
}

// --- Helper: Generate Slots ---
const generateTimeSlots = (): TimeSlot[] => {
    const slots = [];
    let start = 8 * 60; // 8:00 AM
    const end = 17 * 60; // 5:00 PM

    while (start < end) {
        const startH = Math.floor(start / 60).toString().padStart(2, '0');
        const startM = (start % 60).toString().padStart(2, '0');
        const endMins = start + 30;
        const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
        const endM = (endMins % 60).toString().padStart(2, '0');

        slots.push({
            start: `${startH}:${startM}`,
            end: `${endH}:${endM}`,
            label: `${startH}:${startM} - ${endH}:${endM}`
        });
        start += 30;
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots();

const ServiceParkBooking = () => {
    const {toast, showToast, hideToast} = useToast();
    const bookingState = useSelector((state: any) => state.booking);

    // --- State ---
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [calendarMonth, setCalendarMonth] = useState<string>(dayjs().format('YYYY-MM'));
    const selectedDateString = selectedDate.format('YYYY-MM-DD');

    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // Array of start times

    // --- Form ---
    const {register, setValue} = useForm({
        resolver: zodResolver(vehicleHistorySchema),
        defaultValues: {
            vehicle_no: "", owner_name: "", contact_no: "",
            mileage: "", oil_type: "", service_center: "", service_advisor: ""
        }
    });

    // --- Queries ---
    const {data: branches} = useBranches();
    const {data: branchDetails} = useBranchDetails(selectedBranchId!);

    // --- Effect 1: Hydrate Form Data from Redux ---
    useEffect(() => {
        if (bookingState.isFromServicePark && bookingState.vehicleData) {
            const vData = bookingState.vehicleData;
            Object.keys(vData).forEach((key) => setValue(key as any, vData[key]));
        }
    }, [bookingState, setValue]);

    // --- Effect 2: Auto-Select Branch based on Form Data ---
    useEffect(() => {
        // Only run if branches are loaded and we haven't selected one yet (or want to overwrite)
        if (branches && branches.length > 0 && bookingState.vehicleData?.service_center) {
            const formBranchName = bookingState.vehicleData.service_center;

            // Find the branch ID that matches the name in the form
            const matchedBranch = branches.find((b: any) =>
                b.name.toLowerCase().trim() === formBranchName.toLowerCase().trim()
            );

            if (matchedBranch) {
                setSelectedBranchId(matchedBranch.id);
            }
        }
    }, [branches, bookingState.vehicleData]);

    const serviceTypes = React.useMemo(() => {
        if (!branchDetails?.serviceLines) return [];
        const types = new Set(branchDetails.serviceLines.map((l: any) => l.type));
        return Array.from(types).map(t => ({value: t, label: t}));
    }, [branchDetails]);

    const serviceLines = React.useMemo(() => {
        if (!branchDetails?.serviceLines || !selectedServiceType) return [];
        return branchDetails.serviceLines
            .filter((l: any) => l.type === selectedServiceType && l.status === 'ACTIVE')
            .map((l: any) => ({value: l.id, label: `${l.name} (${l.advisor})`}));
    }, [branchDetails, selectedServiceType]);

    const {data: availabilityData} = useBookingAvailability(selectedBranchId, selectedLineId, calendarMonth);
    const {
        data: dailyBookings,
        isLoading: loadingSlots
    } = useDailyBookings(selectedBranchId, selectedLineId, selectedDateString);
    const bookingMutation = useSubmitBooking();

    // --- Handlers ---
    const disabledDate = (current: dayjs.Dayjs) => {
        if (!availabilityData?.unavailableDates) return false;
        const dateStr = current.format('YYYY-MM-DD');
        return availabilityData.unavailableDates.some((d: any) => d.date === dateStr);
    };

    const dateCellRender = (date: dayjs.Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const dotColors = availabilityData?.dots?.[dateStr] || [];
        return (
            <div className="flex justify-center items-end h-full pb-1 gap-1">
                {dotColors.slice(0, 3).map((color: string, i: number) => ( // Limit to 3 dots for UI
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${
                        color === 'green' ? 'bg-[#039855]' : color === 'red' ? 'bg-[#DB2727]' : 'bg-[#FF961B]'
                    }`}/>
                ))}
            </div>
        );
    };

    const handleSelectDate = (value: dayjs.Dayjs) => {
        setSelectedDate(value);
        setSelectedSlots([]); // Clear slots on date change
    };

    // --- FIX: Ensure consistent return type (Object) ---
    const getSlotStatus = (slotStart: string): SlotStatus => {
        if (!dailyBookings) return { status: 'available', data: null };

        const booking = dailyBookings.find((b: any) => b.start_time.substring(0, 5) === slotStart);
        if (booking) return { status: 'booked', data: booking };

        if (selectedSlots.includes(slotStart)) return { status: 'pending', data: null };
        return { status: 'available', data: null };
    };

    const toggleSlot = (start: string) => {
        const { status } = getSlotStatus(start);
        if (status === 'booked') return;
        setSelectedSlots(prev => prev.includes(start) ? prev.filter(s => s !== start) : [...prev, start]);
    };

    const handleSubmitBooking = () => {
        if (!selectedBranchId || !selectedLineId || selectedSlots.length === 0) {
            showToast("Please select slots", "error");
            return;
        }
        const slotsPayload = selectedSlots.map(start => {
            const slotObj = TIME_SLOTS.find(ts => ts.start === start);
            return { start: slotObj?.start, end: slotObj?.end };
        });

        bookingMutation.mutate({
            branch_id: selectedBranchId,
            service_line_id: selectedLineId,
            booking_date: selectedDateString,
            slots: slotsPayload,
            vehicle_no: bookingState.vehicleData?.vehicle_no,
            customer_id: bookingState.vehicleData?.customer_id,
        }, {
            onSuccess: () => {
                showToast("Booking created successfully", "success");
                setSelectedSlots([]);
            },
            onError: (err: any) => showToast(err.response?.data?.message || "Failed", "error")
        });
    };

    return (
        <div className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden pb-20">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />

            <div className="max-w-[1800px] mx-auto container pt-30 px-16">
                <h1 className="text-2xl font-extrabold mb-8">Indra Service Park Sales Dashboard</h1>

                {/* 1. Vehicle Details (Read Only / Prefilled) */}
                <section className="bg-white/60 rounded-[45px] px-14 py-10 mb-8 border border-white shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-[22px]">Last Service Details</h2>
                    </div>
                    <div className="grid grid-cols-4 gap-6 opacity-80 pointer-events-none">
                        <FormField label="Mileage" register={register("mileage")} />
                        <FormField label="Oil Type" register={register("oil_type")} />
                        <FormField label="Service Center" register={register("service_center")} />
                        <FormField label="Service Advisor" register={register("service_advisor")} />
                    </div>
                </section>

                {/* 2. Main Schedule Section */}
                <section className="bg-white/60 rounded-[45px] px-14 py-12 mb-8 border border-white shadow-sm">

                    {/* Header Controls */}
                    <div className="flex items-center justify-left gap-[80px] mb-12">
                        <h2 className="font-bold text-[28px] text-[#101828]">Service Schedule</h2>

                        <div className="flex gap-4">
                            <Select
                                className="w-30 h-10 custom-select"
                                placeholder="Select Branch"
                                bordered={false}
                                suffixIcon={<svg className="" width="10" height="6"
                                                 viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                          fill="#575757"/>
                                </svg>}
                                options={branches?.map((b: any) => ({value: b.id, label: b.name}))}
                                // ADDED: Value prop binding
                                value={selectedBranchId}
                                onChange={(val) => {
                                    setSelectedBranchId(val);
                                    setSelectedServiceType(null);
                                    setSelectedLineId(null);
                                }}
                            />
                            <Select
                                className="w-30 h-10 custom-select"
                                placeholder="Service Type"
                                bordered={false}
                                disabled={!selectedBranchId}
                                suffixIcon={<svg className="" width="10" height="6"
                                                 viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                          fill="#575757"/>
                                </svg>}
                                options={serviceTypes}
                                value={selectedServiceType}
                                onChange={(val) => { setSelectedServiceType(val); setSelectedLineId(null); }}
                            />
                            <Select
                                className="w-30 h-10 custom-select"
                                placeholder="Select Line"
                                bordered={false}
                                disabled={!selectedServiceType}
                                suffixIcon={<svg className="" width="10" height="6"
                                                 viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                          fill="#575757"/>
                                </svg>}
                                options={serviceLines}
                                value={selectedLineId}
                                onChange={setSelectedLineId}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* LEFT: Calendar */}
                        <div className="w-full lg:w-5/12">
                            <ConfigProvider theme={{ token: { colorPrimary: '#DB2727', fontFamily: 'Montserrat' } }}>
                                <Calendar
                                    value={selectedDate}
                                    onSelect={handleSelectDate}
                                    onPanelChange={(val) => { setCalendarMonth(val.format('YYYY-MM')); setSelectedDate(val); }}
                                    cellRender={dateCellRender}
                                    disabledDate={disabledDate}
                                    fullscreen={false}
                                    className="custom-calendar"
                                    headerRender={({ value, onChange }) => {
                                        const current = value.clone();
                                        return (
                                            <div className="flex items-center justify-between mb-6 px-2">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {current.format('MMMM YYYY')}
                                                </span>
                                                <div className="flex gap-4">
                                                    <button onClick={() => onChange(current.subtract(1, 'month'))}>
                                                        <Image src="/prev-arrow.svg" alt="prev" width={24} height={24} className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => onChange(current.add(1, 'month'))}>
                                                        <Image src="/next-arrow.svg" alt="next" width={24} height={24} className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </ConfigProvider>

                            {/* Legend */}
                            <div className="flex gap-6 mt-8 pl-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#DB2727]"></span>
                                    <span className="text-sm font-medium text-gray-600">Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF961B]"></span>
                                    <span className="text-sm font-medium text-gray-600">Pending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#039855]"></span>
                                    <span className="text-sm font-medium text-gray-600">Available</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Time Slots (Figma Accurate) */}
                        <div className="w-full lg:w-7/12 relative">
                            {/* Timeline Decoration Line */}
                            <div className="absolute left-[60px] top-0 bottom-0 w-[1px] bg-gray-200 hidden md:block"></div>

                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                {loadingSlots ? (
                                    <div className="flex justify-center py-20"><Spin size="large" /></div>
                                ) : (
                                    TIME_SLOTS.map((slot) => {
                                        const { status, data } = getSlotStatus(slot.start);

                                        // Dynamic Styling based on Status
                                        let cardBg = "bg-[#D1FADF]"; // Green (Available)
                                        let badgeBg = "bg-[#A6F4C5]";
                                        let badgeText = "Available";
                                        let badgeTextColor = "text-[#027A48]";
                                        let iconColorClass = "bg-[#12B76A]"; // Green icon

                                        if (status === 'booked') {
                                            cardBg = "bg-[#FFD8D8]"; // Red (Booked)
                                            badgeBg = "bg-[#FFBABA]";
                                            badgeText = "Booked";
                                            badgeTextColor = "text-[#7F1D1D]";
                                            iconColorClass = "bg-[#F04438]"; // Red icon
                                        } else if (status === 'pending') {
                                            cardBg = "bg-[#FFECD1]"; // Orange (Pending/Selected)
                                            badgeBg = "bg-[#FFD8A8]";
                                            badgeText = "Pending";
                                            badgeTextColor = "text-[#7C2D12]";
                                            iconColorClass = "bg-[#F79009]"; // Orange icon
                                        }

                                        return (
                                            <div key={slot.start} className="flex items-center gap-6 relative group">
                                                {/* Time Label (Left) */}
                                                <div className="w-[60px] text-right font-medium text-gray-500 text-lg">
                                                    {slot.start}
                                                </div>

                                                {/* Card */}
                                                <div
                                                    onClick={() => toggleSlot(slot.start)}
                                                    className={`flex-1 rounded-[20px] p-4 flex justify-between items-center transition-all duration-200 ${cardBg} ${status !== 'booked' ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-90'}`}
                                                >
                                                    {/* Left Content */}
                                                    <div className="flex items-center gap-4">
                                                        {/* Circle Icon */}
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white font-bold text-lg ${iconColorClass}`}>
                                                            {status === 'available' ? '+' : (data ? dayjs(data.booking_date).date() : selectedDate.date())}
                                                        </div>

                                                        {/* Text Info */}
                                                        <div>
                                                            <h4 className="font-bold text-lg text-gray-900">
                                                                {status === 'booked'
                                                                    ? `${(data as any)?.vehicle_no || 'Unknown'}`
                                                                    : status === 'pending'
                                                                        ? `${bookingState.vehicleData?.vehicle_no || 'You'}`
                                                                        : 'Available'}
                                                            </h4>
                                                            <p className="text-gray-600 text-sm font-medium">{slot.label}</p>
                                                        </div>
                                                    </div>

                                                    {/* Right Badge */}
                                                    <div className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${badgeBg} ${badgeTextColor}`}>
                                                        {badgeText}
                                                        {/*<Image src="/chevron-down-mini.svg" alt="v" width={10} height={10} className="opacity-60" />*/}
                                                        <svg className="" width="10" height="6"
                                                             viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                                  fill="#575757"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer Action */}
                            <div className="mt-8 pl-[80px] flex justify-between items-center border-t border-gray-200 pt-6">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Estimate</p>
                                    <p className="text-[#DB2727] font-bold text-2xl">LKR {bookingState.totals.total.toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={handleSubmitBooking}
                                    disabled={bookingMutation.isPending || selectedSlots.length === 0}
                                    className="bg-[#DB2727] text-white px-10 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400 shadow-lg shadow-red-200"
                                >
                                    {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Global Styles for AntD Calendar overrides */}
            <style jsx global>{`
                .custom-calendar .ant-picker-calendar-header {
                    display: none; /* Hide default header as we built custom one */
                }
                .custom-calendar .ant-picker-body {
                    padding: 0 !important;
                }
                .custom-calendar .ant-picker-content th {
                    color: #9CA3AF !important;
                    font-size: 12px;
                    font-weight: 600;
                }
                .custom-calendar .ant-picker-cell {
                    border-top: 1px solid #F3F4F6;
                    color: #1F2937;
                }
                .custom-calendar .ant-picker-cell-inner {
                    height: 80px !important;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 4px !important;
                }
                .custom-calendar .ant-picker-cell-selected .ant-picker-cell-inner {
                    background: #FEF2F2 !important;
                }
                .custom-calendar .ant-picker-cell-today .ant-picker-cell-inner {
                    border: 1px solid #DB2727 !important;
                }

                /* Custom Select Dropdowns */
                .custom-select .ant-select-selector {
                    background-color: transparent !important;
                    border: none !important;
                    font-size: 20px !important;
                    font-weight: 600 !important;
                    color: #101828 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
            `}</style>
        </div>
    );
}

export default ServiceParkBooking;