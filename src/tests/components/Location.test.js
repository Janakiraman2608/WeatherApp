import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import axios from "axios";
import Location from "../../components/Location";

// Mocking axios
jest.mock("axios");

// Mocking the geolocation API
beforeAll(() => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      success({
        coords: {
          latitude: 51.1,
          longitude: 45.3,
        },
      })
    ),
  };
});

const mockWeatherDataOpenWeatherMap = {
  main: { temp: 25 },
  name: "Salem",
  weather: [{ description: "clear sky" }],
};

const mockWeatherDataWeatherbit = {
  temp: 26,
  city_name: "Salem",
  weather: { description: "clear sky" },
};

describe("Location component", () => {
  test("renders the component and fetches location", async () => {
    axios.get.mockResolvedValueOnce({ data: mockWeatherDataOpenWeatherMap });

    act(() => {
      render(<Location />);
    });

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Weather in/i)).toHaveTextContent(
        "Weather in Salem"
      );
      expect(screen.getByText(/Temperature:/i)).toHaveTextContent("25 °C");
      expect(screen.getByText(/Weather:/i)).toHaveTextContent("clear sky");
    });
  });

  test("toggles between Celsius and Fahrenheit", async () => {
    axios.get.mockResolvedValueOnce({ data: mockWeatherDataOpenWeatherMap });

    render(<Location />);

    // Wait for weather data
    await waitFor(() => screen.getByText(/Temperature:/i));

    // Check initial unit
    const tempElement = screen.getByText(/Temperature:/i);
    expect(tempElement).toHaveTextContent("25 °C");

    // Toggle to Fahrenheit
    const toggleButton = screen.getByText(/Switch to Fahrenheit/i);
    act(() => {
      fireEvent.click(toggleButton);
    });

    // Check updated unit
    await waitFor(() => {
      expect(tempElement).toHaveTextContent("77.00 °F");
    });

    // Toggle back to Celsius
    act(() => {
      fireEvent.click(toggleButton);
    });
    await waitFor(() => {
      expect(tempElement).toHaveTextContent("25 °C");
    });
  });

  test("toggles between OpenWeatherMap and Weatherbit API", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockWeatherDataOpenWeatherMap })
      .mockResolvedValueOnce({ data: { data: [mockWeatherDataWeatherbit] } })
      .mockResolvedValueOnce({ data: mockWeatherDataOpenWeatherMap });

    render(<Location />);

    // Wait for initial weather data
    await waitFor(() => {
      expect(
        screen.getByText(/Weather data from OpenWeatherMap/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Weather in Salem/i)).toBeInTheDocument();
      expect(screen.getByText(/Temperature:/i)).toHaveTextContent("25 °C");
      expect(screen.getByText(/Weather:/i)).toHaveTextContent("clear sky");
    });

    // Toggle API source
    const toggleApiButton = screen.getByText(/Switch to Weatherbit/i);
    act(() => {
      fireEvent.click(toggleApiButton);
    });

    // Wait for weather data from Weatherbit
    await waitFor(() => {
      expect(
        screen.getByText(/Weather data from Weatherbit/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Weather in Salem/i)).toBeInTheDocument();
      expect(screen.getByText(/Temperature:/i)).toHaveTextContent("26 °C");
      expect(screen.getByText(/Weather:/i)).toHaveTextContent("clear sky");
    });

    const toggleApiButton2 = screen.getByText(/Switch to OpenWeatherMap/i);

    // Toggle API source back to OpenWeatherMap
    act(() => {
      fireEvent.click(toggleApiButton2);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Weather data from OpenWeatherMap/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Weather in Salem/i)).toBeInTheDocument();
      expect(screen.getByText(/Temperature:/i)).toHaveTextContent("25 °C");
      expect(screen.getByText(/Weather:/i)).toHaveTextContent("clear sky");
    });
  });
});
