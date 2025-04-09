export class ProductEntity {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    imageUrl: string;
    quantity: number;
    
    constructor(
        id: string,
        name: string,
        description: string,
        price: number,
        currency: string,
        imageUrl: string,
        quantity: number
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
    }
}
