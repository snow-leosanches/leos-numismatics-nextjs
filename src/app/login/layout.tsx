import { PageTracker } from '@/components/page-tracker';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leo's Numismatics - Login",
    description: "Collectible banknotes from all over the world",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    {children}
    <PageTracker />
  </>
}
