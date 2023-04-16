import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
    titleId?: string | undefined;
}>;
    current: boolean;
    pageChange: MouseEventHandler<HTMLAnchorElement>;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon: Icon, current, pageChange }) => {
  const router = useRouter();

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <Link 
      href={href}
      passHref
      onClick={pageChange}
      className={classNames(
        current ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
      )}
    >
      <Icon
        className={classNames(
          current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
          'mr-3 h-6 w-6',
        )}
        aria-hidden="true"
      />
      {name}
    </Link >
  );
};

export default NavItem;