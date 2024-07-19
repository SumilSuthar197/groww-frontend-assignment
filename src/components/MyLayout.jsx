import React from "react";
import Header from "./Header";
import RecentlyViewed from "./RecentlyViewed";
import WatchList from "./WatchList";

const MyLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 px-4 lg:px-1">
        <div className="col-span-3 lg:col-span-2 lg:px-2">{children}</div>
        <div className="col-span-3 lg:col-span-1 flex flex-col gap-2 lg:pr-4">
          <RecentlyViewed />
          <div className="flex justify-center items-center border-2 border-gray-200 bg-gray-50 rounded-md p-3">
            <WatchList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLayout;
