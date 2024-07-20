"use client";
import api from "@/utils/api";
import { set } from "date-fns";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoMoon, IoSunny } from "react-icons/io5";

const ToggleComponent = ({ currentTheme, handleToggle }) => {
  return (
    <>
      <input
        type="checkbox"
        checked={currentTheme === "dark"}
        onChange={handleToggle}
        className="opacity-0 absolute"
        id="checkbox"
      />
      <label
        htmlFor="checkbox"
        className="bg-[#111] w-16 h-8 rounded-full p-1 flex items-center cursor-pointer relative"
      >
        <IoMoon className="text-yellow-400 absolute left-2" size={18} />
        <IoSunny className="text-yellow-500 absolute right-2" size={18} />
        <span
          className={`bg-white w-6 h-6 absolute rounded-full transition-transform duration-200 ease-linear ${
            currentTheme === "dark" ? "translate-x-8" : "translate-x-0"
          }`}
          style={{ top: "4px" }}
        ></span>
      </label>
    </>
  );
};

const Header = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(true);
  const dropdownRef = useRef(null);
  const debouncedSearch = useDebounce(search);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const searchCoin = async () => {
      if (debouncedSearch !== "") {
        try {
          const response = await api.get(`/search?query=${debouncedSearch}`);
          setResults(response.data.coins);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };

    searchCoin();
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="px-3 md:px-4 py-3 w-full dark:bg-gray-900 mb-2 md:mb-3">
      <div className="flex justify-between gap-2 md:gap-0 items-center flex-col md:flex-row">
        <div className="flex justify-between w-full">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Cryptonite
          </h1>
          <div className="flex flex-row gap-2 justify-center items-center">
            <Link
              href="/Explore"
              className="md:hidden bg-blue-600 text-white px-4 py-[6px] rounded-md"
            >
              Explore
            </Link>
            <div className="relative justify-center items-center md:hidden">
              <ToggleComponent
                currentTheme={currentTheme}
                handleToggle={handleToggle}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div
            ref={dropdownRef}
            className="relative flex w-full md:w-96 justify-center items-center rounded-md"
          >
            <IoSearchOutline className="absolute top-3 left-3 text-gray-500 dark:text-slate-100" />
            <input
              type="text"
              placeholder="Search "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full py-2 pl-9 pr-4 text-gray-500 dark:text-slate-100 border rounded-md outline-none bg-gray-50 dark:bg-gray-800 focus:bg-white focus:border-gray-300 dark:focus:border-slate-100"
            />
            {showDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 max-h-52 overflow-y-scroll rounded-md bg-gray-50 dark:bg-gray-800 custom-scrollbar shadow-md">
                {results.map((coin) => (
                  <Link
                    href={`/Coin/${coin.id}`}
                    onClick={() => {
                      setSearch("");
                      setShowDropdown(false);
                    }}
                    key={coin.id}
                  >
                    <div
                      key={coin.id}
                      className="cursor-pointer font-semibold flex justify-start items-center p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <img
                        src={coin.thumb}
                        alt={coin.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span>
                        {coin.name} ({coin.symbol})
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/Explore"
            className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Explore
          </Link>
          <div className="relative justify-center items-center hidden md:flex">
            <ToggleComponent
              currentTheme={currentTheme}
              handleToggle={handleToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function useDebounce(value) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

export default Header;
