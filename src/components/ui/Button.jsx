import { twMerge } from "tailwind-merge";

export const Button = ({
  className,
  children,
  variant = "",
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={twMerge(
      "focus-visible:outline-opacity-75 inline-flex items-center justify-center gap-1 rounded bg-green-500 py-[0.5em] px-[1em] text-base font-semibold text-gray-100 shadow transition hover:bg-green-400 hover:text-gray-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-800 active:scale-95 disabled:bg-gray-400 dark:bg-green-400 dark:text-gray-900 hover:dark:bg-green-500 hover:dark:text-gray-100 focus-visible:dark:outline-gray-100 lg:text-lg",
      variant.includes("small") && "text-xs lg:text-sm",
      variant.includes("secondary") &&
        "bg-violet-500 hover:bg-violet-400 dark:bg-violet-400 hover:dark:bg-violet-500",
      variant.includes("danger") &&
        "bg-rose-500 hover:bg-rose-400 dark:bg-rose-400 hover:dark:bg-rose-500",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
