/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {Role} from "@/types/role";
import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";
import Modal from "@/components/Modal";
import VerificationDropdown from "@/components/VerificationDropdown";
import {CreateComplaintInput} from "@/types/complaint.types";
import {useCreateComplaint} from "@/hooks/useComplaint";
import {useCurrentUser} from "@/utils/auth";
import {usePathname, useRouter} from "next/navigation";
import {signOut} from "next-auth/react";

const SideMenu = () => {

    const user = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();
    const userRole = user?.user_role;

    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const [isComplainModalOpen, setIsComplainModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        category: "",
        customer_name: "",
        phone_number: "",
        email: "",
        vehicle_number: "",
        title: "",
        preferred_solution: "",
        description: "",
    });

    const createComplaintMutation = useCreateComplaint();

    const hasRole = (allowedRoles: string[]) => {
        return userRole && allowedRoles.includes(userRole);
    };


    const getLinkClasses = (path: string) => {
        const isActive = pathname === path || pathname.startsWith(path);

        // Base classes for shape and layout
        const baseClasses = "w-12 h-12 rounded-full flex items-center justify-center transition duration-200";

        // Active: Red background, White icon/text
        if (isActive) {
            return `${baseClasses} bg-[#DB2727] text-white shadow-md`;
        }

        // Inactive: White/Translucent background, Dark icon, Hover effect
        return `${baseClasses} bg-[#FFFFFF8C] bg-opacity/55 text-[#1D1D1D] hover:bg-red-100`;
    };


    const handleSubmit = async () => {
        try {
            await createComplaintMutation.mutateAsync(formData as CreateComplaintInput);
            setIsComplainModalOpen(false);
            // Reset form
            setFormData({
                category: "",
                customer_name: "",
                phone_number: "",
                email: "",
                vehicle_number: "",
                title: "",
                preferred_solution: "",
                description: "",
            });
            // Optional: Show success toast
            console.log("Complaint submitted successfully");
        } catch (error: any) {
            console.error("Error creating complaint:", error);
            alert(`Failed to submit complaint: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleInputChange = (field: keyof CreateComplaintInput, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };


    const handleLogout = async () => {
        await signOut({redirect: false});
        router.push("/login");
    };


    const complainCategories = [
        {value: "service_issue", label: "Service Issue"},
        {value: "product_quality", label: "Product Quality"},
        {value: "billing_error", label: "Billing Error"},
    ];

    const preferredSolutions = [
        {value: "refund", label: "Refund"},
        {value: "replacement", label: "Replacement"},
        {value: "repair", label: "Repair"},
    ];

    return (
        <div>
            <aside className="fixed top-32 left-8 flex flex-col gap-6 z-40">
                <button
                    onClick={() => router.back()}
                    id="back-button"
                    className="w-12 h-12 bg-[#FFFFFF8C] bg-opacity/55 rounded-full flex items-center justify-center hover:bg-red-100 transition">
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <mask
                            id="mask0_555_795"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="19"
                            height="19"
                        >
                            <rect
                                width="19"
                                height="19"
                                transform="matrix(-1 0 0 1 19 0)"
                                fill="#D9D9D9"
                            />
                        </mask>
                        <g mask="url(#mask0_555_795)">
                            <path
                                d="M12.6469 17.4167L14.0521 16.0115L7.54067 9.49999L14.0521 2.98854L12.6469 1.58333L4.73025 9.49999L12.6469 17.4167Z"
                                fill="#575757"
                            />
                        </g>
                    </svg>
                </button>

                {hasRole(["CALLAGENT"]) && (
                    <button
                        onClick={() => setIsComplainModalOpen(true)}
                        className={`w-12 h-12 bg-[#FFFFFF8C] bg-opacity/55 rounded-full flex items-center justify-center hover:bg-red-100 transition ${isComplainModalOpen ? "bg-[#DB2727]" : ""}`}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M21 3.99998V18H16V22L9.9 18H3V3.99998H21ZM19 6H5.00002V16H10.4973L14 18.297V16H19V6ZM12.0438 13.425C12.3641 13.425 12.6288 13.5305 12.8378 13.7414C13.0468 13.9523 13.1513 14.218 13.1512 14.5383C13.1512 14.8547 13.0468 15.1184 12.8378 15.3293C12.6288 15.5402 12.3641 15.6457 12.0438 15.6457C11.7157 15.6457 11.4481 15.5402 11.2411 15.3293C11.0341 15.1184 10.9305 14.8488 10.9305 14.5207C10.9305 14.2082 11.036 13.9475 11.247 13.7385C11.4579 13.5295 11.7235 13.425 12.0438 13.425ZM12.4774 7.05C13.368 7.05 14.0458 7.26094 14.5106 7.68281C14.9208 8.06172 15.1259 8.55391 15.1259 9.15938C15.1259 9.56953 15.0262 9.92011 14.827 10.2111C14.6527 10.4657 14.3587 10.7391 13.9452 11.0311L13.7606 11.1574C13.37 11.4191 13.1298 11.6193 13.0399 11.758C12.9501 11.8967 12.9052 12.1438 12.9052 12.4992V12.7395H11.1766V12.2238C11.1766 11.7277 11.2274 11.382 11.329 11.1867C11.3876 11.0734 11.4657 10.9728 11.5634 10.8849L11.6724 10.794C11.7172 10.7586 11.7705 10.7179 11.8322 10.6721L12.4608 10.2221C12.7262 10.0273 12.9066 9.8742 13.0019 9.76289C13.1288 9.61445 13.1923 9.44063 13.1923 9.24141C13.1923 8.99141 13.1034 8.79316 12.9257 8.64666C12.7479 8.50019 12.5067 8.42695 12.202 8.42695C11.702 8.42695 11.0985 8.62813 10.3915 9.03047L9.87 7.72969C10.7372 7.27656 11.6063 7.05 12.4774 7.05Z"
                                fill="#575757"
                            />
                        </svg>
                    </button>
                )}

                {hasRole(["CALLAGENT"]) && (
                    <Link href="/chat-bot">
                        <div
                            className={`${getLinkClasses("/chat-bot")}relative flex items-center justify-center`}>
                                <span
                                    className="absolute top-3 right-3 border border-[#FBF9F9] w-2 h-2 bg-[#DB2727] rounded-full"/>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19 11.5H19.5C20.435 11.5 20.902 11.5 21.25 11.701C21.478 11.8326 21.6674 12.022 21.799 12.25C22 12.598 22 13.065 22 14C22 14.935 22 15.402 21.799 15.75C21.6674 15.978 21.478 16.1674 21.25 16.299C20.902 16.5 20.435 16.5 19.5 16.5H19M5 11.5H4.5C3.565 11.5 3.098 11.5 2.75 11.701C2.52199 11.8326 2.33265 12.022 2.201 12.25C2 12.598 2 13.065 2 14C2 14.935 2 15.402 2.201 15.75C2.33265 15.978 2.52199 16.1674 2.75 16.299C3.098 16.5 3.565 16.5 4.5 16.5H5M12 5C12.3978 5 12.7794 4.84196 13.0607 4.56066C13.342 4.27936 13.5 3.89782 13.5 3.5C13.5 3.10218 13.342 2.72064 13.0607 2.43934C12.7794 2.15804 12.3978 2 12 2C11.6022 2 11.2206 2.15804 10.9393 2.43934C10.658 2.72064 10.5 3.10218 10.5 3.5C10.5 3.89782 10.658 4.27936 10.9393 4.56066C11.2206 4.84196 11.6022 5 12 5ZM12 5V8M9 12V13M15 12V13M11 8H13C15.828 8 17.243 8 18.121 8.879C19 9.757 19 11.172 19 14C19 16.828 19 18.243 18.121 19.121C17.243 20 15.828 20 13 20H12C12 20 11.5 22 8 22C8 22 9 20.991 9 19.983C7.447 19.936 6.52 19.763 5.879 19.121C5 18.243 5 16.828 5 14C5 11.172 5 9.757 5.879 8.879C6.757 8 8.172 8 11 8Z"
                                    stroke="#575757"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10 16.5C10 16.5 10.667 17 12 17C13.333 17 14 16.5 14 16.5"
                                    stroke="#575757"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </Link>
                )}


                {hasRole(["CALLAGENT", "SALES01", "SALES02", "TELEMARKETER"]) && (
                    <Link
                        href="/warranty"
                        className={getLinkClasses("/warranty")}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M17.25 1.5L18.4448 3.75L21 4.0605L19.125 5.75025L19.5 8.25L17.25 6.84375L15 8.25L15.375 5.75025L13.5 4.0605L16.125 3.75L17.25 1.5Z"
                                fill="#575757"
                            />
                            <path
                                d="M17.0378 9.93676L15.5843 9.56326C15.3237 10.5669 14.7716 11.4709 13.9975 12.1609C13.2235 12.8509 12.2623 13.296 11.2354 13.44C10.2085 13.5839 9.16194 13.4203 8.22798 12.9698C7.29403 12.5193 6.51456 11.802 5.98805 10.9087C5.46154 10.0154 5.21161 8.98602 5.26984 7.95071C5.32807 6.9154 5.69184 5.92058 6.31521 5.09192C6.93857 4.26326 7.79355 3.63795 8.77214 3.29499C9.75072 2.95202 10.809 2.90679 11.8133 3.16501L12.1875 1.71226C10.7235 1.33145 9.17398 1.45402 7.78804 2.06027C6.4021 2.66652 5.2603 3.72122 4.54621 5.05479C3.83212 6.38837 3.58723 7.92334 3.85091 9.41291C4.1146 10.9025 4.87154 12.2601 6.00003 13.2675V22.5L10.5 19.5L15 22.5V13.281C15.9962 12.3933 16.7056 11.2291 17.0378 9.93676ZM13.5 19.6973L10.5 17.697L7.50003 19.6973V14.2875C8.43074 14.7553 9.45783 14.9993 10.4995 15.0001C11.5412 15.0009 12.5686 14.7584 13.5 14.292V19.6973Z"
                                fill="#575757"
                            />
                        </svg>
                    </Link>
                )}

                {hasRole(["ADMIN"]) && (
                    <Link href="/admin/activity-log">
                        <div className={getLinkClasses("/admin/activity-log")}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.0901 2H4.09012V13H6.09014V4.00002H14.2601L18.0901 7.82998V13H20.0901V7.00002L15.0901 2ZM4.01123 21V15.0013H5.3617V19.9416H7.93982V21H4.01123ZM11.1911 14.8955C12.1337 14.8955 12.8562 15.1946 13.3586 15.7929C13.8412 16.3659 14.0825 17.1025 14.0825 18.0027C14.0825 18.9877 13.7974 19.7709 13.2273 20.3523C12.7363 20.8547 12.0575 21.1058 11.1911 21.1058C10.2484 21.1058 9.52592 20.8067 9.02357 20.2084C8.54098 19.6354 8.29968 18.8875 8.29968 17.9646C8.29968 16.9994 8.58473 16.2261 9.15482 15.6447C9.6487 15.1452 10.3274 14.8955 11.1911 14.8955ZM11.1869 15.9538C10.6986 15.9538 10.3218 16.157 10.0565 16.5634C9.81664 16.9303 9.6967 17.4016 9.6967 17.9773C9.6967 18.6434 9.83922 19.1599 10.1242 19.5268C10.3924 19.8739 10.748 20.0475 11.1911 20.0475C11.6765 20.0475 12.0547 19.8429 12.3256 19.4337C12.5655 19.0724 12.6854 18.5954 12.6854 18.0027C12.6854 17.3508 12.5429 16.8414 12.2579 16.4745C11.9898 16.1274 11.6327 15.9538 11.1868 15.9538M20.132 17.6429V20.7036C19.7877 20.8194 19.5449 20.8956 19.4038 20.9322C18.9664 21.048 18.4965 21.1058 17.9941 21.1058C17.0063 21.1058 16.2542 20.8575 15.7377 20.3607C15.1648 19.8132 14.8783 19.0498 14.8783 18.0705C14.8783 16.9444 15.2339 16.0949 15.9451 15.522C16.4616 15.1043 17.1587 14.8955 18.0364 14.8955C18.7872 14.8955 19.4857 15.0323 20.132 15.3061L19.6705 16.3602C19.3657 16.2078 19.099 16.1013 18.8704 16.0406C18.6418 15.9799 18.3906 15.9496 18.1169 15.9496C17.4621 15.9496 16.9795 16.1627 16.669 16.5888C16.4066 16.95 16.2753 17.4256 16.2753 18.0155C16.2753 18.7239 16.4729 19.2573 16.868 19.6157C17.1841 19.9035 17.5764 20.0475 18.0449 20.0475C18.3187 20.0475 18.5783 20.0009 18.8238 19.9078V18.7012H17.7909V17.6429H20.132Z"
                                    fill="#575757"
                                />
                            </svg>
                        </div>
                    </Link>
                )}

                {hasRole(["ADMIN"]) && (
                    <Link href="/admin/star-rating">
                        <div className={getLinkClasses("/admin/star-rating")}>
                        <Image
                            src={"/images/Features-list.svg"}
                            alt="List icon"
                            width={24}
                            height={24}
                            className={pathname === "/admin/star-rating" ? "brightness-0 invert" : ""}
                        />
                        </div>
                    </Link>
                )}

                <button
                    id="setting"
                    className="w-12 h-12 bg-[#FFFFFF8C] bg-opacity/55 rounded-full flex items-center justify-center hover:bg-red-100 transition">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19.9 12.66C19.7397 12.4775 19.6513 12.2429 19.6513 12C19.6513 11.7571 19.7397 11.5225 19.9 11.34L21.18 9.89999C21.3211 9.74266 21.4087 9.54469 21.4302 9.33449C21.4518 9.1243 21.4062 8.91267 21.3 8.72999L19.3 5.26999C19.1949 5.08751 19.0349 4.94286 18.8428 4.85667C18.6506 4.77048 18.4362 4.74714 18.23 4.78999L16.35 5.16999C16.1108 5.21942 15.8618 5.17958 15.6499 5.05799C15.438 4.9364 15.278 4.74147 15.2 4.50999L14.59 2.67999C14.5229 2.48137 14.3951 2.30885 14.2246 2.18683C14.0542 2.06481 13.8497 1.99945 13.64 1.99999H9.64002C9.42195 1.9886 9.20615 2.04891 9.02558 2.1717C8.84501 2.29449 8.7096 2.47301 8.64002 2.67999L8.08002 4.50999C8.00202 4.74147 7.84199 4.9364 7.63013 5.05799C7.41827 5.17958 7.16924 5.21942 6.93002 5.16999L5.00002 4.78999C4.80457 4.76237 4.60532 4.79321 4.42737 4.87863C4.24941 4.96404 4.10072 5.10021 4.00002 5.26999L2.00002 8.72999C1.89118 8.91064 1.84224 9.12107 1.8602 9.33121C1.87816 9.54135 1.9621 9.74043 2.10002 9.89999L3.37002 11.34C3.53034 11.5225 3.61875 11.7571 3.61875 12C3.61875 12.2429 3.53034 12.4775 3.37002 12.66L2.10002 14.1C1.9621 14.2595 1.87816 14.4586 1.8602 14.6688C1.84224 14.8789 1.89118 15.0893 2.00002 15.27L4.00002 18.73C4.10512 18.9125 4.26514 19.0571 4.45727 19.1433C4.6494 19.2295 4.86384 19.2528 5.07002 19.21L6.95002 18.83C7.18924 18.7806 7.43827 18.8204 7.65013 18.942C7.86199 19.0636 8.02202 19.2585 8.10002 19.49L8.71002 21.32C8.7796 21.527 8.91501 21.7055 9.09558 21.8283C9.27615 21.9511 9.49195 22.0114 9.71002 22H13.71C13.9197 22.0005 14.1242 21.9352 14.2946 21.8131C14.4651 21.6911 14.5929 21.5186 14.66 21.32L15.27 19.49C15.348 19.2585 15.508 19.0636 15.7199 18.942C15.9318 18.8204 16.1808 18.7806 16.42 18.83L18.3 19.21C18.5062 19.2528 18.7206 19.2295 18.9128 19.1433C19.1049 19.0571 19.2649 18.9125 19.37 18.73L21.37 15.27C21.4762 15.0873 21.5218 14.8757 21.5002 14.6655C21.4787 14.4553 21.3911 14.2573 21.25 14.1L19.9 12.66ZM18.41 14L19.21 14.9L17.93 17.12L16.75 16.88C16.0298 16.7328 15.2806 16.8551 14.6446 17.2238C14.0086 17.5925 13.5302 18.1818 13.3 18.88L12.92 20H10.36L10 18.86C9.76987 18.1618 9.2914 17.5725 8.65542 17.2038C8.01945 16.8351 7.27024 16.7128 6.55002 16.86L5.37002 17.1L4.07002 14.89L4.87002 13.99C5.36197 13.44 5.63395 12.7279 5.63395 11.99C5.63395 11.2521 5.36197 10.54 4.87002 9.98999L4.07002 9.08999L5.35002 6.88999L6.53002 7.12999C7.25024 7.27721 7.99945 7.15487 8.63542 6.78619C9.2714 6.4175 9.74987 5.82815 9.98002 5.12999L10.36 3.99999H12.92L13.3 5.13999C13.5302 5.83815 14.0086 6.4275 14.6446 6.79619C15.2806 7.16487 16.0298 7.28721 16.75 7.13999L17.93 6.89999L19.21 9.11999L18.41 10.02C17.9236 10.5687 17.655 11.2767 17.655 12.01C17.655 12.7433 17.9236 13.4512 18.41 14ZM11.64 7.99999C10.8489 7.99999 10.0755 8.23458 9.41774 8.67411C8.75994 9.11363 8.24725 9.73835 7.9445 10.4693C7.64175 11.2002 7.56254 12.0044 7.71688 12.7803C7.87122 13.5563 8.25218 14.269 8.81159 14.8284C9.371 15.3878 10.0837 15.7688 10.8597 15.9231C11.6356 16.0775 12.4398 15.9983 13.1708 15.6955C13.9017 15.3928 14.5264 14.8801 14.9659 14.2223C15.4054 13.5645 15.64 12.7911 15.64 12C15.64 10.9391 15.2186 9.9217 14.4684 9.17156C13.7183 8.42141 12.7009 7.99999 11.64 7.99999ZM11.64 14C11.2445 14 10.8578 13.8827 10.5289 13.6629C10.2 13.4432 9.94363 13.1308 9.79226 12.7654C9.64088 12.3999 9.60128 11.9978 9.67845 11.6098C9.75562 11.2218 9.9461 10.8655 10.2258 10.5858C10.5055 10.3061 10.8619 10.1156 11.2498 10.0384C11.6378 9.96125 12.0399 10.0009 12.4054 10.1522C12.7708 10.3036 13.0832 10.5599 13.303 10.8888C13.5227 11.2177 13.64 11.6044 13.64 12C13.64 12.5304 13.4293 13.0391 13.0542 13.4142C12.6792 13.7893 12.1705 14 11.64 14Z"
                            fill="#575757"
                        />
                    </svg>
                </button>
                <button
                    id="log-out"
                    onClick={handleLogout}
                    className="fixed bottom-8 left-8 w-12 h-12 bg-[#FFFFFF8C] bg-opacity/55 rounded-full flex items-center justify-center hover:bg-red-100 transition">
                    {/*<FiUser size={24} className="text-gray-700"/>*/}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 21C4.45 21 3.97933 20.8043 3.588 20.413C3.19667 20.0217 3.00067 19.5507 3 19V5C3 4.45 3.196 3.97933 3.588 3.588C3.98 3.19667 4.45067 3.00067 5 3H12V5H5V19H12V21H5ZM16 17L14.625 15.55L17.175 13H9V11H17.175L14.625 8.45L16 7L21 12L16 17Z"
                            fill="#575757"
                        />
                    </svg>
                </button>
            </aside>


            {isComplainModalOpen && (
                <Modal
                    title="Complaints"
                    onClose={() => setIsComplainModalOpen(false)}
                    actionButton={{
                        label: "Submit",
                        onClick: handleSubmit,
                        // disabled: createComplaintMutation.isPending,
                    }}
                    isPriorityAvailable={false}
                >
                    <div>
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <VerificationDropdown
                                        label="Complain Category"
                                        placeholder="Select Category"
                                        value={formData.category || ""}
                                        onChange={(value: string) => handleInputChange("category", value)}
                                        options={complainCategories}
                                        isIcon={false}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="flex-1 space-y-6 mt-10">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="font-semibold text-[19px] mb-6">Customer Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Customer Name</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Customer Name"
                                            value={formData.customer_name || ""}
                                            onChange={(e) => handleInputChange("customer_name", e.target.value)}
                                            className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Phone Number</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            value={formData.phone_number || ""}
                                            onChange={(e) => handleInputChange("phone_number", e.target.value)}
                                            className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Email Address</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Email Address"
                                            value={formData.email || ""}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Vehicle Number</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Vehicle Number"
                                            value={formData.vehicle_number || ""}
                                            onChange={(e) => handleInputChange("vehicle_number", e.target.value)}
                                            className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 mt-10">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="font-semibold text-[19px] mb-6">Complaint Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Complain Title</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Complain Title"
                                            value={formData.title || ""}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                        />
                                    </div>
                                </label>
                                <VerificationDropdown label="Preferred Solution"
                                                      placeholder="Select Preferred Solution"
                                                      value={formData.preferred_solution || ""}
                                                      onChange={(value: string) => handleInputChange("preferred_solution", value)}
                                                      options={preferredSolutions}
                                                      isIcon={false}/>
                            </div>

                            <div className="flex flex-col space-y-2 font-medium text-gray-900">
                                <span
                                    className="text-[#1D1D1D] font-medium text-[17px] montserrat">Complaint Description</span>
                                <textarea placeholder="Complaint Description" rows={5}
                                          value={formData.description || ""}
                                          onChange={(e) => handleInputChange("description", e.target.value)}
                                          className="w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700"/>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SideMenu;
