import axiosInstance from "@/utils/axiosinstance";

export const handleServiceIntake = async (data: any) => {
    const res = await axiosInstance.post("/service-park/intake", data);
    return res.data;
};


export const createAssignToSale = async (data: any) => {
    const res = await axiosInstance.post("/service-park/assign-to-sales", data);
    return res.data;
};


export const assignToSalesAgent = async (saleId: string, userId: string) => {
    const res = await axiosInstance.put(`/service-park/sales/${saleId}/assign`, { userId });
    return res.data;
};


export const getSaleDetails = async (saleId: string) => {
    const res = await axiosInstance.get(`/service-park/sales/${saleId}`);
    return res.data;
};


export const getVehicleHistoryByNumber = async (vehicleNo: string) => {
    const res = await axiosInstance.get(`/service-park/vehicles/${vehicleNo}`);
    return res.data;
};


export const listVehicleHistories = async () => {
    const res = await axiosInstance.get("/service-park/vehicles");
    return res.data;
};
