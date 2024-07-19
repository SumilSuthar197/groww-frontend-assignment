"use client";
import MarketChart from "@/components/MarketChart";
import { MarketDataContext } from "@/context/MarketDataContext";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const PriceRangeSlider = ({
  lowTitle,
  highTitle,
  lowPrice,
  highPrice,
  currentPrice,
}) => {
  return (
    <div className="my-2 grid grid-cols-8 md:grid-cols-8 gap-2 items-center">
      <div className="col-span-2 md:col-span-1 flex flex-col justify-center items-center">
        <span className="text-gray-500 text-xs sm:text-sm">{lowTitle}</span>
        <span className="text-sm sm:text-base md:text-base font-semibold">
          {lowPrice.toFixed(2)}
        </span>
      </div>
      <div className="col-span-4 md:col-span-6 w-full flex justify-center items-center">
        <input
          type="range"
          min={lowPrice.toFixed(2) || 0}
          max={highPrice.toFixed(2) || 1000}
          step={1}
          value={currentPrice.toFixed(2) || 500}
          className="custom-range w-full"
        />
      </div>
      <div className="col-span-2 md:col-span-1 flex flex-col justify-center items-center">
        <span className="text-gray-500 text-xs sm:text-sm">{highTitle}</span>
        <span className="text-sm sm:text-base md:text-base font-semibold">
          {highPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const FundamentalRow = ({ title, value }) => {
  return (
    <div className="flex flex-row justify-between items-center py-1">
      <p className="text-base text-gray-500">{title}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  );
};

const Page = () => {
  const { symbol } = useParams();
  const [coinDetails, setCoinDetails] = useState([]);
  const [status, setStatus] = useState("idle");
  const { updateRecentlyViewed } = useContext(MarketDataContext);
  useEffect(() => {
    const getCoinDetails = async () => {
      try {
        const response = await api.get(`/coins/${symbol}`);
        setCoinDetails(response.data);
        updateRecentlyViewed(response.data);
        setStatus("done");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    getCoinDetails();
  }, []);
  if (status === "idle") {
    return (
      <div className="flex flex-col justify-center items-center py-4">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"
          role="status"
        ></div>
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }
  return (
    <div className="px-1">
      <div className="py-4">
        <img
          src={coinDetails.image.small}
          className="h-14 w-14"
          alt={`${symbol} Icon`}
        />
        <>
          <h1 className="text-lg uppercase mt-2 font-bold text-gray-800">
            {coinDetails.name}
          </h1>
          <h1 className="text-2xl font-bold text-gray-800 flex justify-start items-center">
            ${coinDetails.market_data.current_price.usd.toFixed(2)}
            <span
              className={`${
                coinDetails.market_data.price_change_percentage_24h >= 0
                  ? "bg-green-200 text-green-600"
                  : "bg-red-200 text-red-600"
              } flex flex-row justify-center items-center gap-[2px] rounded-lg px-2 py-1 text-sm ml-2`}
            >
              {coinDetails.market_data.price_change_percentage_24h >= 0 ? (
                <FaArrowUp size={12} />
              ) : (
                <FaArrowDown size={12} />
              )}
              {coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%
              in 24H
            </span>
          </h1>
        </>
      </div>
      {/* Graph */}
      <MarketChart coins={symbol} isMultiple={false} />

      {/* Performance */}
      <h1 className="text-base lg:text-xl font-bold text-gray-800 mt-4">
        Performance
      </h1>
      <PriceRangeSlider
        lowTitle="24H Low"
        highTitle="24H High"
        lowPrice={coinDetails.market_data.low_24h.usd}
        highPrice={coinDetails.market_data.high_24h.usd}
        currentPrice={coinDetails.market_data.current_price.usd}
      />
      <PriceRangeSlider
        lowTitle="52W Low"
        highTitle="52W High"
        lowPrice={coinDetails.market_data.atl.usd}
        highPrice={coinDetails.market_data.ath.usd}
        currentPrice={coinDetails.market_data.current_price.usd}
      />
      <hr className="my-4" />
      {/* Fundamentals */}
      <h1 className="text-base lg:text-xl font-bold text-gray-800 mt-4">
        Fundamentals
      </h1>
      <div className="py-2">
        <FundamentalRow
          title="Market Cap"
          value={`$${coinDetails.market_data.market_cap.usd}`}
        />
        <FundamentalRow
          title="Total Volume"
          value={`$${coinDetails.market_data.total_volume.usd}`}
        />
        <FundamentalRow
          title="Fully Diluted Valuation"
          value={`$${coinDetails.market_data.fully_diluted_valuation.usd}`}
        />
        <FundamentalRow
          title="Circulating Supply"
          value={`${coinDetails.market_data.circulating_supply}`}
        />
        <FundamentalRow
          title="Total Supply"
          value={`${coinDetails.market_data.total_supply}`}
        />
        <FundamentalRow
          title="Max Supply"
          value={coinDetails.market_data.max_supply}
        />
      </div>
      <hr className="my-4" />
      {/* About */}
      <h1 className="text-base lg:text-xl font-bold text-gray-800 mt-4">
        About {symbol}
      </h1>
      <div className="py-2">
        {coinDetails.description.en ? (
          <p
            className="text-base text-gray-500"
            dangerouslySetInnerHTML={{ __html: coinDetails.description.en }}
          />
        ) : (
          <p className="text-base text-gray-500">N/A</p>
        )}
      </div>
    </div>
  );
};

export default Page;
