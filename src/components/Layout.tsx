import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';
import Chatbot from './Chatbot';
import clsx from 'clsx';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Our Services', href: '/cosmetic-services' },
    { name: 'What concerns you', href: '/concerns' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Gallery', href: '/gallery' },
];

type User = {
    email?: string;
    // add other properties if needed
};

export default function Layout() {
    const { currentUser, logout, isAdmin } = useAuth() as {
        currentUser: User | null;
        logout: () => void;
        isAdmin: boolean;
    };

    // Add admin navigation item if user is admin
    const fullNavigation = isAdmin 
        ? [...navigation, { name: 'Admin Panel', href: '/admin' }]
        : navigation;

    return (
        <div className="min-h-screen bg-gray-100">
            <Disclosure as="nav" className="bg-white shadow-sm">
                {({ open }) => (
                    <>
                        <div className="w-full px-2 sm:px-4">
                            <div className="flex h-16 justify-between">
                                <div className="flex">
                                    <div className="flex flex-shrink-0 items-center">
                                        <Link to="/" className="text-xl font-bold text-primary-600">
                                            Dr.Daniel Esthetixs
                                        </Link>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                        {fullNavigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                    {currentUser ? (
                                        <Menu as="div" className="relative ml-3">
                                            <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                                <span className="sr-only">Open user menu</span>
                                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <span className="text-primary-700 font-medium">
                                                        {(currentUser.email && currentUser.email[0]?.toUpperCase()) || "U"}
                                                    </span>
                                                </div>
                                            </Menu.Button>
                                            <Transition
                                                as={React.Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                to="/profile"
                                                                className={clsx(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700'
                                                                )}
                                                            >
                                                                Your Profile
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    {isAdmin && (
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link
                                                                    to="/admin"
                                                                    className={clsx(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700'
                                                                    )}
                                                                >
                                                                    Admin Dashboard
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    )}
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => logout()}
                                                                className={clsx(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                                                )}
                                                            >
                                                                Sign out
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                        >
                                            Sign in
                                        </Link>
                                    )}
                                </div>
                                <div className="-mr-2 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>
                        {/* Golden Line */}
                        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 pb-3 pt-2">
                                {fullNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pb-3 pt-4">
                                {currentUser ? (
                                    <>
                                        <div className="flex items-center px-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <span className="text-primary-700 font-medium">
                                                        {currentUser.email?.[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-500">
                                                    {currentUser.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                            >
                                                Your Profile
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => logout()}
                                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-3 space-y-1">
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <main className="flex-1">
                <Outlet />
            </main>

            {/* Chatbot Component */}
            <Chatbot />

            <Footer />
        </div>
    );
}