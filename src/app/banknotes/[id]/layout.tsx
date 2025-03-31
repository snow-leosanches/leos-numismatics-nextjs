import { PageTracker } from '@/components/page-tracker';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Leo's Numismatics - Banknote Details",
  description: "Collectible banknotes from all over the world"
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    {children}
    <PageTracker />
  </>
}
