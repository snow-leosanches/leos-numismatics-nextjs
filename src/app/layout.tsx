"use client";

import React, { createContext } from 'react';
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Nav } from "@/components/nav";
import { PageTracker } from '@/components/page-tracker';
import { CartStore, useStore } from '@/store';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const MobxContext = createContext<CartStore>(undefined!);

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
        <Nav />
        <MobxContext.Provider value={store}>
          {children}
        </MobxContext.Provider>
      </body>
      <PageTracker />
    </html>
  );
}
