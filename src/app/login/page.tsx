"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { faker } from '@faker-js/faker';
import { observer } from "mobx-react-lite";

import { useStore } from "@/store";
import { snowplowTracker } from "../../components/snowplow-tracker";
import { trackCustomerIdentificationSpec } from "../../../snowtype/snowplow";
import { knownCustomers } from './known-customers';

export const dynamic = 'force-dynamic';

const LoginContent = () => {
  const store = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const resetSnowplowSession = () => {
    snowplowTracker?.clearUserData({ preserveSession: false, preserveUser: false });
    snowplowTracker?.setUserId(null);
  };

  const performLogin = () => {
    const email = faker.internet.email();
    store.user.setUserId(email);
    store.user.setName(faker.person.fullName());
    store.user.setEmail(email);
    store.user.setAddress(faker.location.streetAddress());
    store.user.setCity(faker.location.city());
    store.user.setState(faker.location.state());
    store.user.setZipCode(faker.location.zipCode());
    store.user.setCountry(faker.location.country());

    snowplowTracker?.setUserId(email);

    trackCustomerIdentificationSpec({
      email: email,
      phone: faker.phone.number()
    });

    router.push(returnUrl);
  }

  return (
    <main className="container grid justify-center pt-8">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Automatic Login</h1>
      </div>

      <div className="grid gap-4 pb-8">
        <p>Who are you?</p>
        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={performLogin}>Who, who, who, who?</button>
      </div>

      <div className="grid gap-4 pb-8">
        <p>Reset Snowplow anonymous session (clears domain/session cookies and user id).</p>
        <button type="button" className="rounded-full border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center bg-transparent text-foreground gap-2 hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={resetSnowplowSession}>Reset Snowplow session</button>
      </div>

      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Known Customer Login</h1>
      </div>

      <div className="grid gap-4">
        {knownCustomers.map((customer) => (
          <button key={customer.id} className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={() => {
            store.user.setUserId(customer.id);
            store.user.setName(customer.name);
            store.user.setEmail(customer.email);
            store.user.setAddress(customer.address);
            store.user.setCity(customer.city);
            store.user.setState(customer.state);
            store.user.setZipCode(customer.zipCode);
            store.user.setCountry(customer.country);

            snowplowTracker?.setUserId(customer.id);

            trackCustomerIdentificationSpec({
              email: customer.email,
              phone: faker.phone.number()
            });

            router.push(returnUrl);
          }}>{customer.name} ({customer.email})</button>
        ))}
      </div>
    </main>
  );
}

const Login = observer(LoginContent);

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="container grid justify-center pt-8">
        <div className="col gap-4 pb-8">
          <h1 className="text-2xl">Login</h1>
        </div>
        <div className="grid gap-4">
          <p>Loading...</p>
        </div>
      </main>
    }>
      <Login />
    </Suspense>
  );
}