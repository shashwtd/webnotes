import toast, { Toast } from "react-hot-toast";

interface ToastOptions {
    duration?: number;
    id?: string;
}

export const useToast = () => {
    const showToast = (message: string, type: "success" | "error" | "loading", options: ToastOptions = {}) => {
        const { duration = type === "loading" ? Infinity : 2000, id } = options;
        
        if (type === "loading") {
            return toast.loading(message, {
                id,
                duration,
            });
        }

        return toast[type](message, {
            id,
            duration,
        });
    };

    return {
        success: (message: string, options?: ToastOptions) => showToast(message, "success", options),
        error: (message: string, options?: ToastOptions) => showToast(message, "error", options),
        loading: (message: string, options?: ToastOptions) => showToast(message, "loading", options),
        dismiss: (toastId?: string) => toast.dismiss(toastId),
    };
};
