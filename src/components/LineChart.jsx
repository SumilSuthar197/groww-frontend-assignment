"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import api from "@/utils/api";
import filterData from "@/utils/filterData";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const LineChart = () => {
  const chartRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("7d");
  const [marketData, setMarketData] = useState({
    data: [],
    status: "idle",
    error: null,
  });
  const colors = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 205, 86)",
  ];

  const fetchMarketData = async () => {
    try {
      const coinsToFetch = ["bitcoin", "ethereum","solana"];
      const promises = coinsToFetch.map((coin) => {
        return api.get(`/coins/${coin}/market_chart?vs_currency=usd&days=90`);
      });
      const responses = await Promise.all(promises);
      const data = responses.map((res, index) => ({
        name: coinsToFetch[index],
        data: res.data.prices,
      }));
      setMarketData({ data, status: "done", error: null });
    } catch (error) {
      setMarketData({ data: [], status: "error", error });
    }
  };

  useEffect(() => {
    if (marketData.status === "idle") {
      fetchMarketData();
    }
  }, []);

  useEffect(() => {
    if (marketData.status === "done" && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return; // Check if the context is available

      const fildata = filterData(true, marketData.data, selectedOption);

      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Destroy the previous chart instance
      }

      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: fildata.map((coin, ind) => ({
            label: coin.name,
            data: coin.data.map((item) => ({
              x: item[0],
              y: item[1],
            })),
            fill: false,
            borderColor: colors[ind],
            backgroundColor: colors[ind],
            borderWidth: 2,
            pointRadius: 0,
          })),
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: selectedOption === "24h" ? "hour" : "day",
              },
              title: {
                display: true,
                text: selectedOption === "24h" ? "Date (hrs)" : "Date (day)",
              },
              beginAtZero: false,
              grid: {
                display: false,
              },
            },
            y: {
              title: {
                display: true,
                text: "Price in USD",
              },
              beginAtZero: false,
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Global Market Cap",
            },
            legend: {
              display: true,
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
        },
      });
    }
  }, [marketData, selectedOption]);

  return (
    <div className="w-full">
      <canvas ref={chartRef} />
      <div className="flex justify-center items-center gap-2 mt-2">
        {["24h", "7d", "30d", "3m"].map((option) => (
          <button
            key={option}
            onClick={() => setSelectedOption(option)}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedOption === option
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LineChart;
