// "use client";
//
// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
//
// export default function LoginPage() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//
//     const router = useRouter();
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);
//
//         const res = await signIn("credentials", {
//             redirect: false,
//             email,
//             password,
//         });
//
//         setLoading(false);
//
//         if (res?.error) {
//             setError("Invalid email or password");
//             return;
//         }
//
//         router.push("/");
//     };
//
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50">
//             <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-sm">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//                     Indra Traders Login
//                 </h2>
//
//                 <form onSubmit={handleSubmit} className="space-y-5">
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             className="mt-1 block w-full border border-gray-300 rounded-md p-2.5"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//
//                     {error && (
//                         <p className="text-red-600 text-center text-sm">{error}</p>
//                     )}
//
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-red-600 text-white py-2.5 rounded-md hover:bg-red-700"
//                     >
//                         {loading ? "Signing in..." : "Sign In"}
//                     </button>
//
//                 </form>
//             </div>
//         </div>
//     );
// }


"use client";

import {useState} from "react";
import {getSession, signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Montserrat} from "next/font/google";
import {Eye, EyeOff} from "lucide-react";
import {ROLE_DASHBOARDS} from "@/utils/role-routes";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setLoading(false);
            setError("Invalid email or password");
            return;
        }

        const session = await getSession();

        if (session?.user?.user_role) {
            const role = session.user.user_role as keyof typeof ROLE_DASHBOARDS;
            const destination = ROLE_DASHBOARDS[role];

            if (destination) {
                router.push(destination);
            } else {
                router.push("/");
            }
        } else {
            router.push("/");
        }
    };

    return (
        <div className={`relative w-full min-h-screen overflow-hidden bg-[#1E1E1E] ${montserrat.className}`}>

            <div className="absolute inset-0 z-0">
                <Image
                    src="/login-bg.jpg"
                    alt="Indra Showroom"
                    fill
                    className="object-cover object-left"
                    priority
                />
                <div className="absolute inset-0 bg-black/10"/>
            </div>

            <div className="absolute top-5 left-0 z-20 hidden lg:block">
                <div
                    className="bg-white/70 backdrop-blur-md rounded-r-[20px] px-8 py-4 flex items-center justify-center shadow-lg h-[108px] w-[161px] relative -left-4">
                    <div className="relative w-[100px] h-[100px]">
                        <Image
                            src="/indra-logo.png"
                            alt="Indra Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>

            <div
                className="relative z-10 flex flex-col justify-center min-h-screen ml-auto w-full lg:w-[45%] xl:w-[45%] 2xl:w-[648px]">
                <div
                    className="absolute inset-0 bg-[#D9D9D9]/20 backdrop-blur-[7.5px] border-l border-white/10 shadow-2xl"/>
                <div
                    className="relative z-20 px-8 md:px-16 lg:px-12 xl:px-20 py-12 flex flex-col h-full justify-center">
                    <div className="mb-12">
                        <h2 className="text-white text-3xl lg:text-[34px] font-normal leading-tight mb-2">
                            Welcome Back To
                        </h2>
                        <h1 className="text-white text-4xl lg:text-[40px] font-semibold leading-tight mb-6">
                            Indra Group of Companies
                        </h1>
                        <p className="text-white text-base lg:text-[16px] leading-[20px] opacity-90 max-w-lg">
                            Indra Group aims to create a unified, customer-centric system that
                            seamlessly integrates its diverse business units—Indra Traders,
                            Indra Service Park, Indra Motor Spares, and Indra Fast Track—to
                            enhance the overall customer experience across all touchpoints.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg w-full">

                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-[48px] bg-white/30 border border-white rounded-[10px] px-4 text-white placeholder-gray-200 outline-none focus:bg-white/40 focus:border-white transition-all duration-200"
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full h-[48px] bg-white/30 border border-white rounded-[10px] px-4 pr-10 text-white placeholder-gray-200 outline-none focus:bg-white/40 focus:border-white transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>

                        <p className="text-white text-sm lg:text-[16px] leading-[20px] opacity-90">
                            By signing up, you agree to the <span
                            className="underline cursor-pointer hover:text-gray-200">Terms of Service</span> and <span
                            className="underline cursor-pointer hover:text-gray-200">Privacy Policy</span>,
                            Including <span className="underline cursor-pointer hover:text-gray-200">cookie use</span>.
                        </p>

                        {error && (
                            <div
                                className="bg-red-500/80 border border-red-500 text-white text-sm rounded-md p-3 text-center backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[59px] bg-[#DB2727] hover:bg-[#b81e1e] text-white text-[20px] font-bold rounded-[20px] transition-all duration-300 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"/>
                  Logging in...
                </span>
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>


                    <div className="absolute bottom-0 left-0 right-0 text-center px-4">
                        <p className="text-[#E6E6E6] text-[13px] leading-[26px]">
                            Copyright © 2025 Indra Group of Companies . All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}