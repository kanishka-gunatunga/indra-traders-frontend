"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { userService } from "@/services/userService";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/utils/auth";
import RedSpinner from "@/components/RedSpinner";

const ProfilePage = () => {
    const user = useCurrentUser();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
        }
    }, [user?.id]);

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
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
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
            toast.success("Profile updated successfully");

            // Clear password fields on success
            setPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
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
                                <div className="col-span-2">
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
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Enter new password to change"
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Confirm new password"
                                    />
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
