"use client";

import { useRouter } from 'next/navigation';
import { faker } from '@faker-js/faker';
import { observer } from "mobx-react-lite";

import { useStore } from "@/store";

const Login = () => {
  const store = useStore();
  const router = useRouter();

  const performLogin = () => {
    const email = faker.internet.email();
    store.user.setUserId(email);
    store.user.setName(faker.person.fullName());
    store.user.setEmail(email);

    console.log('store.user', store.user);
    router.push("/");
  }

  return (
    <main className="container grid justify-center pt-8">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Automatic Login</h1>
      </div>

      <div className="grid gap-4">
        <p>Who are you?</p>
        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={performLogin}>Who, who, who, who?</button>
      </div>
    </main>
  );
}

export default observer(Login);