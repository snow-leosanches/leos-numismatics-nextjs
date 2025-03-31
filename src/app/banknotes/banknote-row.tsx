import Image from "next/image";
import Link from "next/link";

export interface BanknoteRowProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
}

export const BanknoteRow: React.FunctionComponent<BanknoteRowProps> = (props) => (
  <div className="flex items-center gap-4">
    <div className="flex flex-col gap-2">
      <Image
        src={props.imageUrl}
        alt={props.title}
        width={180}
        height={120}
      />
    </div>
    <div className="flex flex-col gap-2">
      <h2 className="text-lg">{props.title}</h2>
      <p className="text-sm text-gray-500">{props.description}</p>
      <p className="text-sm text-gray-500">Price: ${props.price.toFixed(2)}</p>
      <div className="flex gap-2">
        <Link href={`/banknotes/${props.id}`} className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          View Details
        </Link>
        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
)