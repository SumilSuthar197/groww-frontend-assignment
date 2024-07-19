"use client";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltDown } from "react-icons/fa";

const TrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        setStatus("loading");
        const response = await api.get("/search/trending");
        setTrendingCoins(response.data.coins);
        console.log("trendingCoins", response);
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
        Trending Markets
      </h1>
      <table className="overflow-x-auto w-full mt-3 mb-1">
        <thead>
          <tr className="text-gray-400 uppercase leading-normal border-b border-gray-200">
            <th className="text-left text-sm font-medium pb-1 pl-2">Token</th>
            <th className="text-center text-sm font-medium pb-1">Symbol</th>
            <th className="text-center text-sm font-medium pb-1">Last Price</th>
            <th className="text-center text-sm font-medium pb-1">24H Change</th>
            <th className="text-center text-sm font-medium pb-1">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {trendingCoins.map((coin) => (
            <tr
              key={coin.item.coin_id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", JSON.stringify(coin))
              }
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
                  {coin.item.symbol}
                </p>
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

export default TrendingCoins;
