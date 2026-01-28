/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { userService } from "@/services/userService";
import { useCurrentUser } from "@/utils/auth";
import RedSpinner from "@/components/RedSpinner";
import Toast from "@/components/Toast";
import { Eye, EyeOff } from "lucide-react";

const ProfilePage = () => {
    const user = useCurrentUser();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
        visible: false,
        message: "",
        type: "success"
    });

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [branch, setBranch] = useState("");
    const [role, setRole] = useState("");

    // Password Reset State
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
        }
    }, [user?.id]);

    const showToast = (message: string, type: "success" | "error") => {
        setToastConfig({ visible: true, message, type });
    };

    const handleCloseToast = () => {
        setToastConfig((prev) => ({ ...prev, visible: false }));
    };

    const fetchProfile = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const userData = await userService.getUserById(user.id);

            // Split full name
            const names = (userData.full_name || "").split(" ");
            const fName = names[0] || "";
            const lName = names.slice(1).join(" ") || "";

            setFirstName(fName);
            setLastName(lName);
            setEmail(userData.email || "");
            setDepartment(userData.department || "");
            setBranch(userData.branch || "");
            setRole(userData.user_role || "");
        } catch (error) {
            console.error("Error fetching profile:", error);
            showToast("Failed to load profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        try {
            setSaving(true);

            const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

            const updateData: any = {
                full_name: fullName
            };

            if (password) {
                updateData.password = password;
                updateData.confirm_password = confirmPassword;
            }

            await userService.updateProfile(updateData);
            showToast("Profile updated successfully", "success");

            // Clear password fields on success
            setPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            console.error("Error updating profile:", error);
            showToast(error.response?.data?.message || "Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[#E6E6E6B2]/70 backdrop-blur-md">
                <RedSpinner />
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            <Toast
                message={toastConfig.message}
                type={toastConfig.type}
                visible={toastConfig.visible}
                onClose={handleCloseToast}
            />

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name={firstName + " " + lastName}
                    location={branch}
                    title="User Profile"
                />

                <section className="bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-12 py-12 mb-10">
                    <form onSubmit={handleSave} className="max-w-4xl mx-auto">

                        {/* User Information Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                User Information
                            </h3>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                {/* First Name */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Enter first name"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Enter last name"
                                    />
                                </div>

                                {/* Email Address */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* Role */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={role}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* Department */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                    <input
                                        type="text"
                                        value={department}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* Branch */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
                                    <input
                                        type="text"
                                        value={branch}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                Security
                            </h3>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Enter new password to change"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => fetchProfile()} // Reset form
                                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 rounded-xl bg-[#E52F2F] text-white font-medium hover:bg-red-700 transition shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
