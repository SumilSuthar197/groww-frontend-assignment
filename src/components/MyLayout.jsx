import React from "react";
import Header from "./Header";
import LineChart from "./LineChart";
import RecentlyViewed from "./RecentlyViewed";

const MyLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-3 px-1">
        <div className="col-span-2">{children}</div>
        <div className="col-span-1 flex flex-col gap-2 pr-4">
          <div className="flex justify-center items-center border-2 border-gray-200 bg-gray-50 rounded-md p-3">
            <RecentlyViewed />
          </div>
          <div className="flex justify-center items-center border-2 border-gray-200 bg-gray-50 rounded-md p-3">
            <RecentlyViewed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLayout;
