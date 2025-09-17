import { FiPhone, FiUser, FiEdit} from "react-icons/fi";
import {MdWarningAmber} from "react-icons/md";
import {FaWhatsapp} from "react-icons/fa";
import {AiOutlineMail} from "react-icons/ai";
import Image from "next/image";

const customerDetails = [
    {
        icon: <FiPhone/>,
        title: "Vehicle Number",
        value: "CAB - 5875",
        editable: false,
    },
    {
        icon: <FiPhone/>,
        title: "Phone Number",
        value: "077- 5425658",
        editable: false,
    },
    {
        icon: <FaWhatsapp/>,
        title: "WhatsApp Number",
        value: "077- 5425658",
        editable: false,
    },
    {
        icon: <AiOutlineMail/>,
        title: "Email Address",
        value: "Emily@info.com",
        editable: true,
    },
    {
        icon: <FiUser/>,
        title: "Customer Name",
        value: "Emily Charlotte",
        editable: true,
    },
    {
        icon: <FiUser/>,
        title: "Convenient Branch",
        value: "Bambalapitiya",
        editable: false,
    },
    {
        icon: <MdWarningAmber/>,
        title: "ID Number",
        value: "200045754536",
        editable: true,
    },
    {
        icon: <FiUser/>,
        title: "City",
        value: "Maharagama",
        editable: true,
    },
    {
        icon: <FiUser/>,
        title: "Gender",
        value: "Female",
        editable: false,
    },
    {
        icon: <FiUser/>,
        title: "Customer Type",
        value: "Individual",
        editable: false,
    },
    {
        icon: <FiUser/>,
        title: "Profession",
        value: "Engineer",
        editable: true,
    },
    {
        icon: <FiUser/>,
        title: "Lead Source",
        value: "Direct Call",
        editable: false,
    },
];

const tabs = [
    {label: "Customer Calls", active: true},
    {label: "Vehicle Sales", active: false},
    {label: "Service Park", active: false},
    {label: "Spare Parts", active: false},
    {label: "Fast Track", active: false},
];

export default function Dashboard() {
    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                {/* Welcome message */}
                <h1 className="text-[25px] font-bold text-[#1D1D1D] ml-8">Welcome Back, Risi Fernando</h1>

                {/* Call Info Card */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-3">
                            {/*<FiPhone size={24} className="text-red-700" />*/}
                            <div className="h-10 w-10">
                                <Image src="/tel.png" alt="" width={200} height={200}/>
                            </div>

                            <div>
                                <p className="font-semibold text-black text-xl">Calling Emily Charlotte....</p>
                                <p className="text-[#575757] text-[17px] flex items-center space-x-1">
                                    <span>Today’s her birthday</span>
                                    <span role="img" aria-label="birthday cake"><Image src="/cake.png" alt=""
                                                                                       width={200} height={200}
                                                                                       className="w-4 h-4"/></span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between gap-36">
                        <div className="flex flex-col space-y-1">
                            <p className="grid grid-cols-2 gap-5">
                                <span className="font-medium text-lg text-[#1D1D1D]">Last Call Date: </span>
                                <span className="font-medium text-lg text-[#575757]">12 Dec 2024</span>
                            </p>
                            <p className="grid grid-cols-2 gap-5">
                                <span className="font-medium text-lg text-[#1D1D1D]">Assigned Agent: </span>
                                <span className="font-medium text-lg text-[#575757]">Charley Macros</span>
                            </p>
                        </div>
                        <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                            {/*<MdWarningAmber size={24} className="text-red-700"/>*/}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1 21L12 2L23 21H1ZM4.45 19H19.55L12 6L4.45 19ZM12 18C12.2833 18 12.521 17.904 12.713 17.712C12.905 17.52 13.0007 17.2827 13 17C12.9993 16.7173 12.9033 16.48 12.712 16.288C12.5207 16.096 12.2833 16 12 16C11.7167 16 11.4793 16.096 11.288 16.288C11.0967 16.48 11.0007 16.7173 11 17C10.9993 17.2827 11.0953 17.5203 11.288 17.713C11.4807 17.9057 11.718 18.0013 12 18ZM11 15H13V10H11V15Z"
                                    fill="#575757"/>
                                <circle cx="17" cy="7" r="4.75" fill="#DB2727" stroke="#FBF9F9" strokeWidth="1.5"/>
                            </svg>
                        </button>
                    </div>

                </section>

                <div className="bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-12 py-10">
                    <h2 className="text-[22px] font-semibold text-black mb-6">Customer Details</h2>

                    {/* Customer Details Cards */}
                    <section className="grid grid-cols-4 gap-6">
                        {customerDetails.map(({icon, title, value, editable}, idx) => (
                            <div
                                key={idx}
                                className="relative bg-white/50 rounded-[30px] p-5 flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div
                                        className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center text-gray-700 shadow">
                                        {icon}
                                    </div>
                                    {editable && (
                                        <button
                                            className="w-8 h-8 rounded-full bg-white bg-opacity-50 flex items-center justify-center shadow text-gray-700 absolute top-4 right-4">
                                            <FiEdit size={16}/>
                                        </button>
                                    )}
                                    {!editable && (
                                        <button
                                            className="w-8 h-8 rounded-full bg-[#EBEBEB8C]/55 border border-[#E0E0E0] flex items-center justify-center text-gray-700 absolute top-4 right-4">
                                            {/*<FiChevronDown size={16}/>*/}
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.1044 11.7857H5.62613C5.37236 11.7857 5.15979 11.6997 4.98842 11.5277C4.81705 11.3558 4.73107 11.1432 4.73047 10.89C4.72987 10.6369 4.81586 10.4243 4.98842 10.2523C5.16098 10.0804 5.37355 9.99439 5.62613 9.99439H10.1044V5.51611C10.1044 5.26234 10.1904 5.04977 10.3624 4.8784C10.5343 4.70704 10.7469 4.62105 11.0001 4.62046C11.2532 4.61986 11.4661 4.70584 11.6387 4.8784C11.8112 5.05097 11.8969 5.26354 11.8957 5.51611V9.99439H16.374C16.6278 9.99439 16.8406 10.0804 17.0126 10.2523C17.1846 10.4243 17.2702 10.6369 17.2696 10.89C17.269 11.1432 17.1831 11.3561 17.0117 11.5286C16.8403 11.7012 16.6278 11.7869 16.374 11.7857H11.8957V16.264C11.8957 16.5177 11.8097 16.7306 11.6378 16.9026C11.4658 17.0745 11.2532 17.1602 11.0001 17.1596C10.7469 17.159 10.5343 17.073 10.3624 16.9017C10.1904 16.7303 10.1044 16.5177 10.1044 16.264V11.7857Z" fill="#575757"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-[17px] text-[#1D1D1D]">{title}</span>
                                    <span className="font-medium text-[#575757] text-[17px] flex flex-row items-center gap-1">{value} <span><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 8.03186L10 13.0319L5 8.03186H15Z" fill="#575757"/>
                                    </svg>
                                    </span></span>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </main>
        </div>
    );
}
