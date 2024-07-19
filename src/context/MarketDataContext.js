"use client";

import { createContext, useEffect, useState } from "react";

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
  useEffect(() => {
    const getDataFromLocalStorage = () => {
      console.log("context fetch from local storage");
      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
      setWatchlist(watchlist);
      const recentlyViewed = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );
      setRecentlyViewed(recentlyViewed);
    };
    getDataFromLocalStorage();
  }, []);

  const updateRecentlyViewed = (coin) => {
    console.log("running updateRecentlyViewed");
    let list =
      JSON.parse(localStorage.getItem("recentlyViewed")) || recentlyViewed;
    list = list.filter((recent) => recent.id !== coin.id);
    list.unshift(coin);
    if (list.length > 5) {
      list.pop();
    }
    setRecentlyViewed(list);
    localStorage.setItem("recentlyViewed", JSON.stringify(list));
  };

  const updateWatchlist = (coin) => {
    console.log("running updateWatch");
    let list = JSON.parse(localStorage.getItem("watchlist")) || watchlist;
    if (!list.some((watched) => watched.item.coin_id === coin.item.coin_id)) {
      list.unshift(coin);
      setWatchlist(list);
      localStorage.setItem("watchlist", JSON.stringify(list));
    }
  };

  return (
    <MarketDataContext.Provider
      value={{
        recentlyViewed,
        watchlist,
        updateRecentlyViewed,
        updateWatchlist,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};
