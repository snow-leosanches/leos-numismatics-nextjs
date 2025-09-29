"use client";

import React, { createContext } from 'react';
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Nav } from "@/components/nav";
import { PageTracker } from '@/components/page-tracker';
import { CartStore, useStore } from '@/store';
import { UserStore } from '@/store/user';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const MobxContext = createContext<{ cart: CartStore, user: UserStore }>(undefined!);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = useStore({
    products: [],
    currency: "USD"
  });

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MobxContext.Provider value={store}>
          <Nav />
          {children}
        </MobxContext.Provider>
      </body>
      <PageTracker />
    </html>
  );
}
