import { BanknoteRow } from "./banknote-row";
import { Banknote, banknotes } from "./catalog";

export default function Banknotes() {
  return <main className="container grid justify-center pt-8">
    <div className="col gap-4 pb-8">
      <h1 className="text-2xl">Our Banknotes</h1>
    </div>

    <div className="grid gap-4">
      {banknotes.map((banknote: Banknote) => (
        <BanknoteRow
          id={banknote.id}
          key={banknote.id}
          imageUrl={banknote.imageUrl}
          title={banknote.title}
          description={banknote.description}
          price={banknote.price}
        />
      ))}
    </div>
  </main>
}
