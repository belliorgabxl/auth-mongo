'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
    href: string;
    label: string;
    isActive: boolean;
  };

export default function NavLink({ href, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`hover:bg-blue-600 duration-1000 text-xl h-full grid place-items-center px-5 ${
        isActive ? ' text-yellow-200 font-semibold' : 'font-normal'
      }`}
    >
      {label}
    </Link>
  );
}