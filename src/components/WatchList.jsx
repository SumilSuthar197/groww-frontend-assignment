"use client";
import { MarketDataContext } from "@/context/MarketDataContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const WatchList = () => {
  const { watchlist, updateWatchlist } = useContext(MarketDataContext);
  const router = useRouter();

  if (watchlist.length === 0) {
    return (
      <div
        className={`text-black min-h-[200px] flex text-center items-center justify-center`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const incomingCoin = JSON.parse(e.dataTransfer.getData("text/plain"));
          updateWatchlist(incomingCoin);
        }}
      >
        Drag and drop coins here to add to your watchlist
      </div>
    );
  }
  return (
    <div
      className="w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const incomingCoin = JSON.parse(e.dataTransfer.getData("text/plain"));
        updateWatchlist(incomingCoin);
      }}
    >
      <h1 className="text-base font-bold text-center md:text-left">
        Watchlist
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full mt-3 mb-1">
          <thead>
            <tr className="text-gray-400 uppercase leading-normal border-b border-gray-200">
              <th className="text-left text-xs font-medium pb-1">Token</th>
              <th className="text-center text-xs font-medium pb-1">
                Last Price
              </th>
              <th className="text-center text-xs font-medium pb-1">
                24H Change
              </th>
              <th className="text-center text-xs font-medium pb-1">
                Market Cap
              </th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((coin) => (
              <tr
                key={coin.item.coin_id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/Coin/${coin.item.id}`)}
              >
                <td className="py-1">
                  <div className="flex flex-row items-center min-w-28">
                    <img
                      className="h-5 w-5 rounded-full object-fill"
                      src={coin.item.thumb}
                      alt={coin.item.name}
                    />
                    <p className="ml-1 text-sm font-medium">{coin.item.name}</p>
                  </div>
                </td>
                <td className="py-1 px-3">
                  <p className="text-sm font-medium text-center">
                    {coin.item.data?.price?.toFixed(2)}
                  </p>
                </td>
                <td className="py-1 px-3">
                  <p
                    className={`text-sm font-medium text-center flex justify-center items-center gap-1 ${
                      coin.item.data?.price_change_percentage_24h?.usd >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span>
                      {coin.item.data?.price_change_percentage_24h?.usd >= 0 ? (
                        <FaLongArrowAltUp />
                      ) : (
                        <FaLongArrowAltDown />
                      )}
                    </span>
                    <span>{`${(
                      coin.item.data?.price_change_percentage_24h?.usd || 0
                    ).toFixed(2)}%`}</span>
                  </p>
                </td>
                <td className="py-1 px-3">
                  <p className="text-sm font-medium text-center">
                    {coin.item.data?.market_cap || "N/A"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchList;
