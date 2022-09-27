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
import { Link, NavLink } from "./ui/Links";

const LINKS = [
  { path: "/flavors", title: "Flavors", access: 1 },
  { path: "/nicotine", title: "Nicotine", access: 1 },
  { path: "/orders", title: "Orders", access: 2 },
  { path: "/admin/transfers", title: "Transfers", access: 3 },
  { path: "/admin/square", title: "Square", access: 3 },
  { path: "/admin/promos", title: "Edit Promotions", access: 3 },
];

export const NavBar = () => {
  // const user = useSession();
  const user = null; // TODO: remove when auth is working

  return (
    <div className="shadow-md">
      <Menu
        as="nav"
        className="container mx-auto flex flex-col gap-2 py-2 px-4 sm:px-6 lg:px-8"
      >
        {({ open }) => (
          <>
            <div className="relative flex items-center justify-between">
              <Menu.Button className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 hover:dark:bg-gray-700 focus-visible:dark:ring-gray-200 lg:hidden">
                {open ? (
                  <XMarkIcon className="h-[2em]" />
                ) : (
                  <Bars3Icon className="h-[2em]" />
                )}
              </Menu.Button>
              <div className="flex items-center justify-between">
                <Link to="/">
                  <Logo />
                </Link>
                <div className="hidden items-center gap-2 lg:ml-6 lg:flex">
                  {LINKS.map((link) => (
                    <NavLink key={link.path} {...link} user={user} />
                  ))}
                </div>
              </div>

              {/* Login button (signed out) or profile menu (signed in)
              empty div for now in order to keep flexbox working correctly */}
              <div></div>
              {/* {user == null ? (
                <NavLink path="login" title="Login" />
              ) : (
                <Menu>
                  <Menu.Button className="inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-300 hover:dark:bg-gray-700">
                    <UserCircleIcon className="h-[2em] text-green-500" />
                  </Menu.Button>
                  <MenuTransition>
                    <Menu.Items className="absolute top-full right-0 z-20 flex flex-col gap-1 rounded-md bg-gray-100 py-1 shadow-md focus:outline-none dark:bg-gray-800">
                      <Menu.Item>
                        <NavLink path="profile" title="My Profile" />
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink path="logout" title="Logout" />
                      </Menu.Item>
                    </Menu.Items>
                  </MenuTransition>
                </Menu>
              )} */}
            </div>

            {/* mobile menu */}
            <MenuTransition>
              <Menu.Items className="flex flex-col gap-1 py-1 focus:outline-none lg:hidden">
                {LINKS.map((link) => (
                  <Menu.Item key={link.path}>
                    <NavLink {...link} user={user} />
                  </Menu.Item>
                ))}
              </Menu.Items>
            </MenuTransition>
          </>
        )}
      </Menu>
    </div>
  );
};
