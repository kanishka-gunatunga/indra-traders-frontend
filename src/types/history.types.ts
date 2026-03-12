export interface ExternalInvoice {
    invoice_id: string;
    date: string;
    vehicle_plate: string;
    vehicle_model: string;
    service_type: string;
    amount: string;
    status: string;
}

export interface ExternalCustomer {
    customer_id: string;
    customer_name: string;
    invoices: ExternalInvoice[];
}

export interface ExternalCustomerHistoryResponse {
    phone: string;
    customers: ExternalCustomer[];
}

export interface ExternalJob {
    job_id: string;
    date: string;
    service_type: string;
    description: string;
    status: string;
    amount: string;
}

export interface ExternalVehicleHistoryResponse {
    plate_number: string;
    make: string;
    model: string;
    jobs: ExternalJob[];
}

export interface ExternalJobDetail {
    job_id: string;
    invoice_no: string;
    date: string;
    vehicle_plate: string;
    mileage: number;
    status: string;
    service_center: string;
    materials: {
        item_code: string;
        description: string;
        quantity: string;
        unit_price: string;
    }[];
    labor: {
        description: string;
        hours: string;
        rate: string;
    }[];
    total_amount: number;
}
