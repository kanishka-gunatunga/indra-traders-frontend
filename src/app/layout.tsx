import type {Metadata} from "next";
import {Geist, Geist_Mono, Montserrat} from "next/font/google"; // Import Montserrat
import "./globals.css";
import AppWrapper from "@/components/AppWrapper";
import Providers from "@/utils/providers";
import ChatLauncher from "@/components/ChatLauncher";
import SessionAuthProvider from "@/utils/SessionAuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    display: "swap",
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
            className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased `}
        >
        <SessionAuthProvider>
            <Providers>
                <AppWrapper>
                    <ReduxProvider>
                        {/*<Navbar/>*/}
                        {/*<SideMenu/>*/}
                        {children}
                    </ReduxProvider>
                    <ChatLauncher/>
                </AppWrapper>
            </Providers>
        </SessionAuthProvider>
        </body>
        </html>
    );
}
