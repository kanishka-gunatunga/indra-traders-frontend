export interface User {
    id?: number;
    full_name: string;
    contact_no: string;
    email: string;
    user_role: "SALES01" | "SALES02" | "CALLAGENT" | "ADMIN" | "TELEMARKETER";
    department: "ITPL" | "ISP" | "IMS" | "IFT";
    branch: "BAMBALAPITIYA" | "KANDY" | "JAFFNA" | "GALLE" | "NEGOMBO";
    password?: string;
    confirm_password?: string;
}
