// index.js
const Mustache = require("mustache");
const fs = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";

require("dotenv").config();

/**
 * DATA is the object that contains all
 * the data to be provided to Mustache
 * Notice the "name" and "date" property.
 */
let DATA = {
  name: "Eric",
  refresh_date: new Date().toLocaleDateString("zh-CN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "Asia/Shanghai",
  }),
};
/**
 * A - We open 'main.mustache'
 * B - We ask Mustache to render our file with the data
 * C - We create a README.md file with the generated output
 */
function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

// 获取天气信息
async function setWeatherInformation() {
  await fetch(
    `https://devapi.qweather.com/v7/weather/now?location=101020100&key=${process.env.OPEN_WEATHER_MAP_KEY}`
  )
    .then((r) => r.json())
    .then((r) => {
      const { temp, text, feelsLike } = r.now;
      DATA.city_temperature = temp; // 温度
      DATA.feelsLike = feelsLike; // 体感温度
      DATA.city_weather = text; // 天气描述
    });
}

const init = async () => {
  await setWeatherInformation();
  generateReadMe();
};
init();
