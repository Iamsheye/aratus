import React, { useState } from "react";
import { Switch } from "./ui/switch";

const Highlights = () => {
  const [showMore, setShowMore] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);

  return (
    <div className="w-10/12 mx-auto">
      <div className="md:flex-row md:gap-x-8 md:mb-8 flex flex-col">
        <div className="flex-1">
          <h1 className="mb-1 md:font-bold md:!text-2xl text-gray-900 font-semibold text-sm leading-5">
            Cryptocurrency Prices by Market Cap
          </h1>
          <div className="md:!text-sm text-xs leading-4 text-gray-500">
            The global cryptocurrency market cap today is $2.68 Trillion, a{" "}
            <span className="text-[#ff3a33]">1.3%</span> change in the last 24
            hours.{" "}
            <span
              className="cursor-pointer font-semibold underline text-slate-700 hover:text-primary-500 hover:underline"
              onClick={() => setShowMore(!showMore)}>
              {showMore ? "Hide" : "Read more"}
            </span>
            {showMore && (
              <div className="mt-4">
                Total cryptocurrency trading volume in the last day is at $176
                Billion. Bitcoin dominance is at 56.1% and Ethereum dominance is
                at 13.1%. CoinGecko is now tracking 15,114 cryptocurrencies. The
                largest gainers in the industry right now are{" "}
                <a
                  href="#"
                  className="cursor-pointer font-semibold no-underline text-slate-700 hover:text-primary-500">
                  Derivatives
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="cursor-pointer font-semibold no-underline text-slate-700 hover:text-primary-500">
                  Perpetuals
                </a>{" "}
                cryptocurrencies.
              </div>
            )}
          </div>
        </div>
        <div className="flex py-3 md:py-0 mt-1 gap-4">
          <div className="text-gray-700 font-semibold text-sm leading-5">
            Highlights
          </div>
          <Switch
            checked={showHighlights}
            onCheckedChange={() => setShowHighlights(!showHighlights)}
          />
        </div>
      </div>
    </div>
  );
};

export default Highlights;
