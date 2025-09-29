import { Suspense } from 'react';
import Link from "next/link";

import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useBuildHref } from "@/hooks/useBuildHref";

const LoginOrLogoutComponent = () => {
  const store = useStore();

  if (store.user.email) {
    return (
      <Link href="/account" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-300 md:p-0 dark:text-white md:dark:hover:text-orange-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
        {store.user.email}
      </Link>
    );
  }

  return <Link href="/login" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-300 md:p-0 dark:text-white md:dark:hover:text-orange-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</Link>
}

const LoginOrLogout = observer(LoginOrLogoutComponent);

// Create a new component that uses buildHref
const NavLinksWithParams = () => {
  const { buildHref } = useBuildHref();
  
  return (
    <>
      <li>
        <Link href={buildHref("/banknotes")} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-300 md:p-0 dark:text-white md:dark:hover:text-orange-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Banknotes</Link>
      </li>
      <li>
        <Link href={buildHref("/cart")} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-300 md:p-0 dark:text-white md:dark:hover:text-orange-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Your Cart</Link>
      </li>
    </>
  );
};

const NavComponent: React.FunctionComponent = () => {
  const { buildHref } = useBuildHref();
  
  return <nav className="bg-white border-gray-200 dark:bg-gray-900">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/images/icon.png" className="h-8" alt="Leo's Numismatics" />
        <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-orange-200 uppercase tracking-widest">Leo's Numismatics</span>
      </a>
      <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div className="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <Link href="/" className="block py-2 px-3 text-white bg-orange-300 rounded-sm md:bg-transparent md:text-orange-300 md:p-0 dark:text-white md:dark:text-orange-200" aria-current="page">Home</Link>
          </li>
          <Suspense fallback={
            <>
              <li>
                <Link href="/banknotes" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-300 md:p-0 dark:text-white md:dark:hover:text-orange-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Banknotes</Link>
              </li>
              <li>
                <Link href="/cart" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-300 md:p-0 dark:text-white md:dark:hover:text-orange-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Your Cart</Link>
              </li>
            </>
          }>
            <NavLinksWithParams />
          </Suspense>
          <li>
            <LoginOrLogout />
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-orange-300 md:p-0 dark:text-white md:dark:hover:text-orange-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
}

export const Nav = observer(NavComponent);