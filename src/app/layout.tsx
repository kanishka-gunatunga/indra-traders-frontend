import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";
import AppWrapper from "@/components/AppWrapper";
import Providers from "@/utils/providers";
import ChatLauncher from "@/components/ChatLauncher";
import SessionAuthProvider from "@/utils/SessionAuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Indra Traders",
    description: "Indra Traders (pvt) limited system",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
            <SessionAuthProvider>
                <Providers>
                    <AppWrapper>
                        <Navbar/>
                        <SideMenu/>
                        {children}
                        <ChatLauncher/>
                    </AppWrapper>
                </Providers>
            </SessionAuthProvider>
        </body>
        </html>
    );
}
