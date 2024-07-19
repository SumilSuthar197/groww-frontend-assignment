"use client";
import { MarketDataContext } from "@/context/MarketDataContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const RecentlyViewed = () => {
  const { recentlyViewed } = useContext(MarketDataContext);
  const router = useRouter();
  useEffect(() => {}, [recentlyViewed]);
  if (recentlyViewed.length === 0) {
    return null;
  }
  return (
    <div className="flex justify-center items-center border-2 border-gray-200 bg-gray-50 rounded-md p-3">
      <div className="w-full">
        <h1 className="text-base font-bold text-center md:text-left">
          Recently Viewed
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
              {recentlyViewed.length > 0 &&
                recentlyViewed.map((coin) => (
                  <tr
                    key={coin.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/Coin/${coin.id}`)}
                  >
                    <td className="py-1">
                      <div className="flex flex-row items-center min-w-28">
                        <img
                          className="h-5 w-5 rounded-full object-fill"
                          src={coin.image.thumb}
                          alt={coin.name}
                        />
                        <p className="ml-1 text-sm font-medium">{coin.name}</p>
                      </div>
                    </td>
                    <td className="py-1 px-3">
                      <p className="text-sm font-medium text-center">
                        {coin.market_data.current_price.usd.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-1 px-3">
                      <p
                        className={`text-sm font-medium text-center flex justify-center items-center gap-1 ${
                          coin.market_data.price_change_percentage_24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <span>
                          {coin.market_data.price_change_percentage_24h >= 0 ? (
                            <FaLongArrowAltUp />
                          ) : (
                            <FaLongArrowAltDown />
                          )}
                        </span>
                        <span>{`${(
                          coin.market_data.price_change_percentage_24h || 0
                        ).toFixed(2)}%`}</span>
                      </p>
                    </td>
                    <td className="py-1 px-3">
                      <p className="text-sm font-medium text-center">
                        {coin.market_data.market_cap.usd
                          ? `$${new Intl.NumberFormat("en-US").format(
                              coin.market_data.market_cap.usd
                            )}`
                          : "N/A"}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
