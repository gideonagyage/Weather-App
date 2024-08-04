import WeatherApp from "./WeatherApp";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';


function App() {
  return (
    <div className="App">
      <div id="bg-img"></div>
      <div className="overlay">
        <WeatherApp />
      </div>
    </div>
  );
}

export default App;
