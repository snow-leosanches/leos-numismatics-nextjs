import { Metadata } from 'next';

import { PageTracker } from '@/components/page-tracker';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leo's Numismatics - My Cart",
    description: "Collectible banknotes from all over the world",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    {children}
    <PageTracker />
  </>
}