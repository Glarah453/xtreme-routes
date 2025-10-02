"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from "@/context/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { PowerIcon,ArrowRightIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
// import { logOutUser } from "@/app/lib/actions";

export default function UserMenu() {
  const { user, usuarioData, sign_out } = useAuth();
  const router = useRouter();

  if (!usuarioData) return null;
  console.log(usuarioData);

  return (
    <div className="relative flex items-center space-x-2 p-2">
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100">
          {/* Avatar */}
          {/* <div className="h-8 w-8 rounded-full object-cover"> */}
          {/*   <Image */}
          {/*     src={usuarioData.photourl ?? "/default-avatar.png"} */}
          {/*     alt={usuarioData.displayname ?? "User"} */}
          {/*     width={1000} */}
          {/*     height={1000} */}
          {/*     // className="h-8 w-8 rounded-full object-cover" */}
          {/*   /> */}
          {/* </div> */}
          <img
            src={usuarioData.photourl ?? "/default-avatar.png"}
            alt={usuarioData.displayname ?? "User"}
            className="h-10 w-10 rounded-full object-cover"
          />
          {/* Nombre */}
          <span className="hidden md:inline font-medium text-sm">
            {usuarioData.displayname ?? usuarioData.email}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </Menu.Button>

        {/* Animación */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          {/* Dropdown */}
          <Menu.Items
            className="absolute right-0 bottom-full mb-2 w-56 origin-bottom-right md:origin-top-right 
                       rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 
                       focus:outline-none z-50"
          >
          {/* <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"> */}
            <div className="p-2">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/profile/${usuarioData.id}`}
                    // className={`block rounded-md px-4 py-2 text-sm ${
                    className={`flex h-[48px] w-full grow items-center justify-center gap-2 
                      rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 
                      hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    <Cog8ToothIcon className="w-4" /> Configuración de perfil
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={async () => {
                      // await logOutUser();
                      await sign_out();
                      window.location.href = "/";
                      // router.push("/");
                    }}
                    className={`flex h-[48px] w-full grow items-center justify-center gap-2 
                      rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 
                      hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
                    ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    <PowerIcon className="w-4" /> Cerrar sesión
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
