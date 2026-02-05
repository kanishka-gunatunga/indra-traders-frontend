import { useState, useCallback } from "react";

export const useToast = () => {
    const [toast, setToast] = useState({
        message: "",
        type: "success" as "success" | "error",
        visible: false,
        duration: undefined as number | undefined
    });

    const showToast = useCallback((message: string, type: "success" | "error" = "success", duration?: number) => {
        setToast({ message, type, visible: true, duration });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    return { toast, showToast, hideToast };
};
