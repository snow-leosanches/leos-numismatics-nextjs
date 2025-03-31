"use client";

import { use } from "react";
import Head from "next/head";
import Image from "next/image";

import { banknotes } from "../catalog";

export interface BanknoteDetailsProps {
  params: Promise<{ id: string }>;
}

export default function BanknoteDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const selectedBanknote = banknotes.find((banknote) => banknote.id === id);
  if (!selectedBanknote) {
    return <div>Banknote not found</div>;
  }

  return <main className="container grid justify-center pt-8">
    <Head>
      <title>Leo's Numismatics - Banknote Details: {selectedBanknote.title}</title>
    </Head>
    <div className="col gap-4 pb-8">
      <h1 className="text-2xl">{selectedBanknote.title}</h1>
    </div>

    <div className="grid gap-4">
      <div>
        <Image
          src={selectedBanknote.imageUrl}
          alt={selectedBanknote.title}
          width={720}
          height={480}
        />
      </div>
    </div>
  </main>
}
