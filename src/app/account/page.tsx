"use client";

import { useRouter } from 'next/navigation';
import { faker } from '@faker-js/faker';
import { observer } from "mobx-react-lite";

import { useStore } from "@/store";
import { snowplowTracker } from "../../components/snowplow-tracker";

export const dynamic = 'force-dynamic';

const Account = () => {
  const store = useStore();
  const router = useRouter();

  if (!store.user.userId) {
    return <div className="container grid justify-center pt-8 px-4">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">You are not logged in</h1>
      </div>
    </div>
  }

  const changeName = () => {
    const name = faker.person.fullName();
    store.user.setName(name);
    router.refresh();
  }

  const changeEmail = () => {
    const email = faker.internet.email();
    store.user.setEmail(email);
    store.user.setUserId(email);

    if (snowplowTracker) {
      snowplowTracker.setUserId(email);
    } else {
      console.warn("Snowplow tracker is not defined");
    }
    
    router.refresh();
  }

  const logout = () => {
    store.user.logout();
    router.push("/");
  }

  return <main className="container grid justify-center pt-8 px-4">
    <div className="col gap-4 pb-8">
      <h1 className='text-2xl'>Your Account</h1>
    </div>

    <div className="grid gap-4">
      <p className="text-lg">Welcome, {store.user.name}!</p>
      <p className="text-lg">Your email is: {store.user.email}</p>
      <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={changeEmail}>Change Email</button>
      <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={changeName}>Change Name</button>
    </div>

    <div className='grid gap-4 py-4'>
      <button className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto' onClick={logout}>
        Logout
      </button>
    </div>
  </main>
}

export default observer(Account);