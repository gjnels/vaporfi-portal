import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Button = forwardRef(
  ({ className, children, variant = "", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={twMerge(
        "inline-flex items-center justify-center gap-1 rounded bg-green-400 py-[0.5em] px-[1em] text-base  font-semibold text-gray-900 shadow transition hover:bg-green-500 hover:text-gray-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-100 active:scale-95 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:hover:text-gray-900 lg:text-lg",
        variant.includes("small") && "text-xs lg:text-sm",
        variant.includes("secondary") && "bg-violet-400 hover:bg-violet-500",
        variant.includes("danger") && "bg-rose-400 hover:bg-rose-500",
        variant.includes("link") &&
          "text-sm font-normal shadow-none lg:text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
