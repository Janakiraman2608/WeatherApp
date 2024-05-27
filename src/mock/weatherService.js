import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import OWMData from "./data/openWeatherMap.json";
import WBData from "./data/weatherBit.json";

// Create an instance of axios-mock-adapter
const mock = new MockAdapter(axios);

// Define the mock response for OpenWeatherMap data
mock.onGet("/openWeatherMap").reply(200, {
  data: OWMData,
});

// Define the mock response for Weatherbit data
mock.onGet("/weatherBit").reply(200, {
  data: WBData,
});

export default mock