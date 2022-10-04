import { Link as RouterLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const Link = ({ to, className, children }) => (
  <RouterLink
    to={to}
    className={twMerge(
      "underline transition ease-out hover:text-green-500 focus:outline-none focus-visible:text-green-500",
      className
    )}
  >
    {children}
  </RouterLink>
);
