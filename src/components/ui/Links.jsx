import { forwardRef } from "react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const Link = ({ to, className, children }) => (
  <RouterLink
    to={to}
    className={twMerge(
      "rounded-md px-2 py-1.5 transition ease-out focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-800 active:text-green-500 focus-visible:dark:outline-gray-100 [&:not(:active)]:hover:text-green-600 [&:not(:active)]:hover:dark:text-green-400",
      className
    )}
  >
    {children}
  </RouterLink>
);

export const NavLink = forwardRef(({ path, title, access, user }, ref) => {
  // links with access level 1 (everyone) will always show, but links with higher access will not show until a user with proper access is signed in
  if (user == null && access > 1) return null;
  if (user?.role?.access_level < access) return null;

  return (
    <RouterNavLink
      to={path}
      className={({ isActive }) =>
        twMerge(
          "rounded-md px-3 py-2 transition ease-out focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-800 active:text-green-500 focus-visible:dark:outline-gray-100 [&:not(:active)]:hover:text-green-600 [&:not(:active)]:hover:dark:text-green-400",
          isActive
            ? "bg-gray-300 shadow dark:bg-gray-900"
            : "hover:bg-gray-200 hover:dark:bg-gray-700"
        )
      }
    >
      {title}
    </RouterNavLink>
  );
});
