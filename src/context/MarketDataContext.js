"use client";

import { createContext, useState } from "react";

export const MarketDataContext = createContext();

export const MarketDataProvider = ({ children }) => {
  const [marketData, setMarketData] = useState({
    data: [],
    status: "idle",
    error: null,
  });
  const [trendingCoins, setTrendingCoins] = useState({
    data: [],
    status: "idle",
    error: null,
  });
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  return (
    <MarketDataContext.Provider
      value={{
        marketData,
        setMarketData,
        trendingCoins,
        setTrendingCoins,
        recentlyViewed,
        setRecentlyViewed,
        watchlist,
        setWatchlist,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};
