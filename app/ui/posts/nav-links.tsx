'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: '/', icon: HomeIcon },
//   {
//     name: 'Sectores',
//     href: '/posts/sectors',
//     icon: DocumentDuplicateIcon,
//   },
//   {
//     name: 'Rutas',
//     href: '/posts/sectores',
//     icon: DocumentDuplicateIcon,
//   },
//   { name: 'Crear Post', href: '/posts/create', icon: UserGroupIcon },
// ];

export default function NavLinks({ id }: { id: string }) {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: HomeIcon },
    {
      name: 'Sectores',
      href: `/posts/sectors/${id}`,
      icon: DocumentDuplicateIcon,
    },
    {
      name: 'Rutas',
      href: `/posts/routes/${id}`,
      icon: DocumentDuplicateIcon,
    },
    // { name: 'Crear Post', href: '/posts/create', icon: UserGroupIcon },
    { name: 'Crear Sector', href: `/posts/sectors/${id}/create`, icon: UserGroupIcon },
    { name: 'Crear Ruta', href: `/posts/routes/${id}/create`, icon: UserGroupIcon },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
