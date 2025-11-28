const Warranty = () => {
    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            {/* Background Blurred Circles */}
            {/*<div className="pointer-events-none">*/}
            {/*    <div className="absolute w-[705px] h-[705px] left-1/2 -translate-x-1/2 top-[309px] rounded-full bg-red-700/40 blur-[400px]" />*/}
            {/*    <div className="absolute w-[705px] h-[705px] left-[calc(50%+771.5px)] top-[853px] rounded-full bg-red-700/40 opacity-40 blur-[400px]" />*/}
            {/*    <div className="absolute w-[620px] h-[620px] left-[calc(50%-620px/2-720px)] top-[272px] rounded-full bg-red-700/30 blur-[400px]" />*/}
            {/*    <div className="absolute w-[562px] h-[562px] left-[calc(50%+440px)] top-0 rounded-full bg-gray-300/40 blur-[400px]" />*/}
            {/*    <div className="absolute w-[562px] h-[562px] left-[calc(50%-562px/2-439px)] top-0 rounded-full bg-gray-300/40 blur-[400px]" />*/}
            {/*    /!* Additional blurred ellipses as needed *!/*/}
            {/*</div>*/}

            {/* Overlay Blur */}
            {/*<div className="absolute inset-0 bg-gray-200/70 backdrop-blur-[50px]"></div>*/}

            {/* Main Content */}
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <h1 className="text-2xl font-extrabold mb-4">Warranty Checker</h1>

                {/* Product Verification */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="font-semibold text-[22px] mb-6">Product Verification</h2>
                            <button
                                className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition">
                                Apply
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <VerificationDropdown label="Serial No." placeholder="Serial No."/>
                            <VerificationDropdown label="Contact No." placeholder="Contact No."/>
                            <VerificationDropdown label="Customer Name" placeholder="Customer Name"/>
                        </div>
                    </div>

                </section>

                {/* Warranty Details */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 items-center space-y-6 mb-6">
                    <header className="flex items-center space-x-4">
                        <h2 className="font-semibold text-[22px]">Warranty Details</h2>
                        <span className="bg-[#039855] text-white text-[15px] font-medium px-3 py-1 rounded-full">
                          Active
                        </span>
                    </header>

                    <div className="space-y-3 montserrat">
                        <h3 className="font-semibold text-[#1D1D1D] text-[19px] leading-0.5">Engine Oil Filter</h3>
                        <p className="text-[#575757] text-[16px] font-medium mb-8 leading-5">EO-1234</p>
                        <p className="text-[#575757] text-[15px] font-normal mb-8">
                            Lorem ipsum dolor sit amet consectetur. Cursus cursus morbi ultrices interdum.
                            Aenean phasellus et viverra hendrerit integer fermentum. Sit tortor dignissim
                            semper faucibus elementum.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-[#575757] font-semibold text-[15px] max-w-[600px]">
                            <li>No Coverage for External Damage</li>
                            <li>Original Invoice Required</li>
                            <li>Water or Fire Damage Not Covered</li>
                        </ul>
                    </div>

                    {/* Warranty Info Cards */}
                    <div className="mt-8 flex flex-wrap gap-6">
                        <InfoCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22.61 19L13.53 9.90997C14.46 7.56997 14 4.80997 12.09 2.90997C9.78996 0.609971 6.20996 0.399971 3.65996 2.25997L7.49996 6.10997L6.07996 7.49997L2.24996 3.68997C0.389961 6.22997 0.599962 9.81997 2.89996 12.11C4.75996 13.97 7.46996 14.46 9.78996 13.59L18.9 22.7C19.29 23.09 19.92 23.09 20.31 22.7L22.61 20.4C23 20 23 19.39 22.61 19ZM19.61 20.59L10.15 11.13C9.53996 11.58 8.85996 11.85 8.14996 11.95C6.78996 12.15 5.35996 11.74 4.31996 10.7C3.36996 9.75997 2.92996 8.49997 2.99996 7.25997L6.08996 10.35L10.33 6.10997L7.23996 2.99997C8.49996 2.94997 9.72996 3.38997 10.68 4.32997C11.1914 4.84063 11.5714 5.46767 11.7873 6.15736C12.0033 6.84706 12.0488 7.57883 11.92 8.28997C11.7951 9.00661 11.4926 9.68049 11.04 10.25L20.5 19.7L19.61 20.59Z"
                                    fill="#575757"/>
                            </svg>
                            }
                            title="Warranty Period"
                            data="1 Year"
                        />
                        <InfoCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M17.2971 6.57202C16.8871 6.57202 16.5471 6.23202 16.5471 5.82202V4.59802C15.7731 4.57202 14.8641 4.57202 13.7971 4.57202H11.7971C10.7291 4.57202 9.82112 4.57202 9.04712 4.59802V5.82202C9.04712 6.23202 8.70712 6.57202 8.29712 6.57202C7.88712 6.57202 7.54712 6.23202 7.54712 5.82202V4.70602C6.60212 4.82902 5.95312 5.06602 5.49712 5.52202C4.89512 6.12402 4.67512 7.06202 4.59412 8.57202H21.0001C20.9191 7.06202 20.6981 6.12402 20.0971 5.52202C19.6411 5.06602 18.9921 4.82902 18.0471 4.70602V5.82202C18.0471 6.23202 17.7071 6.57202 17.2971 6.57202ZM21.0411 10.072C21.0465 10.6007 21.0485 11.184 21.0471 11.822V12.822C21.0471 13.232 21.3871 13.572 21.7971 13.572C22.2071 13.572 22.5471 13.232 22.5471 12.822V11.822C22.5471 7.84202 22.5471 5.85202 21.1571 4.46202C20.3851 3.69002 19.4271 3.34702 18.0471 3.19402V2.32202C18.0471 1.91202 17.7071 1.57202 17.2971 1.57202C16.8871 1.57202 16.5471 1.91202 16.5471 2.32202V3.09702C15.7511 3.07202 14.8421 3.07202 13.7971 3.07202H11.7971C10.7511 3.07202 9.84312 3.07202 9.04712 3.09702V2.32202C9.04712 1.91202 8.70712 1.57202 8.29712 1.57202C7.88712 1.57202 7.54712 1.91202 7.54712 2.32202V3.19402C6.16712 3.34702 5.20912 3.69002 4.43712 4.46202C3.04712 5.85202 3.04712 7.85202 3.04712 11.822V13.822C3.04712 17.802 3.04712 19.792 4.43712 21.182C5.82712 22.572 7.81712 22.572 11.7971 22.572C12.2071 22.572 12.5471 22.232 12.5471 21.822C12.5471 21.412 12.2071 21.072 11.7971 21.072C8.23712 21.072 6.44712 21.072 5.49712 20.122C4.54712 19.172 4.54712 17.382 4.54712 13.822V11.822C4.54645 11.1847 4.54812 10.6014 4.55212 10.072H21.0411ZM17.7971 23.072C15.1771 23.072 13.0471 20.942 13.0471 18.322C13.0471 15.702 15.1771 13.572 17.7971 13.572C20.4171 13.572 22.5471 15.702 22.5471 18.322C22.5471 20.942 20.4171 23.072 17.7971 23.072ZM17.7971 15.072C16.0071 15.072 14.5471 16.532 14.5471 18.322C14.5471 20.112 16.0071 21.572 17.7971 21.572C19.5871 21.572 21.0471 20.112 21.0471 18.322C21.0471 16.532 19.5871 15.072 17.7971 15.072ZM18.2671 19.852C18.4171 20.002 18.6071 20.072 18.7971 20.072C18.9871 20.072 19.1771 20.002 19.3271 19.852C19.6171 19.562 19.6171 19.082 19.3271 18.792L18.5471 18.012V16.322C18.5471 15.912 18.2071 15.572 17.7971 15.572C17.3871 15.572 17.0471 15.912 17.0471 16.322V18.322C17.0471 18.522 17.1271 18.712 17.2671 18.852L18.2671 19.852Z"
                                      fill="#575757"/>
                            </svg>
                            }
                            title="Warranty Start Date"
                            data="2024.05.12"
                        />
                        <InfoCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M17.2971 6.57202C16.8871 6.57202 16.5471 6.23202 16.5471 5.82202V4.59802C15.7731 4.57202 14.8641 4.57202 13.7971 4.57202H11.7971C10.7291 4.57202 9.82112 4.57202 9.04712 4.59802V5.82202C9.04712 6.23202 8.70712 6.57202 8.29712 6.57202C7.88712 6.57202 7.54712 6.23202 7.54712 5.82202V4.70602C6.60212 4.82902 5.95312 5.06602 5.49712 5.52202C4.89512 6.12402 4.67512 7.06202 4.59412 8.57202H21.0001C20.9191 7.06202 20.6981 6.12402 20.0971 5.52202C19.6411 5.06602 18.9921 4.82902 18.0471 4.70602V5.82202C18.0471 6.23202 17.7071 6.57202 17.2971 6.57202ZM21.0411 10.072C21.0465 10.6007 21.0485 11.184 21.0471 11.822V12.822C21.0471 13.232 21.3871 13.572 21.7971 13.572C22.2071 13.572 22.5471 13.232 22.5471 12.822V11.822C22.5471 7.84202 22.5471 5.85202 21.1571 4.46202C20.3851 3.69002 19.4271 3.34702 18.0471 3.19402V2.32202C18.0471 1.91202 17.7071 1.57202 17.2971 1.57202C16.8871 1.57202 16.5471 1.91202 16.5471 2.32202V3.09702C15.7511 3.07202 14.8421 3.07202 13.7971 3.07202H11.7971C10.7511 3.07202 9.84312 3.07202 9.04712 3.09702V2.32202C9.04712 1.91202 8.70712 1.57202 8.29712 1.57202C7.88712 1.57202 7.54712 1.91202 7.54712 2.32202V3.19402C6.16712 3.34702 5.20912 3.69002 4.43712 4.46202C3.04712 5.85202 3.04712 7.85202 3.04712 11.822V13.822C3.04712 17.802 3.04712 19.792 4.43712 21.182C5.82712 22.572 7.81712 22.572 11.7971 22.572C12.2071 22.572 12.5471 22.232 12.5471 21.822C12.5471 21.412 12.2071 21.072 11.7971 21.072C8.23712 21.072 6.44712 21.072 5.49712 20.122C4.54712 19.172 4.54712 17.382 4.54712 13.822V11.822C4.54645 11.1847 4.54812 10.6014 4.55212 10.072H21.0411ZM17.7971 23.072C15.1771 23.072 13.0471 20.942 13.0471 18.322C13.0471 15.702 15.1771 13.572 17.7971 13.572C20.4171 13.572 22.5471 15.702 22.5471 18.322C22.5471 20.942 20.4171 23.072 17.7971 23.072ZM17.7971 15.072C16.0071 15.072 14.5471 16.532 14.5471 18.322C14.5471 20.112 16.0071 21.572 17.7971 21.572C19.5871 21.572 21.0471 20.112 21.0471 18.322C21.0471 16.532 19.5871 15.072 17.7971 15.072ZM18.2671 19.852C18.4171 20.002 18.6071 20.072 18.7971 20.072C18.9871 20.072 19.1771 20.002 19.3271 19.852C19.6171 19.562 19.6171 19.082 19.3271 18.792L18.5471 18.012V16.322C18.5471 15.912 18.2071 15.572 17.7971 15.572C17.3871 15.572 17.0471 15.912 17.0471 16.322V18.322C17.0471 18.522 17.1271 18.712 17.2671 18.852L18.2671 19.852Z"
                                      fill="#575757"/>
                            </svg>
                            }
                            title="Warranty Expiry Date"
                            data="2025.05.12"
                        />
                        <InfoCard
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 21C10.75 21 9.57933 20.7627 8.488 20.288C7.39667 19.8133 6.44667 19.1717 5.638 18.363C4.82933 17.5543 4.18767 16.6043 3.713 15.513C3.23833 14.4217 3.00067 13.2507 3 12C2.99933 10.7493 3.237 9.57867 3.713 8.488C4.189 7.39733 4.83033 6.44733 5.637 5.638C6.44367 4.82867 7.39367 4.187 8.487 3.713C9.58034 3.239 10.7513 3.00133 12 3C13.3667 3 14.6627 3.29167 15.888 3.875C17.1133 4.45833 18.1507 5.28333 19 6.35V5C19 4.71667 19.096 4.47933 19.288 4.288C19.48 4.09667 19.7173 4.00067 20 4C20.2827 3.99933 20.5203 4.09533 20.713 4.288C20.9057 4.48067 21.0013 4.718 21 5V9C21 9.28333 20.904 9.521 20.712 9.713C20.52 9.905 20.2827 10.0007 20 10H16C15.7167 10 15.4793 9.904 15.288 9.712C15.0967 9.52 15.0007 9.28267 15 9C14.9993 8.71733 15.0953 8.48 15.288 8.288C15.4807 8.096 15.718 8 16 8H17.75C17.0667 7.06667 16.225 6.33333 15.225 5.8C14.225 5.26667 13.15 5 12 5C10.05 5 8.396 5.67933 7.038 7.038C5.68 8.39667 5.00067 10.0507 5 12C4.99933 13.9493 5.67867 15.6037 7.038 16.963C8.39734 18.3223 10.0513 19.0013 12 19C13.5833 19 15 18.525 16.25 17.575C17.5 16.625 18.325 15.4 18.725 13.9C18.8083 13.6333 18.9583 13.4333 19.175 13.3C19.3917 13.1667 19.6333 13.1167 19.9 13.15C20.1833 13.1833 20.4083 13.304 20.575 13.512C20.7417 13.72 20.7917 13.9493 20.725 14.2C20.2417 16.1833 19.1917 17.8127 17.575 19.088C15.9583 20.3633 14.1 21.0007 12 21ZM13 11.6L15.5 14.1C15.6833 14.2833 15.775 14.5167 15.775 14.8C15.775 15.0833 15.6833 15.3167 15.5 15.5C15.3167 15.6833 15.0833 15.775 14.8 15.775C14.5167 15.775 14.2833 15.6833 14.1 15.5L11.3 12.7C11.2 12.6 11.125 12.4877 11.075 12.363C11.025 12.2383 11 12.109 11 11.975V8C11 7.71667 11.096 7.47933 11.288 7.288C11.48 7.09667 11.7173 7.00067 12 7C12.2827 6.99933 12.5203 7.09533 12.713 7.288C12.9057 7.48067 13.0013 7.718 13 8V11.6Z"
                                    fill="#575757"/>
                            </svg>
                            }
                            title="Remaining Dates"
                            data="52 Days"
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

type VerificationDropdownProps = {
    label: string;
    placeholder: string;
};

function VerificationDropdown({label, placeholder}: VerificationDropdownProps) {
    return (
        <label className="flex flex-col space-y-2 font-medium text-gray-900">
            <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">{label}</span>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-10 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700"
                />
                {/*<FiSearch*/}
                {/*    size={18}*/}
                {/*    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"*/}
                {/*/>*/}
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20"
                     viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.1935 13.5122L16.6532 15.9719M15.8762 9.1838C15.8762 10.7723 15.2451 12.2958 14.1219 13.419C12.9986 14.5422 11.4752 15.1733 9.88669 15.1733C8.29818 15.1733 6.77473 14.5422 5.65149 13.419C4.52825 12.2958 3.89722 10.7723 3.89722 9.1838C3.89722 7.5953 4.52825 6.07185 5.65149 4.94861C6.77473 3.82537 8.29818 3.19434 9.88669 3.19434C11.4752 3.19434 12.9986 3.82537 14.1219 4.94861C15.2451 6.07185 15.8762 7.5953 15.8762 9.1838Z"
                        stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

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

export default Warranty;
