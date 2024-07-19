import MarketChart from "@/components/MarketChart";
import TrendingCoins from "@/components/TrendingCoins";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center border-2 border-gray-200 bg-gray-50 rounded-md mx-2 p-4">
        <MarketChart />
      </div>
      <div className="flex mt-4 justify-center items-center border-2 border-gray-200 bg-gray-50 rounded-md mx-2 p-4">
        <TrendingCoins />
      </div>
    </main>
  );
}
