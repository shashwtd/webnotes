import { Toaster, toast as hotToast } from 'react-hot-toast';

interface ToastProps {
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const Toast = ({ position = 'bottom-right' }: ToastProps) => {
    return (
        <Toaster
            position={position}
            toastOptions={{
                className: '',
                style: {
                    background: '#ffffff',
                    color: '#09090b',
                    border: '1px solid #e5e5e5',
                    fontSize: '0.875rem',
                },
                success: {
                    duration: 4000,
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                },
            }}
        />
    );
};

export const toast = {
    success: (message: string) => {
        hotToast.success(message, {
            className: 'font-medium',
        });
    },
    error: (message: string) => {
        hotToast.error(message, {
            className: 'font-medium',
        });
    },
    loading: (message: string) => {
        return hotToast.loading(message, {
            className: 'font-medium',
        });
    },
    promise: <T,>(
        promise: Promise<T>,
        msgs: { loading: string; success: string; error: string }
    ) => {
        return hotToast.promise(
            promise,
            {
                loading: msgs.loading,
                success: msgs.success,
                error: msgs.error,
            },
            {
                className: 'font-medium',
            }
        );
    },
};
