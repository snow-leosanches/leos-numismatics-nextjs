export const banknotes: Banknote[] = [
    {
        id: "1-mark-darlehnskassenschein",
        imageUrl: "/images/banknotes/1-mark-darlehnskassenschein.png",
        title: "1 Mark (Darlehnskassenschein)",
        description: "„Darlehenskassenscheine“ were banknotes issued between 1914 and 1922 by the Reichsschuldenverwaltung (Reich debt administration).",
        price: 1.90,
    },
    {
        id: "50-dollars-fiji",
        imageUrl: "/images/banknotes/50-dollars-fiji.png",
        title: "50 Dollars (Fiji)",
        description: "The banknote celebrates Fiji's past capturing the historic first raising of the Fijian flag at Albeit Park, Suva on 10 October 1970 depicting the birth of Fiji as an independent nation.",
        price: 43,
    },
    {
        id: "egimilliard-b-pengo-hungary",
        imageUrl: "/images/banknotes/egimilliard-b-pengo-hungary.png",
        title: "Egimilliard B. Pengo (Hungary)",
        description: "One billion trillion Pengoes (1 Sextillion Pengoes = 10²¹)",
        price: 1200,
    },
    {
        id: "10-000-000-000-dinaras-yugoslavia",
        imageUrl: "/images/banknotes/10-000-000-000-dinaras-yugoslavia.jpg",
        title: "10,000,000,000 Dinaras (Yugoslavia)",
        description: "The 10 billion dinar banknote was issued in 1993 during a period of hyperinflation in the former Yugoslavia.",
        price: 12,
    },
    {
        id: "100-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/100-trillion-dollars-zimbabwe.jpg",
        title: "100 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 100 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        price: 59,
    },
    {
        id: "50-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/50-trillion-dollars-zimbabwe.jpg",
        title: "50 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 50 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        price: 12,
    },
    {
        id: "20-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/20-trillion-dollars-zimbabwe.jpg",
        title: "20 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 20 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        price: 12,
    },
    {
        id: "10-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/10-trillion-dollars-zimbabwe.jpg",
        title: "10 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 10 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        price: 12,
    }
];

export type Banknote = {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    price: number;
};
