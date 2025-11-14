import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: number | string;
        full_name: string;
        email: string;
        user_role: string;
        department: string;
        branch: string;
        accessToken: string;
    }

    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number | string;
        full_name: string;
        email: string;
        user_role: string;
        department: string;
        branch: string;
        accessToken: string;
    }
}