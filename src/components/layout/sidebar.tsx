import React, { MouseEventHandler } from 'react';
import NavItem from './nav-item';
import  Image from "next/image";
import Link from 'next/link';

interface SidebarProps {
  navigation: {
    name: string;
    href: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
        titleId?: string | undefined;
    }>;
  }[];
  currentPage: string;
  user: {
    name: string;
    imageUrl: string;
    email: string;
  };
  pageChange: MouseEventHandler<HTMLAnchorElement>;
}

const Sidebar: React.FC<SidebarProps> = ({ navigation, user, currentPage, pageChange }) => {
  return (
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-gray-100">
    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
      <div className="flex flex-shrink-0 items-center px-4">
        <Image
            className="h-8 w-auto"
            src="/logo.png"
            alt="Your Company"
            width={5} height={5}
        />
        </div>
      <nav className="mt-5 flex-1" aria-label="Sidebar">
        <div className="space-y-1 px-2">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              current={currentPage === item.name}
              pageChange={pageChange}
            />
          ))}
        </div>
      </nav>
    </div>
    </div>
  );
};

export default Sidebar;