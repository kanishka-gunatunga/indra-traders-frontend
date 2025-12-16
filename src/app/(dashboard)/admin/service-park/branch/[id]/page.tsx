"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useBranchDetails, useUpdateBranch } from "@/hooks/useServicePark";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import BranchForm from "@/components/BranchForm"; // The component from Step 2
import { Loader2 } from "lucide-react";

export default function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params in Next.js 15+
    const { id } = use(params);
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();

    // Hooks
    const branchId = parseInt(id);
    const { data: branch, isLoading, isError } = useBranchDetails(branchId);
    const updateBranchMutation = useUpdateBranch();

    const handleUpdate = async (formData: any) => {
        try {
            await updateBranchMutation.mutateAsync({ id: branchId, data: formData });
            showToast("Branch updated successfully", "success");
            setTimeout(() => router.push("/admin/service-park"), 1500);
        } catch (error) {
            console.error(error);
            showToast("Failed to update branch", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E6E6E6B2]/70">
                <Loader2 className="animate-spin text-[#DB2727]" size={48} />
            </div>
        );
    }

    if (isError || !branch) {
        return <div className="p-10 text-center">Branch not found.</div>;
    }

    return (
        <div className="">
            {/*<Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />*/}
            <main className="">
                <BranchForm
                    initialData={branch}
                    isEditMode={true}
                    onSubmit={handleUpdate}
                    isSubmitting={updateBranchMutation.isPending}
                />
            </main>
        </div>
    );
}