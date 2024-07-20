"use client";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const TrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      const cacheKey = "trendingCoins";
      const cacheExpiry = 10 * 60 * 1000; // 10 minutes
      const cachedItem = localStorage.getItem(cacheKey);

      if (cachedItem) {
        const { data, timestamp } = JSON.parse(cachedItem);
        const currentTime = new Date().getTime();

        if (currentTime - timestamp < cacheExpiry) {
          setTrendingCoins(data);
          setStatus("done");
          return;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
      try {
        setStatus("loading");
        const response = await api.get("/search/trending");
        const data = response.data.coins;
        const timestamp = new Date().getTime();

        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp }));

        setTrendingCoins(data);
        setStatus("done");
      } catch (error) {
        setStatus("error");
        setError(error);
      }
    };

    fetchTrendingCoins();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-lg md:text-xl font-bold text-center md:text-left">
        Trending Coins
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full mt-3 mb-1">
          <thead>
            <tr className="text-gray-400 dark:text-slate-200 uppercase leading-normal border-b border-gray-200">
              <th className="text-left text-sm font-medium pb-1 pr-2">Token</th>
              <th className="text-center text-sm font-medium pb-1 px-3">
                Symbol
              </th>
              <th className="text-center text-sm font-medium pb-1 px-3">
                Last Price
              </th>
              <th className="text-center text-sm font-medium pb-1 px-3">
                24H Change
              </th>
              <th className="text-center text-sm font-medium pb-1 px-3">
                Market Cap
              </th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" && (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  <div className="flex justify-center items-center flex-col">
                    <div
                      className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-gray-900 rounded-full"
                      role="status"
                    ></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            )}
            {status === "error" && (
              <tr className="w-full">
                <td colSpan="5" className="text-center py-4">
                  <p className="text-red-600 text-center">
                    An error occurred while fetching data
                  </p>
                </td>
              </tr>
            )}
            {status === "done" &&
              trendingCoins.map((coin) => (
                <tr
                  key={coin.item.coin_id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      "text/plain",
                      JSON.stringify({
                        id: coin.item.id,
                        name: coin.item.name,
                        image: coin.item.large,
                        current_price: coin.item.data?.price,
                        price_change_percentage_24h:
                          coin.item.data?.price_change_percentage_24h.usd,
                        market_cap: coin.item.data?.market_cap,
                      })
                    )
                  }
                  className="hover:bg-gray-100  dark:hover:bg-slate-700 cursor-pointer"
                  onClick={() => router.push(`/Coin/${coin.item.id}`)}
                >
                  <td className="py-1 pr-3 pl-1">
                    <div className="flex flex-row items-center">
                      <img
                        className="h-5 w-5 rounded-full object-fill"
                        src={coin.item.large}
                        alt={coin.item.name}
                      />
                      <p className="ml-2 text-sm font-medium">
                        {coin.item.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-1 px-3">
                    <p className="text-sm font-medium text-center py-1">
                      {coin.item.symbol}
                    </p>
                  </td>
                  <td className="py-1 px-3">
                    <p className="text-sm font-medium text-center py-1">
                      {coin.item.data?.price?.toFixed(2)}
                    </p>
                  </td>
                  <td className="py-1 px-3">
                    <p
                      className={`text-sm font-medium text-center py-1 flex justify-center items-center gap-2 ${
                        coin.item.data?.price_change_percentage_24h?.usd >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      <span>
                        {coin.item.data?.price_change_percentage_24h?.usd >=
                        0 ? (
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
                    <p className="text-sm font-medium text-center py-1">
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

export default TrendingCoins;
