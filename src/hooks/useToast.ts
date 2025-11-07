import { useState } from "react";

export const useToast = () => {
    const [toast, setToast] = useState({
        message: "",
        type: "success" as "success" | "error",
        visible: false
    });

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    return { toast, showToast, hideToast };
};
