import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { GlobalData, TrendingTokens } from "@/types";
import { Switch } from "./ui/switch";
import { LargeCard, SmallCard } from "./highlight-cards";
import { formatNumber, toBillions, toTrillions } from "@/lib/utils";

const Highlights = () => {
  const [showMore, setShowMore] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);

  const { data: globalData, isLoading: globalLoading } = useQuery<GlobalData>({
    queryKey: ["global"],
    queryFn: async () => {
      const response = await fetch("https://api.coingecko.com/api/v3/global");
      return response.json();
    },
  });

  const { data: trendingData, isLoading } = useQuery<TrendingTokens>({
    queryKey: ["trending"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/search/trending"
      );
      return response.json();
    },
  });

  const largestGainers = trendingData?.coins
    .filter((coin) => coin.item.data.price_change_percentage_24h["usd"] > 0)
    .sort(
      (a, b) =>
        b.item.data.price_change_percentage_24h["usd"] -
        a.item.data.price_change_percentage_24h["usd"]
    );

  if (globalLoading || isLoading)
    return (
      <div className="flex justify-center w-screen">
        <div className="border-2 border-t-gray-800 border-transparent w-10 h-10 rounded-full animate-spin duration-300"></div>
      </div>
    );

  return (
    <div className="w-10/12 mx-auto">
      <div className="md:flex-row md:gap-x-8 md:mb-8 flex flex-col">
        <div className="flex-1">
          <h1 className="mb-1 md:font-bold md:!text-2xl text-gray-900 font-semibold text-sm leading-5">
            Cryptocurrency Prices by Market Cap
          </h1>
          <div className="md:!text-sm text-xs leading-4 text-gray-500">
            The global cryptocurrency market cap today is $
            {toTrillions(globalData?.data.total_market_cap["usd"] ?? 0)}, a{" "}
            <span
              className={`inline-flex align-middle items-center ${
                (globalData?.data?.market_cap_change_percentage_24h_usd ?? 0) <
                0
                  ? "text-[#ff3a33]"
                  : "text-[#00a83e]"
              }`}>
              {(globalData?.data.market_cap_change_percentage_24h_usd ?? 0) <
              0 ? (
                <FaCaretDown />
              ) : (
                <FaCaretUp />
              )}
              {globalData?.data.market_cap_change_percentage_24h_usd.toFixed(1)}
              %
            </span>{" "}
            change in the last 24 hours.{" "}
            <span
              className="cursor-pointer font-semibold underline text-slate-700 hover:text-primary-500 hover:underline"
              onClick={() => setShowMore(!showMore)}>
              {showMore ? "Hide" : "Read more"}
            </span>
            {showMore && (
              <div className="mt-4">
                Total cryptocurrency trading volume in the last day is at $
                {toBillions(globalData?.data.total_volume["usd"] ?? 0)}. Bitcoin
                dominance is at{" "}
                {globalData?.data.market_cap_percentage["btc"].toFixed(1)}% and
                Ethereum dominance is at{" "}
                {globalData?.data.market_cap_percentage["eth"].toFixed(1)}%.
                CoinGecko is now tracking{" "}
                {formatNumber(
                  (globalData?.data.active_cryptocurrencies ?? 0).toString()
                )}{" "}
                cryptocurrencies. The largest gainers in the industry right now
                are{" "}
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

      {showHighlights && (
        <div className="grid lg:grid-cols-3 gap-2 pb-4 lg:pb-9">
          <div className="flex flex-col gap-2">
            <SmallCard
              type="market"
              value={formatNumber(
                globalData?.data.total_market_cap["usd"].toFixed(0) ?? "0"
              )}
              change={globalData?.data.market_cap_change_percentage_24h_usd}
            />

            <SmallCard
              type="24h"
              value={formatNumber(
                globalData?.data.total_volume["usd"].toFixed(0) ?? "0"
              )}
            />
          </div>

          <LargeCard name="🔥 Trending" list={trendingData?.coins} />
          <LargeCard name="🚀 Largest Gainers" list={largestGainers} />
        </div>
      )}
    </div>
  );
};

export default Highlights;
