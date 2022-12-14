import { forwardRef } from "react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const Link = ({ to, className, children, ...props }) => (
  <RouterLink
    to={to}
    className={twMerge(
      "underline transition ease-out hover:text-green-500 focus:outline-none focus-visible:text-green-500",
      className
    )}
    {...props}
  >
    {children}
  </RouterLink>
);

export const NavLink = forwardRef(
  (
    {
      className,
      children,
      mobile = false,
      mobileActive,
      showActive = true,
      ...props
    },
    ref
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        {...props}
        className={({ isActive }) =>
          twMerge(
            twMerge(
              "block rounded-md p-2 transition active:bg-opacity-75",
              !mobile &&
                "hover:bg-green-400 hover:text-gray-900 focus:outline-none focus-visible:bg-green-400 focus-visible:text-gray-900",
              mobileActive
                ? "bg-green-400 text-gray-900"
                : isActive && showActive
                ? "bg-gray-700"
                : "text-gray-100",
              className
            )
          )
        }
      >
        {children}
      </RouterNavLink>
    );
  }
);
