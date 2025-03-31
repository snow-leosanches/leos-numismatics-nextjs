export const banknotes = [
    {
        id: "1-mark-darlehnskassenschein",
        imageUrl: "https://en.numista.com/catalogue/photos/allemagne-pre1945/62fd0623996a17.35679200-360.jpg",
        altText: "1 Mark (Darlehnskassenschein)",
        description: "„Darlehenskassenscheine“ were banknotes issued between 1914 and 1922 by the Reichsschuldenverwaltung (Reich debt administration).",
        price: 1.90,
    },
    {
        id: "50-dollars-fiji",
        imageUrl: "https://en.numista.com/catalogue/photos/fidji/67e06c205f59e5.49807271-original.jpg",
        altText: "50 Dollars (Fiji)",
        description: "The banknote celebrates Fiji’s past capturing the historic first raising of the Fijian flag at Albeit Park, Suva on 10 October 1970 depicting the birth of Fiji as an independent nation.",
        price: 43,
    },
    {
        id: "egimilliard-b-pengo-hungary",
        imageUrl: "https://en.numista.com/catalogue/photos/hongrie/628fba7500eeb9.38155568-original.jpg",
        altText: "Egimilliard B. Pengo (Hungary)",
        description: "One billion trillion Pengoes (1 Sextillion Pengoes = 10²¹)",
        price: 1200,
    }
];

export type Banknote = {
    id: string;
    imageUrl: string;
    altText: string;
    description: string;
    price: number;
};
