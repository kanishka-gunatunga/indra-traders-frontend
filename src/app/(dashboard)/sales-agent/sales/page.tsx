// "use client";
//
// import Modal from "@/components/Modal";
// import Header from "@/components/Header";
// import {TicketCardProps} from "@/components/TicketCard";
// import {TicketColumn} from "@/components/TicketColumn";
// import {DragDropContext, DropResult} from "@hello-pangea/dnd";
// import Image from "next/image";
// import React, {useState} from "react";
// import Select from "react-select";
// import {Role} from "@/types/role";
// import {useCreateVehicleSale, useUpdateSaleStatus, useVehicleSales} from "@/hooks/useVehicleSales";
//
// type OptionType = { value: string; label: string };
//
// const vehicleMakes = [
//     {value: "Toyota", label: "Toyota"},
//     {value: "Nissan", label: "Nissan"},
//     {value: "Honda", label: "Honda"},
// ];
//
// const vehicleModels = [
//     {value: "Corolla", label: "Corolla"},
//     {value: "Civic", label: "Civic"},
//     {value: "Navara", label: "Navara"},
// ];
//
// export default function SalesDashboard() {
//     const [role, setRole] = useState<Role>(
//         process.env.NEXT_PUBLIC_USER_ROLE as Role
//     );
//
//     const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
//
//     const [customerName, setCustomerName] = useState("");
//     const [contactNumber, setContactNumber] = useState("");
//     const [email, setEmail] = useState("");
//     const [city, setCity] = useState("");
//     const [leadSource, setLeadSource] = useState("");
//     const [remark, setRemark] = useState("");
//     const [priority, setPriority] = useState("P0");
//     const [vehicleType, setVehicleType] = useState("");
//     const [selectedMake, setSelectedMake] = useState<OptionType | null>(null);
//     const [selectedModel, setSelectedModel] = useState<OptionType | null>(null);
//
//     const {data: sales = [], isLoading, error} = useVehicleSales();
//     const createSaleMutation = useCreateVehicleSale();
//     const updateStatusMutation = useUpdateSaleStatus();
//
//     const tickets: TicketCardProps[] = sales.map((sale) => {
//         let displayStatus = sale.status;
//         // Normalize backend status to frontend column titles
//         if (sale.status === "NEW") displayStatus = "New";
//         else if (sale.status === "ONGOING") displayStatus = "Ongoing";
//         else if (sale.status === "COMPLETED") {
//             // Assuming additional_note indicates Won/Lost; adjust if needed
//             displayStatus = sale.additional_note === "Won" ? "Won" : "Lost";
//         }
//
//         return {
//             id: sale.ticket_number,
//             priority: sale.priority,
//             user: sale.customer?.customer_name || "Unknown",
//             phone: sale.customer?.phone_number || "N/A",
//             date: new Date(sale.date).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"}),
//             status: displayStatus,
//         };
//     });
//
//     console.log("-----tickets:", tickets);
//
//     const allowedTransitions: Record<
//         TicketCardProps["status"],
//         TicketCardProps["status"][]
//     > = {
//         New: ["Ongoing"],
//         Ongoing: ["Won", "Lost"],
//         Won: [],
//         Lost: [],
//     };
//
//     const onDragEnd = (result: DropResult) => {
//         const {destination, source, draggableId} = result;
//         if (!destination) return;
//         if (
//             destination.droppableId === source.droppableId &&
//             destination.index === source.index
//         )
//             return;
//
//         const ticket = tickets.find((t) => t.id === draggableId);
//         if (!ticket) return;
//
//         const currentStatus = ticket.status;
//         const newStatus = destination.droppableId as TicketCardProps["status"];
//         if (allowedTransitions[currentStatus].includes(newStatus)) {
//             // Find the sale by ticket_number
//             const sale = sales.find((s) => s.ticket_number === draggableId);
//             if (sale) {
//                 const statusMap: Record<TicketCardProps["status"], string> = {
//                     New: "NEW",
//                     Ongoing: "ONGOING",
//                     Won: "COMPLETED",
//                     Lost: "COMPLETED",
//                 };
//                 updateStatusMutation.mutate({id: sale.id, status: statusMap[newStatus]});
//             }
//         }
//     };
//
//     const handleAddLead = async () => {
//         if (!customerName || !contactNumber || !selectedMake || !selectedModel) {
//             alert("Please fill required fields");
//             return;
//         }
//
//         try {
//             await createSaleMutation.mutateAsync({
//                 date: new Date().toISOString().split("T")[0],
//                 customer_name: customerName,
//                 contact_number: contactNumber,
//                 email,
//                 city,
//                 call_agent_id: 1, // Default or from role
//                 vehicle_make: selectedMake.value,
//                 vehicle_model: selectedModel.value,
//                 manufacture_year: 2025, // Default or from form
//                 transmission: "AUTO", // Default
//                 fuel_type: "PETROL", // Default
//                 down_payment: 0,
//                 price_from: 0,
//                 price_to: 0,
//                 additional_note: remark,
//                 priority,
//                 lead_source: leadSource,
//                 vehicle_type: vehicleType,
//             });
//             setIsAddLeadModalOpen(false);
//             // Reset form
//             setCustomerName("");
//             setContactNumber("");
//             setEmail("");
//             setCity("");
//             setLeadSource("");
//             setRemark("");
//             setPriority("P0");
//             setVehicleType("");
//             setSelectedMake(null);
//             setSelectedModel(null);
//         } catch (error: any) {
//             console.error("Error creating lead:", error);
//             alert(`Failed to create lead: ${error.response?.data?.message || error.message}`);
//         }
//     };
//
//     const columns: TicketCardProps["status"][] = [
//         "New",
//         "Ongoing",
//         "Won",
//         "Lost",
//     ];
//
//     if (isLoading) return <div>Loading sales...</div>;
//     if (error) return <div>Error loading sales: {error.message}</div>;
//
//     // Dummy data for Next Action and Upcoming Events - replace with queries if needed
//     const nextActionData = [
//         {
//             ticketNo: "ITPL122455874564",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//         {
//             ticketNo: "ITPL122455874595",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//         {
//             ticketNo: "ITPL122455874165",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//         {
//             ticketNo: "ITPL122455874505",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//     ];
//
//     const upcomingEventsData = [
//         {
//             customerName: "Emily Charlotte",
//             date: "March 15",
//             eventType: "BirthDay",
//         },
//         {
//             customerName: "Albert Flore",
//             date: "March 16",
//             eventType: "Reminder",
//         },
//         {
//             customerName: "Guy Hawkins",
//             date: "May 12",
//             eventType: "Reminder",
//         },
//         {
//             customerName: "Wade Warren",
//             date: "May 6",
//             eventType: "BirthDay",
//         },
//     ];
//
//     return (
//         <div
//             className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
//             <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
//                 <Header
//                     name="Sophie Eleanor"
//                     location="Bambalapitiya"
//                     title={
//                         role === "tele-marketer"
//                             ? "Indra Fast Track Sales Dashboard"
//                             : "Indra Traders Sales Dashboard"
//                     }
//                 />
//
//                 {/* Leads Section */}
//                 <section
//                     className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
//                     <div className="w-full flex justify-between items-center">
//                         <span className="font-semibold text-[22px]">Leads</span>
//                         <button
//                             className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
//                             onClick={() => setIsAddLeadModalOpen(true)}
//                             disabled={createSaleMutation.isPending}
//                         >
//                             <Image
//                                 src={"/images/sales/plus.svg"}
//                                 width={24}
//                                 height={24}
//                                 alt="Plus icon"
//                             />
//                         </button>
//                     </div>
//
//                     <DragDropContext onDragEnd={onDragEnd}>
//                         <div className="w-full mt-6 flex gap-6 overflow-x-auto ">
//                             {columns.map((col) => (
//                                 <TicketColumn
//                                     key={col}
//                                     title={col}
//                                     tickets={tickets.filter((t) => t.status === col)}
//                                 />
//                             ))}
//                         </div>
//                     </DragDropContext>
//                 </section>
//
//                 {/* Next action and Upcomming events */}
//                 <section className="relative  flex flex-wrap w-full mb-5 gap-3 justify-center items-center">
//                     <div
//                         className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
//                         <span className="font-semibold text-[22px]">Next Action</span>
//                         <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
//                             {/* Table header */}
//                             <div className="flex font-medium text-[#575757] min-w-[400px]">
//                                 <div className="w-1/3 px-2">Ticket No.</div>
//                                 <div className="w-1/3 px-2">Customer Name</div>
//                                 <div className="w-1/3 px-2">Conatct No.</div>
//                             </div>
//                             <hr className="border-gray-300 my-4"/>
//
//                             <div className="h-[100] overflow-y-auto no-scrollbar">
//                                 {/* Table rows */}
//                                 {nextActionData.map((item, idx) => (
//                                     <div
//                                         key={idx}
//                                         className={`flex ${
//                                             idx > 0 ? "mt-3" : ""
//                                         } font-medium text-black min-w-[400px]`}
//                                     >
//                                         <div className="w-1/3 px-2">{item.ticketNo}</div>
//                                         <div className="w-1/3 px-2">{item.name}</div>
//                                         <div className="w-1/3 px-2">{item.contactNo}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                     <div
//                         className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
//                         <span className="font-semibold text-[22px]">Upcoming Events</span>
//                         <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
//                             {/* Table header */}
//                             <div className="flex font-medium text-[#575757] min-w-[400px]">
//                                 <div className="w-1/3 px-2">Customer Name</div>
//                                 <div className="w-1/3 px-2">Date</div>
//                                 <div className="w-1/3 px-2">Event Type</div>
//                             </div>
//                             <hr className="border-gray-300 my-4"/>
//
//                             <div className="h-[100] overflow-y-auto no-scrollbar">
//                                 {/* Table rows */}
//                                 {upcomingEventsData.map((item, idx) => (
//                                     <div
//                                         key={idx}
//                                         className={`flex ${
//                                             idx > 0 ? "mt-3" : ""
//                                         } font-medium text-black min-w-[400px]`}
//                                     >
//                                         <div className="w-1/3 px-2">{item.customerName}</div>
//                                         <div className="w-1/3 px-2">{item.date}</div>
//                                         <div className="w-1/3 px-2">{item.eventType}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </main>
//
//             {/* Add Lead Modal */}
//             {isAddLeadModalOpen && (
//                 <Modal
//                     title="Add New Lead"
//                     onClose={() => setIsAddLeadModalOpen(false)}
//                     actionButton={{
//                         label: createSaleMutation.isPending ? "Adding..." : "Add",
//                         onClick: handleAddLead,
//                         // disabled: createSaleMutation.isPending,
//                     }}
//                     isPriorityAvailable={true}
//                     priority={priority}
//                     onPriorityChange={setPriority}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
//                         <div>
//                             <label className="block mb-2 font-medium">Customer Name</label>
//                             <input
//                                 type="text"
//                                 value={customerName}
//                                 onChange={(e) => setCustomerName(e.target.value)}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                                 placeholder="Customer Name"
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">Contact No</label>
//                             <input
//                                 type="text"
//                                 value={contactNumber}
//                                 onChange={(e) => setContactNumber(e.target.value)}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                                 placeholder="Contact No"
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">Email</label>
//                             <input
//                                 type="text"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                                 placeholder="Email"
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">City</label>
//                             <input
//                                 type="text"
//                                 value={city}
//                                 onChange={(e) => setCity(e.target.value)}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                                 placeholder="City"
//                             />
//                         </div>
//                     </div>
//
//                     {/* Lead Source & Vehicle Type */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
//                         {/* Lead Source */}
//                         <div>
//                             <label className="block mb-2 font-medium">Lead Source</label>
//                             <div
//                                 className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
//                                 <select
//                                     value={leadSource}
//                                     onChange={(e) => setLeadSource(e.target.value)}
//                                     className="w-full bg-transparent outline-none appearance-none"
//                                 >
//                                     <option value="">Select Lead Source</option>
//                                     <option value="Direct Call">Direct Call</option>
//                                     <option value="Website">Website</option>
//                                     <option value="Referral">Referral</option>
//                                 </select>
//                                 <span className="absolute right-4 pointer-events-none">
//                   <Image
//                       src={"/images/sales/icon-park-solid_down-one.svg"}
//                       width={19}
//                       height={19}
//                       alt="Arrow"
//                   />
//                 </span>
//                             </div>
//                         </div>
//
//                         {/* Vehicle Type */}
//                         <div>
//                             <label className="block mb-2 font-medium">Vehicle Type</label>
//                             <div
//                                 className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
//                                 <select
//                                     value={vehicleType}
//                                     onChange={(e) => setVehicleType(e.target.value)}
//                                     className="w-full bg-transparent outline-none appearance-none"
//                                 >
//                                     <option value="">Select Vehicle Type</option>
//                                     <option value="SUV">SUV</option>
//                                     <option value="Sedan">Sedan</option>
//                                     <option value="Hatchback">Hatchback</option>
//                                     <option value="Truck">Truck</option>
//                                 </select>
//                                 <span className="absolute right-4 pointer-events-none">
//                   <Image
//                       src={"/images/sales/icon-park-solid_down-one.svg"}
//                       width={19}
//                       height={19}
//                       alt="Arrow"
//                   />
//                 </span>
//                             </div>
//                         </div>
//
//                         {/* Vehicle Make */}
//                         <div>
//                             <label className="block mb-2 font-medium">Vehicle Make</label>
//                             <Select
//                                 options={vehicleMakes}
//                                 placeholder="Select Vehicle Make"
//                                 isSearchable
//                                 value={selectedMake}
//                                 onChange={(option) => setSelectedMake(option)}
//                                 className="w-full"
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         height: "51px",
//                                         borderRadius: "30px",
//                                         backgroundColor: "rgba(255,255,255,0.5)",
//                                         backdropFilter: "blur(50px)",
//                                         borderColor: "rgba(0,0,0,0.5)",
//                                         paddingLeft: "10px",
//                                     }),
//                                 }}
//                             />
//                         </div>
//
//                         {/* Vehicle Model */}
//                         <div>
//                             <label className="block mb-2 font-medium">Vehicle Model</label>
//                             <Select
//                                 options={vehicleModels}
//                                 placeholder="Select Vehicle Model"
//                                 isSearchable
//                                 value={selectedModel}
//                                 onChange={(option) => setSelectedModel(option)}
//                                 className="w-full mt-3"
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         height: "51px",
//                                         borderRadius: "30px",
//                                         backgroundColor: "rgba(255,255,255,0.5)",
//                                         backdropFilter: "blur(50px)",
//                                         borderColor: "rgba(0,0,0,0.5)",
//                                         paddingLeft: "10px",
//                                     }),
//                                 }}
//                             />
//                         </div>
//                     </div>
//
//                     {/* Remark */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
//                         <div className="md:col-span-4">
//                             <label className="block mb-2 font-medium">Remark</label>
//                             <textarea
//                                 value={remark}
//                                 onChange={(e) => setRemark(e.target.value)}
//                                 className="w-full h-[120px] rounded-[20px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 py-2"
//                                 placeholder="Enter remarks here..."
//                             />
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// }

//
// "use client";
//
// import Modal from "@/components/Modal";
// import Header from "@/components/Header";
// import {TicketColumn} from "@/components/TicketColumn";
// import {DragDropContext, DropResult} from "@hello-pangea/dnd";
// import Image from "next/image";
// import React, {useState} from "react";
// import Select from "react-select";
// import {Role} from "@/types/role";
// import {useCreateVehicleSale, useVehicleSales} from "@/hooks/useVehicleSales";
//
// type OptionType = { value: string; label: string };
//
// const vehicleMakes = [
//     {value: "Toyota", label: "Toyota"},
//     {value: "Nissan", label: "Nissan"},
//     {value: "Honda", label: "Honda"},
// ];
// const vehicleModels = [
//     {value: "Corolla", label: "Corolla"},
//     {value: "Civic", label: "Civic"},
//     {value: "Navara", label: "Navara"},
// ];
// const partNos = [
//     {value: "BP-001", label: "BP-001"},
//     {value: "EC-005", label: "EC-005"},
//     {value: "BP-002", label: "BP-002"},
// ];
//
// type MappedTicket = {
//     id: string;
//     priority: number;
//     user: string;
//     phone: string;
//     date: string;
//     status: "New" | "Ongoing" | "Won" | "Lost";
// };
//
// const mapStatus = (apiStatus: string): MappedTicket["status"] => {
//     switch (apiStatus) {
//         case "NEW":
//             return "New";
//         case "ONGOING":
//             return "Ongoing";
//         case "WON":
//             return "Won";
//         case "LOST":
//             return "Lost";
//         default:
//             return "New";
//     }
// };
//
// const mapApiToTicket = (apiSale: any): MappedTicket => ({
//     id: apiSale.ticket_number,
//     priority: apiSale.priority,
//     user: apiSale.customer?.customer_name || "Unknown",
//     phone: apiSale.customer?.phone_number || "",
//     date: new Date(apiSale.date).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"}),
//     status: mapStatus(apiSale.status),
// });
//
// export default function SalesDashboard() {
//     const [role, setRole] = useState<Role>(
//         process.env.NEXT_PUBLIC_USER_ROLE as Role
//     );
//     const [tickets, setTickets] = useState<MappedTicket[]>([]);
//     const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false); // Renamed from Add Lead to Add Sale
//     const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
//     const [customerId, setCustomerId] = useState(""); // Assume input for customer_id
//     const [callAgentId, setCallAgentId] = useState(1); // Hardcoded or select
//     const [vehicleMake, setVehicleMake] = useState("");
//     const [vehicleModel, setVehicleModel] = useState("");
//     const [partNo, setPartNo] = useState("");
//     const [yearOfManufacture, setYearOfManufacture] = useState("");
//     const [additionalNote, setAdditionalNote] = useState("");
//     const [selectedMake, setSelectedMake] = useState<OptionType | null>(null);
//     const [selectedModel, setSelectedModel] = useState<OptionType | null>(null); // Fixed typo: setSelectedModal -> setSelectedModel
//     const [selectedPartNo, setSelectedPartNo] = useState<OptionType | null>(null);
//
//     const {data: apiSales = [], isLoading, error} = useVehicleSales();
//     const createSaleMutation = useCreateVehicleSale();
//
//     React.useEffect(() => {
//         if (apiSales) {
//             setTickets(apiSales.map(mapApiToTicket));
//         }
//     }, [apiSales]);
//
//     const allowedTransitions: Record<MappedTicket["status"], MappedTicket["status"][]> = {
//         New: ["Ongoing"],
//         Ongoing: ["Won", "Lost"],
//         Won: [],
//         Lost: [],
//     };
//
//     const onDragEnd = (result: DropResult) => {
//         const {destination, source, draggableId} = result;
//         if (!destination) return;
//         if (
//             destination.droppableId === source.droppableId &&
//             destination.index === source.index
//         )
//             return;
//         setTickets((prev) =>
//             prev.map((t) => {
//                 if (t.id !== draggableId) return t;
//                 const currentStatus = t.status;
//                 const newStatus = destination.droppableId as MappedTicket["status"];
//                 if (allowedTransitions[currentStatus].includes(newStatus)) {
//                     return {...t, status: newStatus};
//                 }
//                 return t;
//             })
//         );
//     };
//
//     const columns: MappedTicket["status"][] = [
//         "New",
//         "Ongoing",
//         "Won",
//         "Lost",
//     ];
//
//     const handleCreateSale = () => {
//         if (!customerId || !vehicleMake || !vehicleModel || !partNo || !yearOfManufacture) {
//             alert("Please fill all required fields.");
//             return;
//         }
//         const payload = {
//             date: saleDate,
//             customer_id: customerId,
//             call_agent_id: callAgentId,
//             vehicle_make: vehicleMake,
//             vehicle_model: vehicleModel,
//             part_no: partNo,
//             year_of_manufacture: parseInt(yearOfManufacture),
//             additional_note: additionalNote,
//         };
//         createSaleMutation.mutate(payload, {
//             onSuccess: () => {
//                 alert("Sale created successfully!");
//                 // Reset form
//                 setSaleDate(new Date().toISOString().split("T")[0]);
//                 setCustomerId("");
//                 setVehicleMake("");
//                 setVehicleModel("");
//                 setPartNo("");
//                 setYearOfManufacture("");
//                 setAdditionalNote("");
//                 setSelectedMake(null);
//                 setSelectedModel(null);
//                 setSelectedPartNo(null);
//                 setIsAddSaleModalOpen(false);
//             },
//             onError: (err: any) => {
//                 console.error("Error creating sale:", err);
//                 alert("Failed to create sale.");
//             },
//         });
//     };
//
//     const nextActionData = [
//         {
//             ticketNo: "ITPL122455874564",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//         {
//             ticketNo: "ITPL122455874595",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//         {
//             ticketNo: "ITPL122455874165",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//         {
//             ticketNo: "ITPL122455874505",
//             name: "Emily Charlotte",
//             contactNo: "0773839322",
//         },
//     ];
//     const upcomingEventsData = [
//         {
//             customerName: "Emily Charlotte",
//             date: "March 15",
//             eventType: "BirthDay",
//         },
//         {
//             customerName: "Albert Flore",
//             date: "March 16",
//             eventType: "Reminder",
//         },
//         {
//             customerName: "Guy Hawkins",
//             date: "May 12",
//             eventType: "Reminder",
//         },
//         {
//             customerName: "Wade Warren",
//             date: "May 6",
//             eventType: "BirthDay",
//         },
//     ];
//
//     if (isLoading) {
//         return <div>Loading...</div>;
//     }
//
//     return (
//         <div
//             className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
//             <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
//                 <Header
//                     name="Sophie Eleanor"
//                     location="Bambalapitiya"
//                     title="Indra Motor Spare Sales Dashboard"
//                 />
//
//                 {/* Leads Section */}
//                 <section
//                     className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
//                     <div className="w-full flex justify-between items-center">
//                         <span className="font-semibold text-[22px]">Leads</span>
//                         <button
//                             className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
//                             onClick={() => setIsAddSaleModalOpen(true)}
//                         >
//                             <Image
//                                 src={"/images/sales/plus.svg"}
//                                 width={24}
//                                 height={24}
//                                 alt="Plus icon"
//                             />
//                         </button>
//                     </div>
//
//                     <DragDropContext onDragEnd={onDragEnd}>
//                         <div className="w-full mt-6 flex gap-6 overflow-x-auto ">
//                             {columns.map((col) => (
//                                 <TicketColumn
//                                     key={col}
//                                     title={col}
//                                     route={"/sales-agent/sales"}
//                                     tickets={tickets.filter((t) => t.status === col)}
//                                 />
//                             ))}
//                         </div>
//                     </DragDropContext>
//                 </section>
//
//                 {/* Next action and Upcomming events */}
//                 <section className="relative  flex flex-wrap w-full mb-5 gap-3 justify-center items-center">
//                     <div
//                         className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
//                         <span className="font-semibold text-[22px]">Next Action</span>
//                         <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
//                             {/* Table header */}
//                             <div className="flex font-medium text-[#575757] min-w-[400px]">
//                                 <div className="w-1/3 px-2">Ticket No.</div>
//                                 <div className="w-1/3 px-2">Customer Name</div>
//                                 <div className="w-1/3 px-2">Conatct No.</div>
//                             </div>
//                             <hr className="border-gray-300 my-4"/>
//
//                             <div className="h-[100] overflow-y-auto no-scrollbar">
//                                 {/* Table rows */}
//                                 {nextActionData.map((item, idx) => (
//                                     <div
//                                         key={idx}
//                                         className={`flex ${
//                                             idx > 0 ? "mt-3" : ""
//                                         } font-medium text-black min-w-[400px]`}
//                                     >
//                                         <div className="w-1/3 px-2">{item.ticketNo}</div>
//                                         <div className="w-1/3 px-2">{item.name}</div>
//                                         <div className="w-1/3 px-2">{item.contactNo}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                     <div
//                         className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
//                         <span className="font-semibold text-[22px]">Upcoming Events</span>
//                         <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
//                             {/* Table header */}
//                             <div className="flex font-medium text-[#575757] min-w-[400px]">
//                                 <div className="w-1/3 px-2">Customer Name</div>
//                                 <div className="w-1/3 px-2">Date</div>
//                                 <div className="w-1/3 px-2">Event Type</div>
//                             </div>
//                             <hr className="border-gray-300 my-4"/>
//
//                             <div className="h-[100] overflow-y-auto no-scrollbar">
//                                 {/* Table rows */}
//                                 {upcomingEventsData.map((item, idx) => (
//                                     <div
//                                         key={idx}
//                                         className={`flex ${
//                                             idx > 0 ? "mt-3" : ""
//                                         } font-medium text-black min-w-[400px]`}
//                                     >
//                                         <div className="w-1/3 px-2">{item.customerName}</div>
//                                         <div className="w-1/3 px-2">{item.date}</div>
//                                         <div className="w-1/3 px-2">{item.eventType}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </main>
//
//             {/* Add Lead Modal */}
//
//             {/*{isReminderModalOpen && (*/}
//             {/*    <Modal*/}
//             {/*        title="Add New Reminder"*/}
//             {/*        onClose={() => setReminderModalOpen(false)}*/}
//             {/*        actionButton={{*/}
//             {/*            label: "Save",*/}
//             {/*            onClick: () => {*/}
//             {/*                console.log("Reminder saved:", {*/}
//             {/*                    reminderTitle,*/}
//             {/*                    reminderDate,*/}
//             {/*                    reminderNote,*/}
//             {/*                });*/}
//             {/*                setReminderTitle("");*/}
//             {/*                setReminderDate("");*/}
//             {/*                setReminderNote("");*/}
//             {/*                setReminderModalOpen(false);*/}
//             {/*            },*/}
//             {/*        }}*/}
//             {/*    >*/}
//             {/*        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">*/}
//             {/*            <div>*/}
//             {/*                <label className="block mb-2 font-medium">Task Title</label>*/}
//             {/*                <input*/}
//             {/*                    type="text"*/}
//             {/*                    value={reminderTitle}*/}
//             {/*                    onChange={(e) => setReminderTitle(e.target.value)}*/}
//             {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
//             {/*                />*/}
//             {/*            </div>*/}
//             {/*            <div>*/}
//             {/*                <label className="block mb-2 font-medium">Task Date</label>*/}
//             {/*                <input*/}
//             {/*                    type="date"*/}
//             {/*                    value={reminderDate}*/}
//             {/*                    onChange={(e) => setReminderDate(e.target.value)}*/}
//             {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
//             {/*                />*/}
//             {/*            </div>*/}
//             {/*            <div>*/}
//             {/*                <label className="block mb-2 font-medium">Note</label>*/}
//             {/*                <input*/}
//             {/*                    type="text"*/}
//             {/*                    value={reminderNote}*/}
//             {/*                    onChange={(e) => setReminderNote(e.target.value)}*/}
//             {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
//             {/*                />*/}
//             {/*            </div>*/}
//             {/*        </div>*/}
//             {/*    </Modal>*/}
//             {/*)}*/}
//
//             {isAddSaleModalOpen && (
//                 <Modal
//                     title="Add New Sale"
//                     onClose={() => setIsAddSaleModalOpen(false)}
//                     actionButton={{
//                         label: "Add",
//                         onClick: handleCreateSale,
//                         // disabled: createSaleMutation.isPending,
//                     }}
//                     isPriorityAvailable={false} // Not used for sales
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
//                         <div>
//                             <label className="block mb-2 font-medium">Sale Date</label>
//                             <input
//                                 type="date"
//                                 value={saleDate}
//                                 onChange={(e) => setSaleDate(e.target.value)}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">Customer ID</label>
//                             <input
//                                 type="text"
//                                 value={customerId}
//                                 onChange={(e) => setCustomerId(e.target.value)}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                                 placeholder="e.g., CUS123"
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">Call Agent ID</label>
//                             <input
//                                 type="number"
//                                 value={callAgentId}
//                                 onChange={(e) => setCallAgentId(parseInt(e.target.value))}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                                 placeholder="e.g., 1"
//                             />
//                         </div>
//                         {/* Spacer */}
//                         <div></div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
//                         <div>
//                             <label className="block mb-2 font-medium">Vehicle Make</label>
//                             <Select
//                                 options={vehicleMakes}
//                                 placeholder="Select Vehicle Make"
//                                 isSearchable
//                                 value={selectedMake}
//                                 onChange={(option) => {
//                                     setSelectedMake(option);
//                                     setVehicleMake(option?.value || "");
//                                 }}
//                                 className="w-full"
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         height: "51px",
//                                         borderRadius: "30px",
//                                         backgroundColor: "rgba(255,255,255,0.5)",
//                                         backdropFilter: "blur(50px)",
//                                         borderColor: "rgba(0,0,0,0.5)",
//                                         paddingLeft: "10px",
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">Vehicle Model</label>
//                             <Select
//                                 options={vehicleModels}
//                                 placeholder="Select Vehicle Model"
//                                 isSearchable
//                                 value={selectedModel}
//                                 onChange={(option) => {
//                                     setSelectedModel(option);
//                                     setVehicleModel(option?.value || "");
//                                 }}
//                                 className="w-full"
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         height: "51px",
//                                         borderRadius: "30px",
//                                         backgroundColor: "rgba(255,255,255,0.5)",
//                                         backdropFilter: "blur(50px)",
//                                         borderColor: "rgba(0,0,0,0.5)",
//                                         paddingLeft: "10px",
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">Part No.</label>
//                             <Select
//                                 options={partNos}
//                                 placeholder="Select Part No."
//                                 isSearchable
//                                 value={selectedPartNo}
//                                 onChange={(option) => {
//                                     setSelectedPartNo(option);
//                                     setPartNo(option?.value || "");
//                                 }}
//                                 className="w-full"
//                                 styles={{
//                                     control: (base) => ({
//                                         ...base,
//                                         height: "51px",
//                                         borderRadius: "30px",
//                                         backgroundColor: "rgba(255,255,255,0.5)",
//                                         backdropFilter: "blur(50px)",
//                                         borderColor: "rgba(0,0,0,0.5)",
//                                         paddingLeft: "10px",
//                                     }),
//                                 }}
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium">Year of Manufacture</label>
//                             <input
//                                 type="number"
//                                 value={yearOfManufacture}
//                                 onChange={(e) => setYearOfManufacture(e.target.value)}
//                                 className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
//                                 placeholder="e.g., 2020"
//                             />
//                         </div>
//                     </div>
//                     {/* Additional Note */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
//                         <div className="md:col-span-4">
//                             <label className="block mb-2 font-medium">Additional Note</label>
//                             <textarea
//                                 value={additionalNote}
//                                 onChange={(e) => setAdditionalNote(e.target.value)}
//                                 className="w-full h-[120px] rounded-[20px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 py-2"
//                                 placeholder="Enter additional notes here..."
//                             />
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Modal from "@/components/Modal";
import Header from "@/components/Header";
import {TicketCard, TicketCardProps} from "@/components/TicketCard";
import {TicketColumn} from "@/components/TicketColumn";
// import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import Select from "react-select";
import {Role} from "@/types/role";
import {
    useCreateVehicleSale,
    useUpdateSaleStatus,
    useVehicleSales,
    useNearestReminders,
    useAssignVehicleSale
} from "@/hooks/useVehicleSales";
import {
    DndContext,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {createPortal} from "react-dom";
import {useToast} from "@/hooks/useToast";
import Toast from "@/components/Toast";
import {useCurrentUser} from "@/utils/auth";
import {useForm} from "react-hook-form";
import {setPriority} from "node:os";
import FormField from "@/components/FormField";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

type OptionType = { value: string; label: string };

const vehicleMakes = [
    {value: "Toyota", label: "Toyota"},
    {value: "Nissan", label: "Nissan"},
    {value: "Honda", label: "Honda"},
];
const vehicleModels = [
    {value: "Corolla", label: "Corolla"},
    {value: "Civic", label: "Civic"},
    {value: "Navara", label: "Navara"},
];
const partNos = [
    {value: "BP-001", label: "BP-001"},
    {value: "EC-005", label: "EC-005"},
    {value: "BP-002", label: "BP-002"},
];

type MappedTicket = {
    id: string;
    dbId: number;
    priority: number;
    user: string;
    phone: string;
    date: string;
    status: "New" | "Ongoing" | "Won" | "Lost";
};


export const selfAssignSaleSchema = z.object({
    customer_name: z.string().min(1, "Customer Name is required"),
    contact_number: z.string().min(10, "Valid Contact Number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    city: z.string().min(1, "City is required"),
    lead_source: z.string().min(1, "Lead Source is required"),
    vehicle_type: z.string().optional(),
    vehicle_make: z.string().min(1, "Make is required"),
    vehicle_model: z.string().min(1, "Model is required"),
    remark: z.string().optional(),
    priority: z.number().optional(),
});

export type SelfAssignSaleFormData = z.infer<typeof selfAssignSaleSchema>;

const mapStatus = (apiStatus: string): MappedTicket["status"] => {
    switch (apiStatus) {
        case "NEW":
            return "New";
        case "ONGOING":
            return "Ongoing";
        case "WON":
            return "Won";
        case "LOST":
            return "Lost";
        default:
            return "New";
    }
};

const mapStatusToApi = (uiStatus: string): string => {
    switch (uiStatus) {
        case "New":
            return "NEW";
        case "Ongoing":
            return "ONGOING";
        case "Won":
            return "WON";
        case "Lost":
            return "LOST";
        default:
            return "NEW";
    }
};

const mapApiToTicket = (apiSale: any): MappedTicket => ({
    id: apiSale.ticket_number,
    dbId: apiSale.id,
    priority: apiSale.priority,
    user: apiSale.customer?.customer_name || "Unknown",
    phone: apiSale.customer?.phone_number || "",
    date: new Date(apiSale.date).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"}),
    status: mapStatus(apiSale.status),
});

export default function SalesDashboard() {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const user = useCurrentUser();

    const userId = Number(user?.id || 1);
    const userRole = user?.user_role;
    const isLevel1 = userRole === "SALES01";

    const [tickets, setTickets] = useState<MappedTicket[]>([]);
    const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
    const [customerId, setCustomerId] = useState("");
    const [callAgentId, setCallAgentId] = useState(1);
    const [vehicleMake, setVehicleMake] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [partNo, setPartNo] = useState("");
    const [yearOfManufacture, setYearOfManufacture] = useState("");
    const [additionalNote, setAdditionalNote] = useState("");
    const [selectedMake, setSelectedMake] = useState<OptionType | null>(null);
    const [selectedModel, setSelectedModel] = useState<OptionType | null>(null);
    const [selectedPartNo, setSelectedPartNo] = useState<OptionType | null>(null);

    const [priority, setPriority] = useState("P0");


    const [isMounted, setIsMounted] = useState(false);

    const [activeId, setActiveId] = useState<string | null>(null);

    const {toast, showToast, hideToast} = useToast();

    const {data: apiSales, isLoading, error} = useVehicleSales(undefined, userId, userRole);
    const createSaleMutation = useCreateVehicleSale();
    const updateStatusMutation = useUpdateSaleStatus();
    const assignMutation = useAssignVehicleSale();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const {data: reminderData, isLoading: reminderLoading, error: reminderError} = useNearestReminders(userId);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (apiSales) {
            setTickets(apiSales.map(mapApiToTicket));
        }
    }, [apiSales]);

    const allowedTransitions: Record<MappedTicket["status"], MappedTicket["status"][]> = {
        New: ["Ongoing"],
        Ongoing: ["Won", "Lost"],
        Won: ["Ongoing"],
        Lost: ["Ongoing"],
    };

    // const onDragEnd = (result: DropResult) => {
    //     const {destination, source, draggableId} = result;
    //
    //     if (!destination) return;
    //
    //     if (
    //         destination.droppableId === source.droppableId &&
    //         destination.index === source.index
    //     ) {
    //         return;
    //     }
    //
    //     const currentStatus = source.droppableId as MappedTicket["status"];
    //     const newStatus = destination.droppableId as MappedTicket["status"];
    //
    //     const isAllowed = allowedTransitions[currentStatus]?.includes(newStatus);
    //
    //     if (!isAllowed) {
    //         console.warn(`Movement from ${currentStatus} to ${newStatus} is not allowed.`);
    //         return;
    //     }
    //
    //     const updatedTickets = tickets.map((t) => {
    //         if (t.id === draggableId) {
    //             return {...t, status: newStatus};
    //         }
    //         return t;
    //     });
    //
    //     setTickets(updatedTickets);
    //
    //     updateStatusMutation.mutate(
    //         {id: Number(draggableId), status: newStatus.toUpperCase()},
    //         {
    //             onError: () => {
    //                 alert("Failed to update status on server.");
    //                 if (apiSales) setTickets(apiSales.map(mapApiToTicket));
    //             }
    //         }
    //     );
    //
    //     // setTickets((prev) =>
    //     //     prev.map((t) => {
    //     //         if (t.id !== draggableId) return t;
    //     //         const currentStatus = t.status;
    //     //         const newStatus = destination.droppableId as MappedTicket["status"];
    //     //         if (allowedTransitions[currentStatus].includes(newStatus)) {
    //     //             return {...t, status: newStatus};
    //     //         }
    //     //         return t;
    //     //     })
    //     // );
    // };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        setActiveId(null);

        // If dropped outside a droppable area
        if (!over) return;

        const ticketId = active.id as string;
        const newStatus = over.id as MappedTicket["status"];

        // Find the dragged ticket
        const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
        if (ticketIndex === -1) return;

        const ticket = tickets[ticketIndex];
        const currentStatus = ticket.status;

        // Prevent drop if status hasn't changed
        if (currentStatus === newStatus) return;

        // Check Business Rules
        const isAllowed = allowedTransitions[currentStatus]?.includes(newStatus);

        if (!isAllowed) {
            console.warn(`Invalid transition: ${currentStatus} -> ${newStatus}`);
            showToast("Invalid status transition", "error");
            return;
        }

        // Optimistic Update
        const updatedTickets = [...tickets];
        updatedTickets[ticketIndex] = {...ticket, status: newStatus};
        setTickets(updatedTickets);


        if (currentStatus === "New" && newStatus === "Ongoing") {
            assignMutation.mutate(
                {
                    id: ticket.dbId,
                    salesUserId: userId
                },
                {
                    onSuccess: () => {
                        showToast("Lead assigned successfully.", "success");
                        console.log("Lead assigned successfully");
                    },
                    onError: (error) => {
                        console.error("Failed to assign lead:", error);
                        setTickets(tickets);
                        showToast("Failed to assign lead", "error");
                    }
                }
            );
        } else {
            updateStatusMutation.mutate(
                {
                    id: ticket.dbId,
                    status: mapStatusToApi(newStatus)
                },
                {
                    onError: () => {
                        // Revert on failure
                        setTickets(tickets);
                        showToast("Failed to update status", "error");
                    }
                }
            )
        }

        // API Call
        // updateStatusMutation.mutate(
        //     {
        //         id: ticket.dbId,
        //         status: mapStatusToApi(newStatus)
        //     },
        //     {
        //         onError: () => {
        //             // Revert on failure
        //             setTickets(tickets);
        //             alert("Failed to update status.");
        //         }
        //     }
        // );
    };

    const activeTicket = tickets.find((t) => t.id === activeId);

    const columns: MappedTicket["status"][] = [
        "New",
        "Ongoing",
        "Won",
        "Lost",
    ];


    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<SelfAssignSaleFormData>({
        resolver: zodResolver(selfAssignSaleSchema),
        defaultValues: {
            vehicle_type: "",
            remark: "",
            email: ""
        }
    });


    const handleSelfAssignSubmit = (data: SelfAssignSaleFormData) => {
        const payload = {
            ...data,
            sales_user_id: userId,
            is_self_assigned: true,
            date: new Date().toISOString(),
            priority: data.priority || parseInt(priority.replace('P', '')) || 0,
        };

        createSaleMutation.mutate(payload, {
            onSuccess: () => {
                showToast("Lead created and assigned successfully!", "success");
                setIsAddSaleModalOpen(false);
                setPriority("P0");
                reset();
            },
            onError: (err) => {
                console.error(err);
                showToast("Failed to create lead", "error");
            }
        });
    }


    const handleCreateSale = () => {
        if (!customerId || !vehicleMake || !vehicleModel || !partNo || !yearOfManufacture) {
            showToast("Please fill all required fields", "error");
            return;
        }
        const payload = {
            date: saleDate,
            customer_id: customerId,
            call_agent_id: callAgentId,
            vehicle_make: vehicleMake,
            vehicle_model: vehicleModel,
            part_no: partNo,
            year_of_manufacture: parseInt(yearOfManufacture),
            additional_note: additionalNote,
        };
        createSaleMutation.mutate(payload, {
            onSuccess: () => {
                showToast("Sale created successfully!", "success");
                // Reset form
                setSaleDate(new Date().toISOString().split("T")[0]);
                setCustomerId("");
                setVehicleMake("");
                setVehicleModel("");
                setPartNo("");
                setYearOfManufacture("");
                setAdditionalNote("");
                setSelectedMake(null);
                setSelectedModel(null);
                setSelectedPartNo(null);
                setIsAddSaleModalOpen(false);
            },
            onError: (err: any) => {
                console.error("Error creating sale:", err);
                showToast("Failed to create sale", "error");
            },
        });
    };

    const upcomingEventsData = [
        {
            customerName: "Emily Charlotte",
            date: "March 15",
            eventType: "BirthDay",
        },
        {
            customerName: "Albert Flore",
            date: "March 16",
            eventType: "Reminder",
        },
        {
            customerName: "Guy Hawkins",
            date: "May 12",
            eventType: "Reminder",
        },
        {
            customerName: "Wade Warren",
            date: "May 6",
            eventType: "BirthDay",
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isMounted) return null;

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
                    title="Indra Traders Sales Dashboard"
                />

                {/* Leads Section */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Leads</span>
                        {isLevel1 && (
                            <button
                                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={() => setIsAddSaleModalOpen(true)}
                            >
                                <Image
                                    src={"/images/sales/plus.svg"}
                                    width={24}
                                    height={24}
                                    alt="Plus icon"
                                />
                            </button>
                        )}
                    </div>

                    {/*{isMounted && (*/}
                    {/*    <DragDropContext onDragEnd={onDragEnd}>*/}
                    {/*        /!*<div className="w-full mt-6 flex gap-6 overflow-x-auto ">*!/*/}
                    {/*        <div className="w-full mt-6 flex gap-6 flex-wrap md:flex-nowrap items-start">*/}
                    {/*            {columns.map((col) => (*/}
                    {/*                <TicketColumn*/}
                    {/*                    key={col}*/}
                    {/*                    title={col}*/}
                    {/*                    route={"/sales-agent/sales"}*/}
                    {/*                    tickets={tickets.filter((t) => t.status === col)}*/}
                    {/*                />*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    </DragDropContext>*/}
                    {/*)}*/}

                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                        <div className="w-full mt-6 flex gap-6 overflow-x-auto pb-4 items-start">
                            {columns.map((col) => (
                                <TicketColumn
                                    key={col}
                                    title={col}
                                    route={"/sales-agent/sales"}
                                    tickets={tickets.filter((t) => t.status === col)}
                                />
                            ))}
                        </div>

                        {isMounted && typeof document !== "undefined"
                            ? createPortal(
                                <DragOverlay>
                                    {activeTicket ? (
                                        <TicketCard
                                            {...activeTicket}
                                            isOverlay={true}
                                        />
                                    ) : null}
                                </DragOverlay>,
                                document.body
                            )
                            : null
                        }
                    </DndContext>
                </section>

                {/* Next action and Upcoming events */}
                <section className="relative  flex flex-wrap w-full mb-5 gap-3 justify-center items-center">
                    <div
                        className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
                        <span className="font-semibold text-[22px]">Next Action</span>
                        <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
                            {/* Table header */}
                            <div className="flex font-medium text-[#575757] min-w-[400px]">
                                <div className="w-1/3 px-2">Ticket No.</div>
                                <div className="w-1/3 px-2">Customer Name</div>
                                <div className="w-1/3 px-2">Conatct No.</div>
                            </div>
                            <hr className="border-gray-300 my-4"/>

                            <div className="h-[100] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {reminderData?.data.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            idx > 0 ? "mt-3" : ""
                                        } font-medium text-black min-w-[400px]`}
                                    >
                                        <div className="w-1/3 px-2">{item.ticketNo}</div>
                                        <div className="w-1/3 px-2">{item.name}</div>
                                        <div className="w-1/3 px-2">{item.contactNo}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
                        <span className="font-semibold text-[22px]">Upcoming Events</span>
                        <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
                            {/* Table header */}
                            <div className="flex font-medium text-[#575757] min-w-[400px]">
                                <div className="w-1/3 px-2">Customer Name</div>
                                <div className="w-1/3 px-2">Date</div>
                                <div className="w-1/3 px-2">Event Type</div>
                            </div>
                            <hr className="border-gray-300 my-4"/>

                            <div className="h-[100] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {upcomingEventsData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            idx > 0 ? "mt-3" : ""
                                        } font-medium text-black min-w-[400px]`}
                                    >
                                        <div className="w-1/3 px-2">{item.customerName}</div>
                                        <div className="w-1/3 px-2">{item.date}</div>
                                        <div className="w-1/3 px-2">{item.eventType}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Add Lead Modal */}

            {/*{isReminderModalOpen && (*/}
            {/*    <Modal*/}
            {/*        title="Add New Reminder"*/}
            {/*        onClose={() => setReminderModalOpen(false)}*/}
            {/*        actionButton={{*/}
            {/*            label: "Save",*/}
            {/*            onClick: () => {*/}
            {/*                console.log("Reminder saved:", {*/}
            {/*                    reminderTitle,*/}
            {/*                    reminderDate,*/}
            {/*                    reminderNote,*/}
            {/*                });*/}
            {/*                setReminderTitle("");*/}
            {/*                setReminderDate("");*/}
            {/*                setReminderNote("");*/}
            {/*                setReminderModalOpen(false);*/}
            {/*            },*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Task Title</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    value={reminderTitle}*/}
            {/*                    onChange={(e) => setReminderTitle(e.target.value)}*/}
            {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Task Date</label>*/}
            {/*                <input*/}
            {/*                    type="date"*/}
            {/*                    value={reminderDate}*/}
            {/*                    onChange={(e) => setReminderDate(e.target.value)}*/}
            {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Note</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    value={reminderNote}*/}
            {/*                    onChange={(e) => setReminderNote(e.target.value)}*/}
            {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Modal>*/}
            {/*)}*/}

            {/*{isAddSaleModalOpen && (*/}
            {/*    <Modal*/}
            {/*        title="Add New Sale"*/}
            {/*        onClose={() => setIsAddSaleModalOpen(false)}*/}
            {/*        actionButton={{*/}
            {/*            label: "Add",*/}
            {/*            onClick: handleCreateSale,*/}
            {/*            // disabled: createSaleMutation.isPending,*/}
            {/*        }}*/}
            {/*        isPriorityAvailable={false} // Not used for sales*/}
            {/*    >*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Sale Date</label>*/}
            {/*                <input*/}
            {/*                    type="date"*/}
            {/*                    value={saleDate}*/}
            {/*                    onChange={(e) => setSaleDate(e.target.value)}*/}
            {/*                    className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Customer ID</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    value={customerId}*/}
            {/*                    onChange={(e) => setCustomerId(e.target.value)}*/}
            {/*                    className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                    placeholder="e.g., CUS123"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Call Agent ID</label>*/}
            {/*                <input*/}
            {/*                    type="number"*/}
            {/*                    value={callAgentId}*/}
            {/*                    onChange={(e) => setCallAgentId(parseInt(e.target.value))}*/}
            {/*                    className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                    placeholder="e.g., 1"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            /!* Spacer *!/*/}
            {/*            <div></div>*/}
            {/*        </div>*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Vehicle Make</label>*/}
            {/*                <Select*/}
            {/*                    options={vehicleMakes}*/}
            {/*                    placeholder="Select Vehicle Make"*/}
            {/*                    isSearchable*/}
            {/*                    value={selectedMake}*/}
            {/*                    onChange={(option) => {*/}
            {/*                        setSelectedMake(option);*/}
            {/*                        setVehicleMake(option?.value || "");*/}
            {/*                    }}*/}
            {/*                    className="w-full"*/}
            {/*                    styles={{*/}
            {/*                        control: (base) => ({*/}
            {/*                            ...base,*/}
            {/*                            height: "51px",*/}
            {/*                            borderRadius: "30px",*/}
            {/*                            backgroundColor: "rgba(255,255,255,0.5)",*/}
            {/*                            backdropFilter: "blur(50px)",*/}
            {/*                            borderColor: "rgba(0,0,0,0.5)",*/}
            {/*                            paddingLeft: "10px",*/}
            {/*                        }),*/}
            {/*                    }}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Vehicle Model</label>*/}
            {/*                <Select*/}
            {/*                    options={vehicleModels}*/}
            {/*                    placeholder="Select Vehicle Model"*/}
            {/*                    isSearchable*/}
            {/*                    value={selectedModel}*/}
            {/*                    onChange={(option) => {*/}
            {/*                        setSelectedModel(option);*/}
            {/*                        setVehicleModel(option?.value || "");*/}
            {/*                    }}*/}
            {/*                    className="w-full"*/}
            {/*                    styles={{*/}
            {/*                        control: (base) => ({*/}
            {/*                            ...base,*/}
            {/*                            height: "51px",*/}
            {/*                            borderRadius: "30px",*/}
            {/*                            backgroundColor: "rgba(255,255,255,0.5)",*/}
            {/*                            backdropFilter: "blur(50px)",*/}
            {/*                            borderColor: "rgba(0,0,0,0.5)",*/}
            {/*                            paddingLeft: "10px",*/}
            {/*                        }),*/}
            {/*                    }}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Part No.</label>*/}
            {/*                <Select*/}
            {/*                    options={partNos}*/}
            {/*                    placeholder="Select Part No."*/}
            {/*                    isSearchable*/}
            {/*                    value={selectedPartNo}*/}
            {/*                    onChange={(option) => {*/}
            {/*                        setSelectedPartNo(option);*/}
            {/*                        setPartNo(option?.value || "");*/}
            {/*                    }}*/}
            {/*                    className="w-full"*/}
            {/*                    styles={{*/}
            {/*                        control: (base) => ({*/}
            {/*                            ...base,*/}
            {/*                            height: "51px",*/}
            {/*                            borderRadius: "30px",*/}
            {/*                            backgroundColor: "rgba(255,255,255,0.5)",*/}
            {/*                            backdropFilter: "blur(50px)",*/}
            {/*                            borderColor: "rgba(0,0,0,0.5)",*/}
            {/*                            paddingLeft: "10px",*/}
            {/*                        }),*/}
            {/*                    }}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Year of Manufacture</label>*/}
            {/*                <input*/}
            {/*                    type="number"*/}
            {/*                    value={yearOfManufacture}*/}
            {/*                    onChange={(e) => setYearOfManufacture(e.target.value)}*/}
            {/*                    className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                    placeholder="e.g., 2020"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        /!* Additional Note *!/*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">*/}
            {/*            <div className="md:col-span-4">*/}
            {/*                <label className="block mb-2 font-medium">Additional Note</label>*/}
            {/*                <textarea*/}
            {/*                    value={additionalNote}*/}
            {/*                    onChange={(e) => setAdditionalNote(e.target.value)}*/}
            {/*                    className="w-full h-[120px] rounded-[20px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 py-2"*/}
            {/*                    placeholder="Enter additional notes here..."*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Modal>*/}
            {/*)}*/}


            {isAddSaleModalOpen && (
                <Modal
                    title="Add New Sale"
                    onClose={() => setIsAddSaleModalOpen(false)}
                    actionButton={{
                        label: isSubmitting ? "Adding..." : "Add",
                        onClick: handleSubmit(handleSelfAssignSubmit),
                        // disabled: createSaleMutation.isPending,
                    }}
                    priority={priority}
                    onPriorityChange={setPriority}
                    isPriorityAvailable={true}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-6">
                        <FormField label="Customer Name" placeholder="Customer Name"
                                   register={register("customer_name")} error={errors.customer_name}/>
                        <FormField label="Contact No" placeholder="Contact No" register={register("contact_number")}
                                   error={errors.contact_number}/>
                        <FormField label="Email" placeholder="Email" register={register("email")} error={errors.email}/>
                        <FormField label="City" placeholder="City" register={register("city")} error={errors.city}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-6">
                        <FormField
                            label="Lead Source"
                            type="select"
                            options={[{value: "Direct Call", label: "Direct Call"}, {
                                value: "Walk In",
                                label: "Walk In"
                            }]}
                            register={register("lead_source")}
                            error={errors.lead_source}
                        />
                        <FormField
                            label="Vehicle Type"
                            type="select"
                            options={[{value: "SUV", label: "SUV"}, {value: "Sedan", label: "Sedan"}]}
                            register={register("vehicle_type")}
                            error={errors.vehicle_type}
                        />
                        {/* Make & Model */}
                        <FormField
                            label="Vehicle Make"
                            type="select"
                            isIcon={true} // Magnifying glass icon
                            options={vehicleMakes}
                            register={register("vehicle_make")}
                            error={errors.vehicle_make}
                        />
                        <FormField
                            label="Vehicle Model"
                            type="select"
                            isIcon={true}
                            options={vehicleModels}
                            register={register("vehicle_model")}
                            error={errors.vehicle_model}
                        />
                    </div>
                    {/* Additional Note */}
                    <div className="w-full">
                        <label className="block mb-2 font-medium text-gray-700">Remark</label>
                        <textarea
                            {...register("remark")}
                            className="w-full h-[100px] rounded-[20px] bg-[#FFFFFF80] border border-gray-300 p-4 focus:outline-none"
                            placeholder="Remark"
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
}

