import dynamic from "next/dynamic";
import  Image from "next/image";
import { Fragment, MouseEventHandler, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  HomeIcon,
  MapIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AuthGuard } from "~/components/auth/withAuth";
import Sidebar from "~/components/layout/sidebar";
import Link from "next/link";
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Settings', href: '/home/settings/', icon: HomeIcon },
  { name: 'Collections', href: '/home/collections/', icon: MapIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface LayoutProps {
  initialPage: string
}


const Layout: React.FC<LayoutProps> = ( { initialPage} ) => {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);

  const PageComponent = dynamic(() => import(`~/components/content/${page}`));
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageChange: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const newPage = event.target.text.toLowerCase() as string;
    setPage(newPage); 
    void router.push(`/home/${newPage}`, undefined, { shallow: true });
    if(sidebarOpen){
      setSidebarOpen(false)
    }
  };

  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3ce9ef] to-[#2c6ba3]">
      <div className="flex h-screen w-screen max-w-7xl">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <Image
                        className="h-8 w-auto"
                        src="/logo.png"
                        alt="Your Company"
                        width={5} height={5}
                      />
                    </div>
                    <nav aria-label="Sidebar" className="mt-5">
                      <div className="space-y-1 px-2">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            passHref  
                            onClick={pageChange}
                            className={classNames(
                              item.name === page
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.name === page ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                'mr-4 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <Sidebar
              user={{
                name: 'John Doe',
                imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
                email: 'john.doe@example.com',
              }}
              navigation={navigation}
              currentPage={page}
              pageChange={pageChange}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="lg:hidden">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-1.5">
              <div>
                <Image
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="Your Company"
                  width={5} height={5}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="relative z-0 flex flex-1 overflow-hidden">
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last bg-slate-100">
              <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                <PageComponent />
              </div>
            </main>
          </div>
        </div>
      </div>
      </main>
      </AuthGuard>
  );
};

export default (Layout);

