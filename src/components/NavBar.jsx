import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { Logo } from "./ui/Logo";
import { useSessionContext } from "../contexts/sessionContext";
import { Link, NavLink } from "../components/ui/Links";
import { LoginLink } from "./ui/Links";
import { Button } from "./ui/Button";
import { useSupabaseContext } from "../contexts/supabaseContext";

const LINKS = [
  { to: "/custom-blends", title: "Custom Blends", access: 1 },
  { to: "/named-blends", title: "Named Blends", access: 1 },
  { to: "/nicotine-calculator", title: "Nicotine Calculator", access: 1 },
  // { to: "/orders", title: "Orders", access: 2 },
  // { to: "/admin/transfers", title: "Transfers", access: 3 },
  // { to: "/admin/square", title: "Square", access: 3 },
  // { to: "/admin/promos", title: "Edit Promotions", access: 3 },
];

export const NavBar = () => {
  const { session, signOut } = useSessionContext();
  const { profile } = useSupabaseContext();

  return (
    <>
      {/* desktop menu */}
      <div className="hidden max-w-[25ch] shrink-0 flex-col divide-y divide-gray-700 border-r border-gray-700 lg:flex">
        <div className="mx-auto p-4">
          <Link to="/" logo={true}>
            <Logo />
          </Link>
        </div>
        <div className="flex grow flex-col divide-y divide-gray-700 overflow-auto py-2 px-4">
          <LinkGroup links={LINKS.filter((link) => link.access === 1)} />
        </div>
        <div className="px-4 py-2">
          {session ? (
            <Button variant="secondary link" onClick={signOut}>
              Logout
            </Button>
          ) : (
            <LoginLink />
          )}
        </div>
        <footer className="p-4">
          <p className="text-center text-xs text-gray-500">
            Created by Garrett Nelson &copy; 2022
          </p>
        </footer>
      </div>

      {/* mobile menu */}
      <div className="relative border-b border-gray-700 bg-gray-900 lg:hidden">
        <Menu as="div" className="flex items-center justify-between py-2 px-4">
          <Link to="/">
            <Logo />
          </Link>
          <Menu.Button className="hover:text-green-400">
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
              className="absolute top-full left-0 right-0 flex origin-top flex-col space-y-2 divide-y divide-gray-700 rounded-b-lg border-b border-t border-gray-700 bg-gray-900 p-2 shadow-md focus:outline-none"
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
        <NavLink key={link.to} to={link.to}>
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
          {({ active }) => (
            <NavLink to={link.to} mobile={true} mobileActive={active}>
              {link.title}
            </NavLink>
          )}
        </Menu.Item>
      ))}
    </div>
  );
