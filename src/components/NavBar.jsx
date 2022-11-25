import { Fragment, useMemo } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { Logo } from "./ui/Logo";
import { useAuthContext } from "../contexts/authContext";
import { Link, NavLink } from "./ui/Links";
import { Button } from "./ui/Button";
import { useLocation } from "react-router-dom";

const links = [
  { to: "/", title: "Dashboard", access: 0, end: true },
  { to: "/custom-blends", title: "Custom Blends", access: 0 },
  { to: "/named-blends", title: "Named Blends", access: 0 },
  { to: "/nicotine-calculator", title: "Nicotine Calculator", access: 0 },
  { to: "/profile", title: "My Profile", access: 1 },
  // { to: "/paperwork", title: "Daily Paperwork", access: 2 },
  // { to: "/orders", title: "Orders", access: 2 },
  // { to: "/admin", title: "Admin Dashboard", access: 3, end: true },
  // { to: "/admin/transfers", title: "Transfers", access: 3 },
  // { to: "/admin/square", title: "Square", access: 3 },
  { to: "/admin/promotions", title: "Edit Promotions", access: 3 },
  { to: "/admin/users", title: "Users", access: 3 },
];

export function NavBar() {
  const { session, profile, signOut, canAccess } = useAuthContext();
  const location = useLocation();

  return (
    <>
      {/* desktop menu */}
      <div className="fixed top-0 left-0 bottom-0 hidden w-48 shrink-0 flex-col divide-y divide-gray-700 border-r border-gray-700 bg-gray-900 lg:flex">
        <div className="mx-auto p-4">
          <Logo />
        </div>
        <div className="flex grow flex-col divide-y divide-gray-700 overflow-auto py-2 px-4">
          <LinkGroup links={links.filter((link) => link.access === 0)} />
          {canAccess(1) && (
            <LinkGroup links={links.filter((link) => link.access === 1)} />
          )}
          {canAccess(2) && (
            <LinkGroup links={links.filter((link) => link.access === 2)} />
          )}
          {canAccess(3) && (
            <LinkGroup links={links.filter((link) => link.access === 3)} />
          )}
        </div>
        <div className="px-4 py-2">
          {session ? (
            <div className="flex flex-col gap-2">
              {profile && (
                <Link
                  className="w-full overflow-hidden text-ellipsis whitespace-pre-wrap text-sm no-underline"
                  to="/profile"
                >
                  {profile.name || profile.email}
                </Link>
              )}
              <Button variant="secondary link" onClick={signOut}>
                Logout
              </Button>
            </div>
          ) : (
            <NavLink
              to="/login"
              state={{ prevLocation: location.pathname }}
              showActive={false}
              className="text-center"
            >
              Login
            </NavLink>
          )}
        </div>
        <footer className="p-4">
          <p className="text-center text-xs text-gray-500">
            Created by Garrett Nelson &copy; 2022
          </p>
        </footer>
      </div>

      {/* mobile menu */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-gray-700 bg-gray-900 lg:hidden">
        <Menu
          as="div"
          className="flex grow items-center justify-between py-2 px-4"
        >
          <Logo />
          <div className="flex items-center gap-4">
            {profile && (
              <Link className="whitespace-pre-wrap no-underline" to="/profile">
                {profile.name ?? profile.email}
              </Link>
            )}
            <Menu.Button className="hover:text-green-400">
              <XMarkIcon className="h-[2em] ui-not-open:hidden" />
              <Bars3Icon className="h-[2em] ui-open:hidden" />
            </Menu.Button>
          </div>
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
              className="absolute top-full left-0 right-0 flex origin-top flex-col divide-y divide-gray-700 rounded-b-lg border-b border-t border-gray-700 bg-gray-900 px-2 py-1 shadow-md focus:outline-none"
            >
              <MobileLinkGroup
                links={links.filter((link) => link.access === 0)}
              />
              {canAccess(1) && (
                <MobileLinkGroup
                  links={links.filter((link) => link.access === 1)}
                />
              )}
              {canAccess(2) && (
                <MobileLinkGroup
                  links={links.filter((link) => link.access === 2)}
                />
              )}
              {canAccess(3) && (
                <MobileLinkGroup
                  links={links.filter((link) => link.access === 3)}
                />
              )}
              <div className="flex justify-end px-2 py-2">
                <Menu.Item>
                  {({ active }) =>
                    session ? (
                      <Button
                        variant="secondary link"
                        onClick={signOut}
                        className=""
                      >
                        Logout
                      </Button>
                    ) : (
                      <NavLink
                        to="/login"
                        state={{ prevLocation: location.pathname }}
                        showActive={false}
                        mobile={true}
                        mobileActive={active}
                        className="text-center"
                      >
                        Login
                      </NavLink>
                    )
                  }
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
}

function LinkGroup({ links }) {
  return (
    links.length > 0 && (
      <div className="space-y-2 py-2">
        {links.map((link) =>
          link?.end ? (
            <NavLink key={link.to} to={link.to} end>
              {link.title}
            </NavLink>
          ) : (
            <NavLink key={link.to} to={link.to}>
              {link.title}
            </NavLink>
          )
        )}
      </div>
    )
  );
}

function MobileLinkGroup({ links }) {
  return (
    links.length > 0 && (
      <div className="space-y-1 py-1">
        {links.map((link) => (
          <Menu.Item key={link.to}>
            {({ active }) =>
              link?.end ? (
                <NavLink to={link.to} mobile={true} mobileActive={active} end>
                  {link.title}
                </NavLink>
              ) : (
                <NavLink to={link.to} mobile={true} mobileActive={active}>
                  {link.title}
                </NavLink>
              )
            }
          </Menu.Item>
        ))}
      </div>
    )
  );
}
