import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { Logo } from "./Logo";
import { useSession } from "../contexts/sessionContext";
import { MenuTransition } from "./MenuTransition";
import { Link, NavLink } from "react-router-dom";
import { useProfile } from "../contexts/profileContext";

const LINKS = [
  { to: "/custom-blends", title: "Custom Blends", access: 1 },
  // { to: "/named-blends", title: "Named Blends", access: 1 },
  { to: "/nicotine-calculator", title: "Nicotine Calculator", access: 1 },
  // { to: "/orders", title: "Orders", access: 2 },
  // { to: "/admin/transfers", title: "Transfers", access: 3 },
  // { to: "/admin/square", title: "Square", access: 3 },
  // { to: "/admin/promos", title: "Edit Promotions", access: 3 },
];

export const NavBar = () => {
  const user = useSession();
  const { profile, loading: profileLoading } = useProfile();
  // const user = null; // TODO: remove when auth is working

  return (
    <>
      {/* desktop menu */}
      <div className="hidden max-w-[25ch] shrink-0 flex-col divide-y divide-gray-300 border-r border-gray-300 dark:divide-gray-700 dark:border-gray-700 lg:flex">
        <div className="mx-auto p-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex grow flex-col divide-y divide-gray-300 overflow-auto py-2 px-4 dark:divide-gray-700">
          <LinkGroup links={LINKS.filter((link) => link.access === 1)} />
        </div>
        <footer className="p-4">
          <p className="text-center text-xs text-gray-500">
            Created by Garrett Nelson &copy; 2022
          </p>
        </footer>
      </div>

      {/* mobile menu */}
      <div className="relative border-b border-gray-300 bg-gray-200 px-4 dark:border-gray-700 dark:bg-gray-900 lg:hidden">
        <Menu as="div" className="flex items-center justify-between py-2">
          <Link to="/">
            <Logo />
          </Link>
          <Menu.Button className="hover:text-green-600 hover:dark:text-green-200">
            <XMarkIcon className="h-[2em] ui-not-open:hidden" />
            <Bars3Icon className="h-[2em] ui-open:hidden" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-y-95"
            enterTo="transform opacity-100 scale-y-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-y-100"
            leaveTo="transform opacity-0 scale-y-95"
          >
            <Menu.Items
              as="nav"
              className="absolute top-full left-0 right-0 flex origin-top flex-col space-y-2 divide-y divide-gray-300 rounded-b-lg border-b border-t border-gray-300 bg-gray-200 p-2 shadow-md focus:outline-none dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900"
            >
              <MobileLinkGroup
                links={LINKS.filter((link) => link.access === 1)}
              />
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
};

const LinkGroup = ({ links }) =>
  links.length > 0 && (
    <div className="space-y-2 py-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `${
              isActive
                ? "bg-gray-300 dark:bg-gray-700"
                : "text-gray-900 dark:text-gray-100"
            } block rounded-md p-2 transition hover:bg-green-400 hover:text-gray-900 focus:outline-none focus-visible:bg-green-400 focus-visible:text-gray-900 active:bg-opacity-75`
          }
        >
          {link.title}
        </NavLink>
      ))}
    </div>
  );

const MobileLinkGroup = ({ links }) =>
  links.length > 0 && (
    <div className="space-y-1">
      {links.map((link) => (
        <Menu.Item key={link.to}>
          {({ active: menuItemActive }) => (
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `${
                  menuItemActive
                    ? "bg-green-400 text-gray-900"
                    : isActive
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "text-gray-900 dark:text-gray-100"
                } block rounded-md p-2 transition active:bg-opacity-75`
              }
            >
              {link.title}
            </NavLink>
          )}
        </Menu.Item>
      ))}
    </div>
  );
