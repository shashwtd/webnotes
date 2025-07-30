import toast from "react-hot-toast";

export const useToast = () => {
    const showToast = (message: string, type: "success" | "error" = "success") => {
        toast[type](message, {
            id: message, // This prevents duplicate toasts
        });
    };

    return {
        success: (message: string) => showToast(message, "success"),
        error: (message: string) => showToast(message, "error"),
    };
};
