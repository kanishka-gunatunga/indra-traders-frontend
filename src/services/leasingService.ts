import axiosInstance from "@/utils/axiosinstance";

export interface LeasingBank {
    id: number;
    bank_name: string;
    interest_rate: number;
    available_months: number[];
    is_active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LeasingBankFormData {
    bank_name: string;
    interest_rate: number;
    available_months: number[];
    is_active: boolean;
}


export const LeasingService = {
    getActiveBanks: async (): Promise<LeasingBank[]> => {
        const response = await axiosInstance.get<LeasingBank[]>(`/leasing-banks/active`);
        return response.data;
    },

    // 2. Get All Banks (Admin Dashboard)
    getAllBanks: async (): Promise<LeasingBank[]> => {
        const response = await axiosInstance.get<LeasingBank[]>(`/leasing-banks`);
        return response.data;
    },

    // 3. Create Bank (Admin)
    createBank: async (data: LeasingBankFormData): Promise<LeasingBank> => {
        const response = await axiosInstance.post<LeasingBank>(`/leasing-banks`, data);
        return response.data;
    },

    // 4. Update Bank (Admin)
    updateBank: async (id: number, data: Partial<LeasingBankFormData>): Promise<LeasingBank> => {
        const response = await axiosInstance.put<LeasingBank>(`/leasing-banks/${id}`, data);
        return response.data;
    },

    // 5. Delete Bank (Admin)
    deleteBank: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/leasing-banks/${id}`);
    }
};