"use client";
import api from "@/utils/api";
import { MdArrowCircleLeft, MdArrowCircleRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

const Page = () => {
  const [coins, setCoins] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setStatus("loading");
        const response = await api.get(
          `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=18&page=${page}&sparkline=false&price_change_percentage=24h`
        );
        setCoins(response.data);
        setStatus("done");
      } catch (error) {
        setStatus("error");
        setError(error);
      }
    };
    fetchCoins();
  }, [page]);

  return (
    <div className="flex justify-center items-center border-2 border-gray-200 bg-gray-50 rounded-md p-4">
      <div className="w-full">
        <h1 className="text-lg md:text-xl font-bold text-center md:text-left">
          Coins
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full mt-3 mb-1">
            <thead>
              <tr className="text-gray-400 uppercase leading-normal border-b-2 border-gray-200">
                <th className="text-left text-sm font-medium pb-1 pl-2">
                  Token
                </th>
                <th className="text-center text-sm font-medium pb-1">Symbol</th>
                <th className="text-center text-sm font-medium pb-1">
                  Last Price
                </th>
                <th className="text-center text-sm font-medium pb-1">
                  24H Change
                </th>
                <th className="text-center text-sm font-medium pb-1">
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
                coins.map((coin) => (
                  <tr
                    key={coin.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData(
                        "text/plain",
                        JSON.stringify({
                          id: coin.id,
                          name: coin.name,
                          image: coin.image,
                          current_price: coin.current_price,
                          price_change_percentage_24h:
                            coin.price_change_percentage_24h,
                          market_cap: coin.market_cap,
                        })
                      )
                    }
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/Coin/${coin.id}`)}
                  >
                    <td>
                      <div className="flex flex-row items-center ml-2">
                        <img
                          className="h-5 w-5 rounded-full object-fill"
                          src={coin.image}
                          alt={coin.name}
                        />
                        <p className="ml-2 text-sm font-medium">{coin.name}</p>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm font-medium text-center py-1">
                        {coin.symbol}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-medium text-center py-1">
                        {coin.current_price.toFixed(2)}
                      </p>
                    </td>
                    <td>
                      <p
                        className={`text-sm font-medium text-center py-1 flex justify-center items-center gap-1 ${
                          coin.price_change_percentage_24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <span>
                          {coin.price_change_percentage_24h >= 0 ? (
                            <FaLongArrowAltUp />
                          ) : (
                            <FaLongArrowAltDown />
                          )}
                        </span>
                        <span>{`${(
                          coin.price_change_percentage_24h || 0
                        ).toFixed(2)}%`}</span>
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-medium text-center py-1">
                        $
                        {new Intl.NumberFormat("en-US").format(
                          coin.market_cap
                        ) || "N/A"}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex flex-row justify-between items-center px-2 pt-3 border-t-2 border-gray-200">
            <button
              className={`font-medium text-base py-2 px-4 flex items-center justify-center space-x-2 rounded transition-colors duration-150 ${
                page <= 1 || status === "loading"
                  ? " text-gray-300 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-600 hover:text-gray-200"
              }`}
              onClick={() => {
                if (page <= 1) return;
                setPage((page) => page - 1);
              }}
              disabled={page <= 1 || status === "loading"}
            >
              <MdArrowCircleLeft />
              <span>Prev</span>
            </button>
            <button
              className={`font-medium text-base py-2 px-4 flex items-center justify-center space-x-2 rounded transition-colors duration-150 ${
                status === "loading"
                  ? " text-gray-300 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-600 hover:text-gray-200"
              }`}
              onClick={() => {
                setPage((page) => page + 1);
              }}
              disabled={status === "loading"}
            >
              <span>Next</span>
              <MdArrowCircleRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
