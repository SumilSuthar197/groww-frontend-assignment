export default function filterData(isMulti, data, time) {
  let now = new Date().getTime();

  if (time === "24h") {
    now -= 24 * 60 * 60 * 1000;
  } else if (time === "7d") {
    now -= 7 * 24 * 60 * 60 * 1000;
  } else if (time === "30d") {
    now -= 30 * 24 * 60 * 60 * 1000;
  } else if (time === "3m") {
    now -= 90 * 24 * 60 * 60 * 1000;
  } else {
    now -= 24 * 60 * 60 * 1000;
  }
  if (isMulti) {
    const filteredData = data.map((coin) => {
      return {
        ...coin,
        data: coin.data.filter((price) => new Date(price[0]) >= new Date(now)),
      };
    });
    return filteredData;
  } else {
    const filteredData = data.filter(
      (price) => new Date(price[0]) >= new Date(now)
    );
    return filteredData;
  }
}
