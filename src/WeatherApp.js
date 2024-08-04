import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faCloudRain,
  faSnowflake,
  faBolt,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faXTwitter,
  faFacebook,
  faGithub,
  faBehance,
} from "@fortawesome/free-brands-svg-icons";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const apiKey = process.env.REACT_APP_API_KEY;

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const fetchWeatherData = async () => {
    if (city.trim() === "") {
      // Show modal if city is empty
      setShowModal(true);
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        setCity(city);
        throw new Error("Please enter a valid city name.");
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
      setShowModal(false);
    } catch (error) {
      setError(error.message);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        console.log("Failed to fetch weather data, aka from geolocation");
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
      setShowModal(false);
    } catch (error) {
      // Handle geolocation errors specifically
      if (error.code === error.PERMISSION_DENIED) {
        setLocationError(
          "Please allow location access or enter a city manually."
        );
        setShowModal(true); // Show modal on error
      } else {
        setLocationError("Error getting location. Please try again later.");
        setShowModal(true); // Show modal on error
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get user's location on component mount
    const fetchLocationWeather = async () => {
      setLoading(true);
      setLocationError(null);

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data, aka from fetchLoc");
        }

        const data = await response.json();
        setWeatherData(data);
        setError(null);
        setShowModal(false); // Hide modal on successful fetch
      } catch (error) {
        // Handle geolocation errors specifically
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Please allow location access or enter a city manually."
          );
          setShowModal(true); // Show modal on error
        } else {
          setLocationError("Error getting location. Please try again later.");
          setShowModal(true); // Show modal on error
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocationWeather();
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeatherData();
    }
  }, []);

  // Function to get the appropriate weather icon
  const getWeatherIcon = () => {
    if (weatherData && weatherData.weather) {
      const weatherDescription = weatherData.weather[0].description;
      if (weatherDescription.includes("clear sky")) {
        return faSun;
      } else if (
        weatherDescription.includes("clouds") ||
        weatherDescription.includes("overcast")
      ) {
        return faCloud;
      } else if (weatherDescription.includes("rain")) {
        return faCloudRain;
      } else if (weatherDescription.includes("thunderstorm")) {
        return faBolt;
      } else if (weatherDescription.includes("snow")) {
        return faSnowflake;
      } else if (weatherDescription.includes("wind")) {
        return faWind;
      } else {
        return faCloud;
      }
    } else {
      return faCloud;
    }
  };

  return (
    <div className="container mt-3 d-flex flex-column justify-content-center align-items-center">
      <h3 className="text-center m-4">Weather App</h3>
      <div className="row justify-content-center flex-row">
        <div className="col">
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-5 border-white shadow"
              placeholder="Enter city name"
              value={city}
              onChange={handleInputChange}
            />
          </div>
          <div className="text-center mt-3 row gap-3">
            <div>
              <button
                className="btn col mx-2 fw-medium btn-get-weather shadow"
                onClick={fetchWeatherData}
                disabled={city.trim() === ""}
                title="Type city name and press Get Weather"
              >
                Get Weather
              </button>

              <button
                className="btn col mx-2 fw-medium btn-use-location shadow"
                onClick={handleGeolocation}
              >
                Use Current Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for alerts */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body className="text-black text-center fs-4 fw-semibold pt-3">
          {error ? error : locationError}
        </Modal.Body>
        <div className="text-center">
          <Button
            variant="danger"
            className="rounded-4 px-3 mb-3 btn-close-pop"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </div>
      </Modal>

      {loading && (
        <div className="spinner-container text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {weatherData && (
        <div className="main-card-bg row justify-content-center align-items-center mt-3 shadow">
          <div className="col text-center">
            <FontAwesomeIcon
              icon={getWeatherIcon()}
              size="2x"
              className="weather-icon mb-2"
            />
            <h4 className="text-center fw-bold mb-3">
              {weatherData.name}, {weatherData.sys.country}
            </h4>
            <div className="my-2">
              <span className="text-center d-block fw-bold">Temperature:</span>
              <span className="text-center fs-1 fw-bold ">
                {weatherData.main.temp}°C
              </span>
            </div>

            <div className="my-2">
              <span className="text-center d-block fw-bold">Humidity:</span>
              <span className="text-center">{weatherData.main.humidity}%</span>
            </div>

            <div className="my-2">
              <span className="text-center d-block fw-bold">Weather:</span>
              <span className="text-center text-capitalize">
                {weatherData.weather[0].description}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="col text-start card-bg mt-3 mb-4 shadow">
        <a
          href="https://linkedin.com/in/gideonagyage"
          className="text-decoration-none mx-2 txt-white"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
        <a
          href="https://x.com/gideon_agyage"
          className="text-decoration-none mx-2 txt-white"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faXTwitter} size="lg" />
        </a>
        <a
          href="https://facebook.com/gideonagyage"
          className="text-decoration-none mx-2 txt-white"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faFacebook} size="lg" />
        </a>
        <a
          href="https://github.com/gideonagyage"
          className="text-decoration-none mx-2 txt-white"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faGithub} size="lg" />
        </a>
        <a
          href="https://behance.net/gideonagyage"
          className="text-decoration-none mx-2 txt-white"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faBehance} size="lg" />
        </a>
      </div>
    </div>
  );
}

export default WeatherApp;
