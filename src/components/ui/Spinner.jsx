import { twMerge } from "tailwind-merge";

export const Spinner = ({ className }) => (
  <div
    className={twMerge(
      "mx-auto h-[2em] w-[2em] animate-spin items-center justify-center rounded-full border-[0.25em] border-gray-500/80 border-t-green-500",
      className
    )}
  ></div>
);
