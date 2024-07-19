"use client";
import { MarketDataContext } from "@/context/MarketDataContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { FaLongArrowAltDown } from "react-icons/fa";

const RecentlyViewed = () => {
  const { recentlyViewed, setRecentlyViewed, watchlist, setWatchlist } =
    useContext(MarketDataContext);
  const router = useRouter();

  useEffect(() => {
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);
  if (watchlist.length === 0) {
    <div
      className={`mb-5 theme-transition p-3 border-[2px] rounded-lg text-black bg-gray-100 border-gray-400 min-h-[200px] flex items-center justify-center`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const incomingCoin = JSON.parse(e.dataTransfer.getData("text/plain"));
        if (
          !watchlist.some(
            (coin) => coin.item.coin_id === incomingCoin.item.coin_id
          )
        ) {
          const newWatchlist = [...watchlist, incomingCoin];
          setWatchlist(newWatchlist);
          localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
        }
      }}
    >
      Drag and drop coins here to add to your watchlist
    </div>;
  }
  return (
    <div
      className="w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const incomingCoin = JSON.parse(e.dataTransfer.getData("text/plain"));
        if (
          !watchlist.some(
            (coin) => coin.item.coin_id === incomingCoin.item.coin_id
          )
        ) {
          const newWatchlist = [...watchlist, incomingCoin];
          setWatchlist(newWatchlist);
          localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
        }
      }}
    >
      <h1 className="text-base font-bold text-center md:text-left">
        Recently Viewed
      </h1>
      <table className="overflow-x-auto w-full mt-3 mb-1">
        <thead>
          <tr className="text-gray-400 uppercase leading-normal border-b border-gray-200">
            <th className="text-left text-xs font-medium pb-1">Token</th>
            <th className="text-center text-xs font-medium pb-1">Last Price</th>
            <th className="text-center text-xs font-medium pb-1">24H Change</th>
            <th className="text-center text-xs font-medium pb-1">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((coin) => (
            <tr
              key={coin.item.coin_id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(`/coins/${coin.item.symbol}`)}
            >
              <td>
                <div className="flex flex-row items-center ml-2">
                  <img
                    className="h-5 w-5 rounded-full object-fill"
                    src={coin.item.large}
                    alt={coin.item.name}
                  />
                  <p className="ml-2 text-sm font-medium">{coin.item.name}</p>
                </div>
              </td>
              <td>
                <p className="text-sm font-medium text-center py-1">
                  {coin.item.data?.price?.toFixed(2)}
                </p>
              </td>
              <td>
                <p
                  className={`text-sm font-medium text-center py-1 flex justify-center items-center gap-2 ${
                    coin.item.data?.price_change_percentage_24h?.usd >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <span>
                    <FaLongArrowAltDown />
                  </span>
                  <span>{`${(
                    coin.item.data?.price_change_percentage_24h?.usd || 0
                  ).toFixed(2)}%`}</span>
                </p>
              </td>
              <td>
                <p className="text-sm font-medium text-center py-1">
                  {coin.item.data?.market_cap || "N/A"}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentlyViewed;
