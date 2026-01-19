/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { getServiceBookingBranches } from "@/services/serviceParkService";
import toast, { Toaster } from "react-hot-toast";

export default function ServiceParkLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [branches, setBranches] = useState<{ id: number, name: string }[]>([]);
  const [isFetchingBranches, setIsFetchingBranches] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getServiceBookingBranches();
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranch(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch branches", error);
      } finally {
        setIsFetchingBranches(false);
      }
    };
    fetchBranches();
  }, [])

  const [selectedBranch, setSelectedBranch] = useState<{ id: number, name: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate username
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      setLoading(false);
      return;
    }

    // Validate password
    if (!password.trim()) {
      toast.error("Password cannot be empty");
      setLoading(false);
      return;
    }

    // Validate branch selection
    if (!selectedBranch) {
      toast.error("Please select a branch");
      setLoading(false);
      return;
    }

    const result = await signIn("service-booking", {
      username,
      password,
      branch: selectedBranch.id,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Invalid username or password");
      setLoading(false);
    } else {
      toast.success("Login successful! Redirecting...");
      // Keep loading true during redirect to prevent double-clicks
      router.push("/service-booking/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F2F5] relative overflow-hidden font-sans">
      <Toaster position="top-right" />

      <div className="relative flex items-center justify-center min-[2000px]:scale-150 min-[3000px]:scale-[2.5] transition-transform duration-300 origin-center">

        <div className="absolute w-[600px] h-[600px] left-1/2 top-1/2 -ml-[409px] -mt-[355px] rounded-full bg-[#DB2727] opacity-40 blur-[200px] pointer-events-none" />

        <div className="absolute w-[500px] h-[500px] left-1/2 top-1/2 ml-[24px] -mt-[165px] rounded-full bg-[#D9D9D9] opacity-40 blur-[200px] pointer-events-none" />

        <div className="relative z-10 bg-[#EEEAE9] w-[450px] rounded-[40px] p-10 shadow-xl border border-white/50 transition-transform duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Image
                src="/indra-logo.png"
                alt="Indra Traders"
                width={60}
                height={60}
                className="w-auto h-12 object-contain"
              />
            </div>

            <h1 className="text-[28px] font-bold text-[#1D1D1D] mb-1 montserrat">Service Park Login</h1>
            <p className="text-[#575757] text-[14px] montserrat font-normal">Manager Dashboard Access</p>
          </div>

          <form className="space-y-6 flex flex-col items-center" onSubmit={handleLogin}>
            <div className="space-y-2 relative w-[352px]" ref={dropdownRef}>
              <label className="text-[14px] font-medium text-[#1D1D1D] leading-[21px] tracking-[0px] montserrat block ml-1">Select Branch</label>
              <div
                className="w-[352px] h-[48px] bg-[#FFFFFF99] rounded-[20px] border-[2px] border-transparent border-t-[#FFFFFF66] px-5 flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="montserrat text-[14px] text-[#1D1D1D] font-normal leading-none">
                  {selectedBranch ? selectedBranch.name : "Select Branch"}
                </span>
                <ChevronDown className={`text-gray-400 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Custom Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      className={`px-5 py-3 cursor-pointer flex items-center justify-between hover:bg-red-50 transition-colors montserrat text-[14px] leading-none tracking-[0px] ${selectedBranch?.id === branch.id ? 'text-red-600 font-medium bg-red-50/50' : 'text-[#1D1D1D] font-normal'}`}
                      onClick={() => {
                        setSelectedBranch(branch);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {branch.name}
                      {selectedBranch?.id === branch.id && <Check className="w-4 h-4 text-red-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 w-[352px]">
              <label className="text-[14px] font-medium text-[#1D1D1D] leading-[21px] tracking-[0px] montserrat block ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-[352px] h-[48px] bg-[#FFFFFF99] rounded-[20px] border-[2px] border-transparent border-t-[#FFFFFF66] px-5 text-[#1D1D1D] placeholder:text-[#999999] placeholder:font-normal placeholder:text-[14px] placeholder:montserrat placeholder:leading-none focus:outline-none focus:ring-2 focus:ring-red-500 montserrat text-[14px]"
              />
            </div>

            <div className="space-y-2 w-[352px]">
              <label className="text-[14px] font-medium text-[#1D1D1D] leading-[21px] tracking-[0px] montserrat block ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-[352px] h-[48px] bg-[#FFFFFF99] rounded-[20px] border-[2px] border-transparent border-t-[#FFFFFF66] px-5 text-[#1D1D1D] placeholder:text-[#999999] placeholder:font-normal placeholder:text-[14px] placeholder:montserrat placeholder:leading-none focus:outline-none focus:ring-2 focus:ring-red-500 montserrat text-[14px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-[352px] h-[56px] bg-[#DB2727] hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-[25px] transition-all flex items-center justify-center gap-2 shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H12.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.33203 14.1668L12.4987 10.0002L8.33203 5.8335" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.5 10H2.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span className="font-semibold text-[16px] leading-[24px] text-center montserrat text-white">
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[12px] font-normal leading-[18px] text-center text-[#575757] montserrat">Contact IT support for access issues</p>
          </div>
        </div>
      </div>
    </div>
  );
}
