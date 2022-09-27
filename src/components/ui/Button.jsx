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
      "focus-visible:outline-opacity-75 inline-flex items-center justify-center gap-1 rounded bg-green-400 py-[0.5em] px-[1em] text-base font-semibold text-gray-800 shadow transition hover:bg-opacity-80 focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-800 active:scale-95 disabled:bg-gray-400 focus-visible:dark:outline-gray-100 lg:text-lg",
      variant.includes("small") && "text-sm lg:text-base",
      variant.includes("secondary") && "bg-violet-400",
      variant.includes("danger") && "bg-rose-400",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
