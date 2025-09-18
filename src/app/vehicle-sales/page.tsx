const VehicleSales = () => {
    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <h1 className="text-2xl font-extrabold mb-4">Indra Traders Dashboard</h1>

                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="font-semibold text-[22px] mb-6">Filters</h2>
                            <div>
                                <button className="ml-auto mt-8 md:mt-0 text-[#DB2727] text-base font-medium rounded-full px-9 py-2 hover:text-white transition">
                                    Clear all
                                </button>
                                <button
                                    className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition">
                                    Apply
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <VerificationDropdown label="Serial No." placeholder="Serial No." isIcon={true}/>
                            <VerificationDropdown label="Contact No." placeholder="Contact No." isIcon={true}/>
                            <VerificationDropdown label="Customer Name" placeholder="Customer Name" isIcon={true}/>
                            <VerificationDropdown label="Transmission" placeholder="Select Transmission" isIcon={false}/>
                            <VerificationDropdown label="Fuel Type" placeholder="Select Fuel Type" isIcon={false}/>
                            <VerificationDropdown label="Down Payment" placeholder="Enter Down Payment" isIcon={false}/>
                            <div>
                                <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">Price Range</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Price From"
                                            className={`w-2/3 px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                        />
                                        <svg className="absolute right-[30px] top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6"
                                             viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                </section>

                {/* Warranty Details */}
                {/*<section*/}
                {/*    className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 items-center space-y-6 mb-6">*/}
                {/*    <header className="flex items-center space-x-4">*/}
                {/*        <h2 className="font-semibold text-[22px]">Warranty Details</h2>*/}
                {/*        <span className="bg-[#039855] text-white text-[15px] font-medium px-3 py-1 rounded-full">*/}
                {/*          Active*/}
                {/*        </span>*/}
                {/*    </header>*/}
                {/*    */}
                {/*</section>*/}
            </main>
        </div>
    );
}

type VerificationDropdownProps = {
    label: string;
    placeholder: string;
    isIcon: boolean;
};

function VerificationDropdown({label, placeholder, isIcon}: VerificationDropdownProps) {
    return (
        <label className="flex flex-col space-y-2 font-medium text-gray-900">
            <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">{label}</span>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`w-full ${isIcon ? "px-10" : "px-4"} py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                />
                {/*<FiSearch*/}
                {/*    size={18}*/}
                {/*    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"*/}
                {/*/>*/}
                {
                    isIcon && (
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20"
                     viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.1935 13.5122L16.6532 15.9719M15.8762 9.1838C15.8762 10.7723 15.2451 12.2958 14.1219 13.419C12.9986 14.5422 11.4752 15.1733 9.88669 15.1733C8.29818 15.1733 6.77473 14.5422 5.65149 13.419C4.52825 12.2958 3.89722 10.7723 3.89722 9.1838C3.89722 7.5953 4.52825 6.07185 5.65149 4.94861C6.77473 3.82537 8.29818 3.19434 9.88669 3.19434C11.4752 3.19434 12.9986 3.82537 14.1219 4.94861C15.2451 6.07185 15.8762 7.5953 15.8762 9.1838Z"
                        stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                    )
                }

                {/*<BiChevronDown*/}
                {/*    size={18}*/}
                {/*    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"*/}
                {/*/>*/}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6"
                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                </svg>
            </div>
        </label>
    );
}

type InfoCardProps = {
    icon: React.ReactNode;
    title: string;
    data: string;
};

function InfoCard({icon, title, data}: InfoCardProps) {
    return (
        <div className="bg-white/55 backdrop-blur rounded-[30px] flex flex-col p-6 w-[280px]">
            <div
                className="w-12 h-12 flex justify-center items-center rounded-full bg-white/55 border border-[#EFEFEF] mb-5">
                {icon}
            </div>
            <h4 className="font-semibold text-[#1D1D1D] text-[17px] mb-1">{title}</h4>
            <p className="text-[#575757] text-[17px] font-medium">{data}</p>
        </div>
    );
}

export default VehicleSales;
