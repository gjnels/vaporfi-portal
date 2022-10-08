import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

export const QuantityInput = ({
  count,
  increase,
  decrease,
  title,
  className,
  name,
}) => (
  <div className={twMerge("flex flex-col items-center", className)}>
    {title && <p>{title}</p>}
    <div className="flex w-[5em] items-center justify-between">
      <button
        type="button"
        className="rounded-full hover:text-green-400 focus-visible:text-green-400 focus-visible:outline-none"
        onClick={decrease}
      >
        <MinusCircleIcon className="h-[1.5em]" />
      </button>
      <span className="text-lg lg:text-xl">{count}</span>
      <button
        type="button"
        className="rounded-full hover:text-green-400 focus-visible:text-green-400 focus-visible:outline-none"
        onClick={increase}
      >
        <PlusCircleIcon className="h-[1.5em]" />
      </button>
    </div>
  </div>
);
