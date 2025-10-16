export type ComplaintStatus =
    | "New"
    | "In Review"
    | "Processing"
    | "Approval"
    | "Completed";

export interface Complaint {
    id: number;
    ticket_no: string;
    category: string;
    title: string;
    preferred_solution?: string | null;
    description?: string | null;
    status: ComplaintStatus;
    progress?: number;
    contact_no?: string | null;
    vehicle_no?: string | null;
    comment?: string | null;
    customerId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateComplaintInput {
    category: string;
    title: string;
    preferred_solution?: string | null;
    description?: string | null;
    contact_no?: string | null;
    vehicle_no?: string | null;
    comment?: string | null;
    customerId?: string;
}

export interface UpdateComplaintInput extends Partial<CreateComplaintInput> {
    status?: ComplaintStatus;
    progress?: number;
}
