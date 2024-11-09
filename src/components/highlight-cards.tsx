import { Coin } from "@/types";
import { FaAngleRight, FaCaretDown, FaCaretUp } from "react-icons/fa";

type LargeCardProps = {
  name: string;
  list?: Coin[];
};

type SmallCardProps = {
  value?: string;
  type: "24h" | "market";
  change?: number;
};

export const LargeCard = ({ name, list }: LargeCardProps) => {
  return (
    <div className="max-w-[92vw] ring-gray-200 ring-2 py-1.5 px-2 rounded-xl">
      <div className="flex justify-between pt-2.5 mb-2.5 px-2 truncate">
        <div className="text-gray-900 font-semibold text-base leading-6">
          {name}
        </div>

        <div className="flex items-center space-x-1 cursor-pointer">
          <a
            href="#"
            className="flex items-center space-x-1 cursor-pointer font-semibold no-underline text-slate-700 hover:text-primary-500 text-sm">
            <span>View more</span>
            <FaAngleRight />
          </a>{" "}
        </div>
      </div>

      {list?.slice(0, 3)?.map((coin) => (
        <div
          key={coin.item.id}
          className="flex justify-between px-2 py-2.5 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-x-2 max-w-[50%]">
            <img
              alt={coin.item.name}
              className="rounded-full"
              style={{ minWidth: "24px" }}
              src={coin.item.thumb}
              width="24"
              height="24"
            />
            <div className="block truncate text-gray-500 ">
              <span className="text-gray-700 font-semibold text-sm leading-5">
                {coin.item.name}
              </span>{" "}
            </div>
          </div>
          <div className="flex justify-end items-center flex-shrink-0 max-w-[50%] break-words text-right">
            <div className="max-w-full inline-flex items-center">
              <span className="text-gray-900 font-medium text-sm leading-5">
                <span>
                  $
                  {coin.item.data.price.toFixed(
                    coin.item.data.price < 1 ? 5 : 2
                  )}
                </span>
                <span
                  className={`inline-flex items-center ${
                    coin.item.data.price_change_percentage_24h["usd"] < 0
                      ? "text-[#ff3a33]"
                      : "text-[#00a83e]"
                  }`}>
                  {coin.item.data.price_change_percentage_24h["usd"] < 0 ? (
                    <FaCaretDown />
                  ) : (
                    <FaCaretUp />
                  )}
                  {coin.item.data.price_change_percentage_24h["usd"].toFixed(1)}
                  %
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SmallCard = ({ type, value, change }: SmallCardProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-2 h-full ring-gray-200">
      <div className="flex flex-col">
        <div className="font-bold text-gray-900 text-lg leading-7">
          <span>${value}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center text-gray-500 font-semibold text-sm leading-5">
          {type === "market" ? "Market Cap" : "24h Trading Volume"}
          {type === "market" && change && (
            <span
              className={`inline-flex items-center ${
                change < 0 ? "text-[#ff3a33]" : "text-[#00a83e]"
              }`}>
              {change < 0 ? <FaCaretDown /> : <FaCaretUp />}
              {change.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
