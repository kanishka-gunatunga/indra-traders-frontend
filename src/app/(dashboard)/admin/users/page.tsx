/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useCheckHandover, useCreateUser, useUpdateUser, useUsers} from "@/hooks/useUser";
import {useCurrentUser} from "@/utils/auth";
import {useToast} from "@/hooks/useToast";
import Toast from "@/components/Toast";

// const userRoles = [
//     "Admin",
//     "Sales Lv 1",
//     "Sales Lv 2",
//     "Call Agent",
//     "Telemarketer",
// ];

const ROLES = {
    ADMIN: "ADMIN",
    SALES_LV1: "SALES01",
    SALES_LV2: "SALES02",
    SALES_LV3: "SALES03",
    CALL_AGENT: "CALLAGENT",
    TELEMARKETER: "TELEMARKETER",
};

const departments = ["ITPL", "ISP", "IMS", "IFT"];
const branches = ["Bambalapitiya", "Kandy", "Jaffna", "Galle", "Negombo"];

const languageOptions = [
    {code: "en", label: "English", badge: "EN"},
    {code: "si", label: "Sinhala", badge: "SI"},
    {code: "ta", label: "Tamil", badge: "TA"},
];


export default function UserManagement() {

    const [filters, setFilters] = useState({
        user_role: "",
        department: "",
        branch: "",
    });

    const user = useCurrentUser();

    const checkHandoverMutation = useCheckHandover();

    const {data: users = [], isLoading} = useUsers(filters);
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();

    const {toast, showToast, hideToast} = useToast();

    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const [isAddNewUserModalOpen, setIsAddNewUserModalOpen] = useState(false);
    const [isFilterUserModalOpen, setIsFilterUserModalOpen] = useState(false);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

    const [fullName, setFullName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [userRole, setUserRole] = useState("");
    const [department, setDepartment] = useState("");
    const [branch, setBranch] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [userLanguages, setUserLanguages] = useState<string[]>(["en"]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

    const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
    const [replacementUsers, setReplacementUsers] = useState<any[]>([]);
    const [selectedReplacementId, setSelectedReplacementId] = useState<string>("");
    const [handoverCount, setHandoverCount] = useState(0);
    const [pendingUpdatePayload, setPendingUpdatePayload] = useState<any>(null);

    const parseLanguages = (langData: any): string[] => {
        if (!langData) return ["en"];
        if (Array.isArray(langData)) return langData;
        if (typeof langData === "string") {
            try {
                if (langData.trim() === "") return ["en"];
                const parsed = JSON.parse(langData);
                return Array.isArray(parsed) ? parsed : ["en"];
            } catch (e) {
                return ["en"];
            }
        }
        return ["en"];
    };

    const toggleCreateLanguage = (code: string) => {
        if (userLanguages.includes(code)) {
            if (userLanguages.length > 1) {
                setUserLanguages(userLanguages.filter((l) => l !== code));
            }
        } else {
            setUserLanguages([...userLanguages, code]);
        }
    };

    const toggleUpdateLanguage = (code: string) => {
        const currentLangs = parseLanguages(selectedUser.languages);
        let newLangs;
        if (currentLangs.includes(code)) {
            if (currentLangs.length > 1) {
                newLangs = currentLangs.filter((l: string) => l !== code);
            } else {
                newLangs = currentLangs;
            }
        } else {
            newLangs = [...currentLangs, code];
        }
        setSelectedUser({...selectedUser, languages: newLangs});
    };

    const shouldShowLanguages = (role: string) => role === ROLES.CALL_AGENT;
    const shouldShowBranch = (role: string) => role !== ROLES.ADMIN;
    const shouldShowDepartment = (role: string) => role !== ROLES.CALL_AGENT;

    const resetAddForm = () => {
        setFullName("");
        setContactNumber("");
        setEmail("");
        setDepartment("");
        setBranch("");
        setUserRole("");
        setPassword("");
        setConfirmPassword("");
        setUserLanguages(["en"]);
    }

    const handleUpdateClick = async () => {
        const originalUser = users.find((u: any) => u.id === selectedUser.id);

        if (!originalUser) {
            showToast("Error: Original user data not found", "error");
            return;
        }

        const payload = {
            full_name: selectedUser.full_name,
            contact_no: selectedUser.contact_no,
            email: selectedUser.email,
            user_role: selectedUser.user_role,
            department: shouldShowDepartment(selectedUser.user_role) ? selectedUser.department : null,
            branch: shouldShowBranch(selectedUser.user_role) ? selectedUser.branch : null,
            languages: shouldShowLanguages(selectedUser.user_role) ? selectedUser.languages : ["en"],
            // Password is valid to take from state because it's distinct from selectedUser
            ...(password ? {password, confirm_password: confirmPassword} : {})
        };

        const isRoleChanged = originalUser.user_role !== payload.user_role;
        const isDeptChanged = originalUser.department !== payload.department;
        // Handle null/empty string mismatches safely
        const isBranchChanged = (originalUser.branch || "") !== (payload.branch || "");

        if (!isRoleChanged && !isDeptChanged && !isBranchChanged) {
            await performUpdate(payload);
            return;
        }

        try {
            const check = await checkHandoverMutation.mutateAsync(selectedUser.id);

            if (check.needsHandover && check.activeLeadsCount > 0) {
                setPendingUpdatePayload(payload);
                setReplacementUsers(check.replacements);
                setHandoverCount(check.activeLeadsCount);
                setIsHandoverModalOpen(true);
            } else {
                await performUpdate(payload);
            }
        } catch (e) {
            console.error(e);
            showToast("Failed to check user requirements", "error");
        }
    };

    const performUpdate = async (payload: any, transferId?: string) => {
        try {
            const finalPayload = transferId ? {...payload, transferToUserId: transferId} : payload;
            await updateUserMutation.mutateAsync({
                id: selectedUser.id,
                data: finalPayload
            });

            showToast("User updated successfully!", "success");
            setIsUserDetailsModalOpen(false);
            setIsHandoverModalOpen(false);
            setPendingUpdatePayload(null);
            setSelectedReplacementId("");

        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to update user";
            showToast(msg, "error");
        }
    };


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
                    title="User Management"
                />

                {/* User Management Section */}
                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">User Management</span>
                        <div className="flex gap-5">
                            <button
                                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={() => setIsFilterUserModalOpen(true)}
                            >
                                <Image
                                    src={"/images/admin/flowbite_filter-outline.svg"}
                                    width={24}
                                    height={24}
                                    alt="Filter icon"
                                />
                            </button>
                            <button
                                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={() => setIsAddNewUserModalOpen(true)}
                            >
                                <Image
                                    src={"/images/sales/plus.svg"}
                                    width={24}
                                    height={24}
                                    alt="Plus icon"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="w-full mt-5 ">
                        <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                            <div className="min-w-[1000px] ">
                                {/* Table header */}
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/7 px-3 py-2">Full Name</div>
                                    <div className="w-1/7 px-3 py-2">Contact No.</div>
                                    <div className="w-1/7 px-3 py-2">Email</div>
                                    <div className="w-1/7 px-3 py-2">User Role</div>
                                    <div className="w-1/7 px-3 py-2">Department</div>
                                    <div className="w-1/7 px-3 py-2">Branch</div>
                                    <div className="w-1/7 px-3 py-2">Languages</div>
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {isLoading ? (
                                        <div className="text-center py-5">Loading users...</div>
                                    ) : users.length === 0 ? (
                                        <div className="text-center py-5 text-gray-500">No users found</div>
                                    ) : (
                                        users.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex text-lg mt-1 text-black hover:bg-gray-50 transition items-center cursor-pointer"
                                                onClick={() => {
                                                    // setSelectedUser(item);
                                                    setSelectedUser({
                                                        ...item,
                                                        languages: parseLanguages(item.languages)
                                                    });

                                                    setFullName(item.full_name);
                                                    setContactNumber(item.contact_no);
                                                    setEmail(item.email);
                                                    setUserRole(item.user_role);
                                                    setDepartment(item.department);
                                                    setBranch(item.branch || "");
                                                    setUserLanguages(parseLanguages(item.languages));
                                                    setPassword("");
                                                    setConfirmPassword("");

                                                    setIsUserDetailsModalOpen(true);
                                                }}
                                            >
                                                <div className="w-1/7 px-3 py-2">{item.full_name}</div>
                                                <div className="w-1/7 px-3 py-2">{item.contact_no}</div>
                                                <div className="w-1/7 px-3 py-2" style={{
                                                    wordBreak: "normal",
                                                    overflowWrap: "anywhere",
                                                }}>{item.email}</div>
                                                <div className="w-1/7 px-3 py-2">{item.user_role}</div>
                                                <div className="w-1/7 px-3 py-2">
                                                    {item.department || "-"}
                                                </div>
                                                <div className="w-1/7 px-3 py-2">{item.branch || "-"}</div>
                                                <div className="w-1/7 px-3 py-2 flex gap-1 items-center">
                                                    {parseLanguages(item.languages).map((lang: string) => (
                                                        <span key={lang}
                                                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded uppercase">
                                                            {lang}
                                                        </span>
                                                    ))}
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

            {/* Add New User Modal */}
            {isAddNewUserModalOpen && (
                <Modal
                    title="User Management"
                    onClose={() => setIsAddNewUserModalOpen(false)}
                    // actionButton={{
                    //     label: "Add",
                    //     onClick: () => {
                    //         console.log("Saved user data:", {
                    //             fullName,
                    //             contactNumber,
                    //             email,
                    //             department,
                    //             branch,
                    //             userRole,
                    //             password,
                    //             confirmPassword,
                    //         });
                    //         // Reset form
                    //         setFullName("");
                    //         setContactNumber("");
                    //         setEmail("");
                    //         setBranch("");
                    //         setDepartment("");
                    //         setUserRole("");
                    //         setPassword("");
                    //         setConfirmPassword("");
                    //         setIsAddNewUserModalOpen(false);
                    //     },
                    // }}

                    actionButton={{
                        label: "Add",
                        onClick: async () => {
                            if (password !== confirmPassword) {
                                showToast("Passwords do not match!", "error");
                                return;
                            }
                            try {
                                const payload = {
                                    full_name: fullName,
                                    contact_no: contactNumber,
                                    email,
                                    user_role: userRole,
                                    department: shouldShowDepartment(userRole) ? department : null,
                                    password,
                                    confirm_password: confirmPassword,
                                    branch: shouldShowBranch(userRole) ? branch : null,
                                    languages: shouldShowLanguages(userRole) ? userLanguages : ["en"],
                                };

                                await createUserMutation.mutateAsync(payload);
                                showToast("User created successfully!", "success");
                                setIsAddNewUserModalOpen(false);
                                resetAddForm();
                            } catch (error: any) {
                                console.error("Error creating user:", error);
                                const msg = error.response?.data?.message || "Failed to create user";
                                showToast(msg, "error");
                            }
                        },
                    }}

                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                        <div>
                            <label className="block mb-2 font-medium">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="Full Name"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Contact No</label>
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="Contact No"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <div>
                                <label className="block mb-2 font-medium">User Role</label>
                                <div
                                    className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                                    <select
                                        value={userRole}
                                        onChange={(e) => {
                                            setUserRole(e.target.value);
                                            if (e.target.value !== ROLES.CALL_AGENT) setUserLanguages(["en"]);
                                            if (e.target.value === ROLES.ADMIN) setBranch("");
                                        }}
                                        className="w-full bg-transparent outline-none appearance-none"
                                    >
                                        <option value="" disabled>User Role</option>
                                        <option value={ROLES.ADMIN}>Admin</option>
                                        <option value={ROLES.SALES_LV1}>Sales Lv 1</option>
                                        <option value={ROLES.SALES_LV2}>Sales Lv 2</option>
                                        <option value={ROLES.SALES_LV3}>Sales Lv 3</option>
                                        <option value={ROLES.CALL_AGENT}>Call Agent</option>
                                        <option value={ROLES.TELEMARKETER}>Telemarketer</option>
                                    </select>
                                    <span className="absolute right-4 pointer-events-none">
                                        <Image
                                            src={"/images/sales/icon-park-solid_down-one.svg"}
                                            width={19}
                                            height={19}
                                            alt="Arrow"
                                        />
                                      </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
                        {shouldShowDepartment(userRole) && (
                            <div>
                                <label className="block mb-2 font-medium">Department</label>
                                <div
                                    className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full bg-transparent outline-none appearance-none"
                                    >
                                        <option value="" disabled>Select Department</option>
                                        {/*<option value="ITPL">ITPL</option>*/}
                                        {/*<option value="ISP">ISP</option>*/}
                                        {/*<option value="IMS">IMS</option>*/}
                                        {/*<option value="IFT">IFT</option>*/}
                                        {departments.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-4 pointer-events-none">
                                  <Image
                                      src={"/images/sales/icon-park-solid_down-one.svg"}
                                      width={19}
                                      height={19}
                                      alt="Arrow"
                                  />
                                </span>
                                </div>
                            </div>
                        )}

                        {shouldShowBranch(userRole) && (
                            <div>
                                <label className="block mb-2 font-medium">Branch</label>
                                <div
                                    className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                                    <select
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="w-full bg-transparent outline-none appearance-none"
                                    >
                                        <option disabled value="">Select Branch</option>
                                        {/*<option value="BAMBALAPITIYA">Bambalapitiya</option>*/}
                                        {/*<option value="KANDY">Kandy</option>*/}
                                        {/*<option value="JAFFNA">Jaffna</option>*/}
                                        {/*<option value="GALLE">Galle</option>*/}
                                        {/*<option value="NEGOMBO">Negombo</option>*/}
                                        {branches.map((b) => (
                                            <option key={b} value={b.toUpperCase()}>{b}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-4 pointer-events-none">
                                  <Image
                                      src={"/images/sales/icon-park-solid_down-one.svg"}
                                      width={19}
                                      height={19}
                                      alt="Arrow"
                                  />
                                </span>
                                </div>
                            </div>
                            // ) : (
                            //     <div></div>
                        )}

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 pr-10"
                                    placeholder="Password"
                                />
                                <span
                                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                  {showPassword ? <FaEye/> : <FaEyeSlash/>}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-2 font-medium">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 pr-10"
                                    placeholder="Confirm Password"
                                />
                                <span
                                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                  {showConfirmPassword ? <FaEye/> : <FaEyeSlash/>}
                                </span>
                            </div>
                        </div>
                    </div>

                    {shouldShowLanguages(userRole) && (
                        <div className="w-full mt-5">
                            <label className="block mb-2 font-medium">Languages</label>
                            <div className="flex gap-3">
                                {languageOptions.map((lang) => {
                                    const isSelected = userLanguages.includes(lang.code);
                                    return (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => toggleCreateLanguage(lang.code)}
                                            className={`px-4 py-2 rounded-full cursor-pointer border text-sm font-medium transition
                                ${isSelected
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                            }
                            `}
                                        >
                                            {lang.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            {/* User Filter Modal */}
            {isFilterUserModalOpen && (
                <Modal
                    title="Filter"
                    onClose={() => setIsFilterUserModalOpen(false)}
                    actionButton={{
                        label: "Apply",
                        onClick: () => {
                            setFilters({
                                user_role: selectedRoles[0] || "",
                                department: selectedDepartments[0] || "",
                                branch: selectedBranches[0] || "",
                            });
                            setIsFilterUserModalOpen(false);
                        },
                    }}
                >
                    {/* --- User Role --- */}
                    <div className="w-full">
                        <span className="font-montserrat font-semibold text-lg leading-[100%]">
                          User Role
                        </span>
                        <div className="w-full mt-5 flex gap-3 flex-wrap">
                            {Object.values(ROLES).map((roleVal) => {
                                const isSelected = selectedRoles.includes(roleVal);
                                return (
                                    <div
                                        key={roleVal}
                                        className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                                            ${isSelected ? "bg-blue-500 text-white border-none" : ""}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedRoles(selectedRoles.filter((r) => r !== roleVal));
                                            } else {
                                                setSelectedRoles([roleVal]);
                                            }
                                        }}
                                    >
                                        {roleVal === ROLES.SALES_LV1 ? "Sales Lv 1" :
                                            roleVal === ROLES.SALES_LV2 ? "Sales Lv 2" :
                                                roleVal === ROLES.SALES_LV3 ? "Sales Lv 3" :
                                                    roleVal === ROLES.CALL_AGENT ? "Call Agent" :
                                                        roleVal.charAt(0).toUpperCase() + roleVal.slice(1).toLowerCase()}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- Department --- */}
                    <div className="w-full mt-5">
                        <span className="font-montserrat font-semibold text-lg leading-[100%]">
                          Department
                        </span>
                        <div className="w-full mt-5 flex gap-3 flex-wrap">
                            {departments.map((dept) => {
                                const isSelected = selectedDepartments.includes(dept);
                                return (
                                    <div
                                        key={dept}
                                        className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                                            ${isSelected ? "bg-blue-500 text-white border-none" : ""}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedDepartments(selectedDepartments.filter((d) => d !== dept));
                                            } else {
                                                setSelectedDepartments([dept]);
                                            }
                                        }}
                                    >
                                        {dept}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- Branch --- */}
                    <div className="w-full mt-5">
                        <span className="font-montserrat font-semibold text-lg leading-[100%]">
                          Branch
                        </span>
                        <div className="w-full mt-5 flex gap-3 flex-wrap">
                            {branches.map((branch) => {
                                const isSelected = selectedBranches.includes(branch);
                                return (
                                    <div
                                        key={branch}
                                        className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                                        ${isSelected ? "bg-blue-500 text-white border-none" : ""}`}
                                        onClick={() => {
                                            const val = branch.toUpperCase();
                                            if (isSelected) {
                                                setSelectedBranches(selectedBranches.filter((b) => b !== val));
                                            } else {
                                                setSelectedBranches([val]);
                                            }
                                        }}
                                    >
                                        {branch}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Modal>
            )}

            {/* User Details Modal */}
            {/*{isUserDetailsModalOpen && (*/}
            {/*    <Modal*/}
            {/*        title="User Details"*/}
            {/*        onClose={() => setIsUserDetailsModalOpen(false)}*/}
            {/*        actionButton={{*/}
            {/*            label: "",*/}
            {/*            icon: (*/}
            {/*                <Image*/}
            {/*                    src="/images/mdi_edit-outline.svg"*/}
            {/*                    alt="Edit"*/}
            {/*                    width={24}*/}
            {/*                    height={24}*/}
            {/*                />*/}
            {/*            ),*/}
            {/*            onClick: () => {*/}
            {/*                setIsUserDetailsModalOpen(false);*/}
            {/*            },*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <div className="w-full min-w-[800px] mt-3 space-y-2">*/}
            {/*            /!* Row *!/*/}
            {/*            <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">*/}
            {/*                <div className="text-lg font-semibold">Full Name:</div>*/}
            {/*                <div className="text-lg text-[#575757] break-words">*/}
            {/*                    Devon Lane*/}
            {/*                </div>*/}
            {/*                <div className="text-lg font-semibold">User Role:</div>*/}
            {/*                <div className="relative">*/}
            {/*                    <select*/}
            {/*                        className="w-full appearance-none bg-transparent text-lg text-[#575757] pr-6 cursor-pointer focus:outline-none"*/}
            {/*                        defaultValue="Sales Lv 1"*/}
            {/*                    >*/}
            {/*                        <option>Sales Lv 1</option>*/}
            {/*                        <option>Sales Lv 2</option>*/}
            {/*                        <option>Sales Lv 3</option>*/}
            {/*                    </select>*/}
            {/*                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">*/}
            {/*      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">*/}
            {/*        <path d="M0 0L5 6L10 0H0Z" fill="#575757"/>*/}
            {/*      </svg>*/}
            {/*    </span>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* Another Row *!/*/}
            {/*            <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">*/}
            {/*                <div className="text-lg font-semibold">Contact No:</div>*/}
            {/*                <div className="text-lg text-[#575757]">077 5898712</div>*/}
            {/*                <div className="text-lg font-semibold">Department:</div>*/}
            {/*                <div className="relative">*/}
            {/*                    <select*/}
            {/*                        className="w-full appearance-none bg-transparent text-lg text-[#575757] pr-6 cursor-pointer focus:outline-none"*/}
            {/*                        defaultValue="ITPL"*/}
            {/*                    >*/}
            {/*                        <option>ITPL</option>*/}
            {/*                        <option>IST</option>*/}
            {/*                        <option>IFT</option>*/}
            {/*                    </select>*/}
            {/*                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">*/}
            {/*      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">*/}
            {/*        <path d="M0 0L5 6L10 0H0Z" fill="#575757"/>*/}
            {/*      </svg>*/}
            {/*    </span>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* Email Row *!/*/}
            {/*            <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">*/}
            {/*                <div className="text-lg font-semibold">Email:</div>*/}
            {/*                <div className="text-lg text-[#575757] break-words">*/}
            {/*                    Devon@infos.com*/}
            {/*                </div>*/}
            {/*                <div className="text-lg font-semibold">Branch:</div>*/}
            {/*                <div className="text-lg text-[#575757]">Kandy</div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Modal>*/}
            {/*)}*/}

            {isUserDetailsModalOpen && selectedUser && (
                <Modal
                    title="User Details"
                    onClose={() => setIsUserDetailsModalOpen(false)}
                    // actionButton={{
                    //     label: "Update",
                    //     onClick: async () => {
                    //         try {
                    //             const role = selectedUser.user_role;
                    //             await updateUserMutation.mutateAsync({
                    //                 id: selectedUser.id,
                    //                 // full_name: selectedUser.full_name,
                    //                 // contact_no: selectedUser.contact_no,
                    //                 // email: selectedUser.email,
                    //                 // user_role: selectedUser.user_role,
                    //                 // department: selectedUser.department,
                    //                 // branch: selectedUser.branch,
                    //                 data: {
                    //                     full_name: selectedUser.full_name,
                    //                     contact_no: selectedUser.contact_no,
                    //                     email: selectedUser.email,
                    //                     user_role: selectedUser.user_role,
                    //                     department: selectedUser.department,
                    //                     branch: shouldShowBranch(role) ? selectedUser.branch : null,
                    //                     languages: shouldShowLanguages(role) ? selectedUser.languages : ["en"],
                    //                 },
                    //             });
                    //             showToast("User updated successfully!", "success");
                    //             setIsUserDetailsModalOpen(false);
                    //         } catch (error: any) {
                    //             console.error("Error updating user:", error);
                    //             const msg = error.response?.data?.message || "Failed to update user";
                    //             showToast(msg, "error");
                    //         }
                    //     },
                    // }}
                    actionButton={{
                        label: "Update",
                        onClick: handleUpdateClick,
                        // disabled: checkHandoverMutation.isPending || updateUserMutation.isPending
                    }}
                >
                    <div className="w-full min-w-[800px] mt-3 space-y-2">
                        <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">
                            <div className="text-lg font-semibold">Full Name:</div>
                            <input
                                type="text"
                                value={selectedUser.full_name}
                                onChange={(e) =>
                                    setSelectedUser({...selectedUser, full_name: e.target.value})
                                }
                                className="text-lg text-[#575757] bg-transparent border-b border-gray-400 focus:outline-none"
                            />
                            <div className="text-lg font-semibold">User Role:</div>
                            <select
                                value={selectedUser.user_role}
                                onChange={(e) => {
                                    const newRole = e.target.value;
                                    const updates: any = {user_role: newRole};
                                    if (newRole === ROLES.ADMIN) updates.branch = "";
                                    if (newRole !== ROLES.CALL_AGENT) updates.languages = ["en"];

                                    setSelectedUser({...selectedUser, ...updates});
                                }}
                                className="bg-transparent text-lg text-[#575757] border-b border-gray-400 focus:outline-none"
                            >
                                <option value={ROLES.SALES_LV1}>Sales Lv 1</option>
                                <option value={ROLES.SALES_LV2}>Sales Lv 2</option>
                                <option value={ROLES.SALES_LV3}>Sales Lv 3</option>
                                <option value={ROLES.CALL_AGENT}>Call Agent</option>
                                <option value={ROLES.ADMIN}>Admin</option>
                                <option value={ROLES.TELEMARKETER}>Telemarketer</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">
                            <div className="text-lg font-semibold">Contact No:</div>
                            <input
                                type="text"
                                value={selectedUser.contact_no}
                                onChange={(e) =>
                                    setSelectedUser({...selectedUser, contact_no: e.target.value})
                                }
                                className="text-lg text-[#575757] bg-transparent border-b border-gray-400 focus:outline-none"
                            />
                            {shouldShowDepartment(selectedUser.user_role) ? (
                                <>
                                    <div className="text-lg font-semibold">Department:</div>
                                    <select
                                        value={selectedUser.department}
                                        onChange={(e) =>
                                            setSelectedUser({...selectedUser, department: e.target.value})
                                        }
                                        className="bg-transparent text-lg text-[#575757] border-b border-gray-400 focus:outline-none"
                                    >
                                        {departments.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <>
                                    <div></div>
                                    <div></div>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">
                            <div className="text-lg font-semibold">Email:</div>
                            <input
                                type="text"
                                value={selectedUser.email}
                                onChange={(e) =>
                                    setSelectedUser({...selectedUser, email: e.target.value})
                                }
                                className="text-lg text-[#575757] bg-transparent border-b border-gray-400 focus:outline-none"
                            />
                            {shouldShowBranch(selectedUser.user_role) ? (
                                <>
                                    <div className="text-lg font-semibold">Branch:</div>
                                    <select
                                        value={selectedUser.branch}
                                        onChange={(e) =>
                                            setSelectedUser({...selectedUser, branch: e.target.value})
                                        }
                                        className="bg-transparent text-lg text-[#575757] border-b border-gray-400 focus:outline-none"
                                    >
                                        {branches.map((b) => (
                                            <option key={b} value={b.toUpperCase()}>{b}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <>
                                    <div></div>
                                    <div></div>
                                </>
                            )}

                        </div>

                        {shouldShowLanguages(selectedUser.user_role) && (
                            <div className="grid grid-cols-[150px_1fr] gap-4 items-start pt-2">
                                <div className="text-lg font-semibold">Languages:</div>
                                <div className="flex gap-3">
                                    {languageOptions.map((lang) => {
                                        const currentLangs = parseLanguages(selectedUser.languages);
                                        const isSelected = currentLangs.includes(lang.code);
                                        return (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                onClick={() => toggleUpdateLanguage(lang.code)}
                                                className={`px-4 py-1 rounded-full border text-sm font-medium transition
                                  ${isSelected
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                }
                              `}
                                            >
                                                {lang.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}


            {isHandoverModalOpen && (
                <Modal
                    title="Required: Lead Handover"
                    onClose={() => setIsHandoverModalOpen(false)}
                    actionButton={{
                        label: "Transfer",
                        onClick: () => {
                            if (!selectedReplacementId) {
                                showToast("Please select a user to transfer leads to", "error");
                                return;
                            }
                            performUpdate(pendingUpdatePayload, selectedReplacementId);
                        },
                        // disabled: updateUserMutation.isPending
                    }}
                >
                    <div className="w-full min-w-[500px] p-2">
                        <div
                            className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl mb-6 flex items-start gap-3">
                            <Image src="/error-white.svg" width={24} height={24} alt="warning"/>
                            <div>
                                <h4 className="font-bold">Active Leads Detected</h4>
                                <p className="text-sm mt-1">
                                    <strong>{selectedUser.full_name}</strong> has <strong>{handoverCount}</strong> active
                                    ongoing leads in the
                                    <span className="font-semibold mx-1">{selectedUser.department}</span> department.
                                </p>
                                <p className="text-sm mt-2">
                                    Before changing their details, you must re-assign these leads to a colleague in the
                                    same branch and department.
                                </p>
                            </div>
                        </div>

                        <label className="block mb-2 font-medium">Select Replacement User</label>
                        <div
                            className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                            <select
                                value={selectedReplacementId}
                                onChange={(e) => setSelectedReplacementId(e.target.value)}
                                className="w-full bg-transparent outline-none appearance-none"
                            >
                                <option value="" disabled>Select Colleague</option>
                                {replacementUsers.length > 0 ? (
                                    replacementUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.full_name} ({u.email})
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No eligible users found in this branch/dept</option>
                                )}
                            </select>
                            <span className="absolute right-4 pointer-events-none">
                     <Image src={"/images/sales/icon-park-solid_down-one.svg"} width={19} height={19} alt="Arrow"/>
                </span>
                        </div>

                        {replacementUsers.length === 0 && (
                            <p className="text-red-500 text-sm mt-2">
                                * No other users found in {selectedUser.branch} - {selectedUser.department}.
                                Please create another user first or manually reassign leads individually.
                            </p>
                        )}
                    </div>
                </Modal>
            )}

        </div>
    );
}
