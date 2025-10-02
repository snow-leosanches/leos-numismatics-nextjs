import Image from "next/image";
import type { Metadata } from "next";

import { Footer } from "@/components/footer";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leo's Numismatics",
    description: "Collectible banknotes from all over the world",
  };
}

export default function Home() {
  const buildRandomUtmQueryString = () => {
    const sources = ['google', 'bing', 'duckduckgo', 'yahoo', 'baidu'];
    const mediums = ['cpc', 'organic', 'referral', 'email', 'social'];
    const campaigns = ['spring_sale', 'black_friday', 'holiday_promo', 'new_arrivals', 'homepage'];
    const terms = ['coins', 'banknotes', 'collectibles', 'currency', 'numismatics'];
    const content = ['ad1', 'ad2', 'ad3', 'ad4', 'ad5'];

    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomMedium = mediums[Math.floor(Math.random() * mediums.length)];
    const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const randomTerm = terms[Math.floor(Math.random() * terms.length)];
    const randomContent = content[Math.floor(Math.random() * content.length)];

    return `?utm_source=${randomSource}&utm_medium=${randomMedium}&utm_campaign=${randomCampaign}&utm_term=${randomTerm}&utm_content=${randomContent}`;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/images/logo-black.png"
          alt="Leo's Numismatics"
          width={621}
          height={339}
          priority
        />

        <div className="grid gap-4 items-center">
          <a href="?utm_source=duckduckgo&utm_medium=referral&utm_campaign=homepage" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
            <button>Simulate UTM: DuckDuckGo, Referral, Campaign: Homepage</button>
          </a>

          <a href={buildRandomUtmQueryString()} className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
            <button>Simulate Random UTM (with term and content)</button>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
