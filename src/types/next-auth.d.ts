// import "next-auth";
// import "next-auth/jwt";
//
// declare module "next-auth" {
//     interface User {
//         id: number | string;
//         full_name: string;
//         email: string;
//         user_role: string;
//         department: string;
//         branch: string;
//         accessToken: string;
//     }
//
//     interface Session {
//         user: User;
//     }
// }
//
// declare module "next-auth/jwt" {
//     interface JWT {
//         id: number | string;
//         full_name: string;
//         email: string;
//         user_role: string;
//         department: string;
//         branch: string;
//         accessToken: string;
//     }
// }


import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            full_name: string;
            user_role: "SALES01" | "SALES02" | "CALLAGENT" | "ADMIN" | "TELEMARKETER";
            department: string;
            branch: string;
            accessToken: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        full_name: string;
        user_role: "SALES01" | "SALES02" | "CALLAGENT" | "ADMIN" | "TELEMARKETER";
        department: string;
        branch: string;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        user_role: "SALES01" | "SALES02" | "CALLAGENT" | "ADMIN" | "TELEMARKETER";
        accessToken: string;
    }
}