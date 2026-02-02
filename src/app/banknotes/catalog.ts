export const banknotes: Banknote[] = [
    {
        id: "1-mark-darlehnskassenschein",
        imageUrl: "/images/banknotes/1-mark-darlehnskassenschein.png",
        title: "1 Mark (Darlehnskassenschein)",
        description: "„Darlehenskassenscheine“ were banknotes issued between 1914 and 1922 by the Reichsschuldenverwaltung (Reich debt administration).",
        country: "Germany",
        price: 1.90,
    },
    {
        id: "50-dollars-fiji",
        imageUrl: "/images/banknotes/50-dollars-fiji.png",
        title: "50 Dollars (Fiji)",
        description: "The banknote celebrates Fiji's past capturing the historic first raising of the Fijian flag at Albeit Park, Suva on 10 October 1970 depicting the birth of Fiji as an independent nation.",
        country: "Fiji",
        price: 43,
    },
    {
        id: "egimilliard-b-pengo-hungary",
        imageUrl: "/images/banknotes/egimilliard-b-pengo-hungary.png",
        title: "Egimilliard B. Pengo (Hungary)",
        description: "One billion trillion Pengoes (1 Sextillion Pengoes = 10²¹)",
        country: "Hungary",
        price: 1200,
    },
    {
        id: "10-000-000-000-dinaras-yugoslavia",
        imageUrl: "/images/banknotes/10-000-000-000-dinaras-yugoslavia.jpg",
        title: "10,000,000,000 Dinaras (Yugoslavia)",
        description: "The 10 billion dinar banknote was issued in 1993 during a period of hyperinflation in the former Yugoslavia.",
        country: "Yugoslavia",
        price: 12,
    },
    {
        id: "100-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/100-trillion-dollars-zimbabwe.jpg",
        title: "100 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 100 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        country: "Zimbabwe",
        price: 59,
    },
    {
        id: "50-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/50-trillion-dollars-zimbabwe.jpg",
        title: "50 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 50 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        country: "Zimbabwe",
        price: 12,
    },
    {
        id: "20-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/20-trillion-dollars-zimbabwe.jpg",
        title: "20 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 20 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        country: "Zimbabwe",
        price: 12,
    },
    {
        id: "10-trillion-dollars-zimbabwe",
        imageUrl: "/images/banknotes/10-trillion-dollars-zimbabwe.jpg",
        title: "10 Trillion Dollars (Zimbabwe)",
        description: "The Reserve Bank of Zimbabwe issued the 10 trillion dollar banknote in January 2009 during a period of hyperinflation.",
        country: "Zimbabwe",
        price: 12,
    },
    {
        id: "5-bolivares-venezuela-carabobo-2021",
        imageUrl: "/images/banknotes/5-bolivares-venezuela-carabobo-2021.jpg",
        title: "5 Bolívares (200th Anniversary of the Battle of Carabobo)",
        description: "Commemorative banknote issued by the Central Bank of Venezuela in 2021 for the 200th anniversary of the Battle of Carabobo. Bolivar Digital series, 156 × 69 mm.",
        country: "Venezuela",
        price: 2.50,
    },
    {
        id: "10-bolivares-venezuela-carabobo-2021",
        imageUrl: "/images/banknotes/10-bolivares-venezuela-carabobo-2021.jpg",
        title: "10 Bolívares (200th Anniversary of the Battle of Carabobo)",
        description: "Commemorative banknote issued by the Central Bank of Venezuela in 2021 for the 200th anniversary of the Battle of Carabobo. Bolivar Digital series, 156 × 69 mm.",
        country: "Venezuela",
        price: 4,
    },
    {
        id: "20-bolivares-venezuela-carabobo-2021",
        imageUrl: "/images/banknotes/20-bolivares-venezuela-carabobo-2021.jpg",
        title: "20 Bolívares (200th Anniversary of the Battle of Carabobo)",
        description: "Commemorative banknote issued by the Central Bank of Venezuela in 2021 for the 200th anniversary of the Battle of Carabobo. Red-brown on orange underprint, 156 × 69 mm.",
        country: "Venezuela",
        price: 5,
    },
    {
        id: "50-bolivares-venezuela-carabobo-2021",
        imageUrl: "/images/banknotes/50-bolivares-venezuela-carabobo-2021.jpg",
        title: "50 Bolívares (200th Anniversary of the Battle of Carabobo)",
        description: "Commemorative banknote issued by the Central Bank of Venezuela in 2021 for the 200th anniversary of the Battle of Carabobo. Dark-green on light-green underprint, 156 × 69 mm.",
        country: "Venezuela",
        price: 8,
    },
    {
        id: "100-bolivares-venezuela-carabobo-2021",
        imageUrl: "/images/banknotes/100-bolivares-venezuela-carabobo-2021.jpg",
        title: "100 Bolívares (200th Anniversary of the Battle of Carabobo)",
        description: "Commemorative banknote issued by the Central Bank of Venezuela in 2021 for the 200th anniversary of the Battle of Carabobo. Purple on violet underprint, 156 × 69 mm.",
        country: "Venezuela",
        price: 8,
    },
    {
        id: "500-bolivares-venezuela-maracaibo-2023",
        imageUrl: "/images/banknotes/500-bolivares-venezuela-maracaibo-2023.jpg",
        title: "500 Bolívares (200th Anniversary of the Naval Battle of Lake Maracaibo)",
        description: "Commemorative banknote issued by the Central Bank of Venezuela in 2023 for the 200th anniversary of the Naval Battle of Lake Maracaibo. Features Simón Bolívar and the Rafael Urdaneta Bridge, 159 × 69 mm.",
        country: "Venezuela",
        price: 14,
    }
];

export type Banknote = {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    price: number;
    country: string;
};
