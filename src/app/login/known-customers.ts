export const knownCustomers: KnownCustomer[] = [
    {
        id: "known-customer-1",
        name: "Scrooge McDuck",
        email: "unclescrooge@disney.com",
        address: "124 Duckburg Lane",
        city: "Duckburg",
        state: "Calisota",
        zipCode: "90001",
        country: "USA"
    },
    {
        id: "known-customer-2",
        name: "Bruce Wayne",
        email: "bruce@wayneenterprises.com",
        address: "1007 Mountain Drive",
        city: "Gotham",
        state: "New Jersey",
        zipCode: "07001",
        country: "USA"
    },
    {
        id: "known-customer-3",
        name: "Tony Stark",
        email: "tony@starkindustries.com",
        address: "10880 Malibu Point",
        city: "Malibu",
        state: "California",
        zipCode: "90265",
        country: "USA"
    }
];

export type KnownCustomer = {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};