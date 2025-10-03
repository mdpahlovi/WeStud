import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = {
    label: string;
    error?: string;
} & React.ComponentProps<"input">;

function Input({ type = "text", label, className, error, ...props }: InputProps) {
    return (
        <div className="relative">
            <input
                type={type}
                className={cn(
                    "peer w-full px-0 pt-3.75 pb-1 border-0 border-b-2 border-input focus:border-primary focus:outline-none",
                    className
                )}
                {...props}
            />
            <label htmlFor={props.name} className="absolute left-0 top-3.75 peer-focus:-top-1 peer-placeholder-shown:-top-1 transition-all">
                {label}
            </label>
            {error && <p className="mt-0.5 text-xs leading-4 text-destructive">{error}</p>}
        </div>
    );
}

export { Input };
