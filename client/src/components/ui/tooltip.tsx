import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-slate-900 border-primary/50 text-slate-50 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
            <div className="grid gap-1">
              {title && <ToastTitle className="led-display text-xs uppercase">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-[10px] font-mono opacity-80">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-primary hover:text-white" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}