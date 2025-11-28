import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";
// import AppWrapper from "@/components/AppWrapper";
import ChatLauncher from "@/components/ChatLauncher";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <>
            <Navbar />
            <SideMenu />

            {children}

            <ChatLauncher />
        </>
    );
}