class ВиджетПогоды extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.fetchWeatherData();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Arial', sans-serif;
        }

        #инфо-погоды {
          background-color: #3498db;
          color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          padding: 20px;
          text-align: center;
          overflow-x: auto;
        }

        h1 {
          color: #f39c12;
          font-size: 24px;
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          color: #333; /* Цвет текста */
        }

        th {
          background-color: #2c3e50;
          color: #fff;
        }

        td {
          background-color: #ecf0f1;
        }
      </style>
      <div id="инфо-погоды">
        <h1>Информация о погоде</h1>
        <table>
          <tr>
            <th>Параметр</th>
            <th>Значение</th>
          </tr>
          <tr>
            <td>Температура</td>
            <td id="температура"></td>
          </tr>
          <tr>
            <td>Ощущается как</td>
            <td id="ощущается-как"></td>
          </tr>
          <tr>
            <td>Условия</td>
            <td id="условия"></td>
          </tr>
          <tr>
            <td>Восход солнца</td>
            <td id="восход"></td>
          </tr>
          <tr>
            <td>Заход солнца</td>
            <td id="заход"></td>
          </tr>
          <tr>
            <td>Осадки</td>
            <td id="осадки"></td>
          </tr>
          <tr>
            <td>Скорость ветра</td>
            <td id="ветер"></td>
          </tr>
          <tr>
            <td>Давление</td>
            <td id="давление"></td>
          </tr>
          <tr>
            <td>Влажность</td>
            <td id="влажность"></td>
          </tr>
          <tr>
            <td>Видимость</td>
            <td id="видимость"></td>
          </tr>
          <tr>
            <td>Облачность</td>
            <td id="облачность"></td>
          </tr>
          <tr>
            <td>Снег</td>
            <td id="снег"></td>
          </tr>
          <tr>
            <td>Направление ветра</td>
            <td id="направление-ветра"></td>
          </tr>
        </table>
      </div>
    `;
  }
  fetchWeatherData() {
    const apiKey = "dd5f3a82b623c4a7d261ad991ba50c73";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=${apiKey}`;

    const realApiUrl = apiUrl
      .replace("{lat}", "55.7522")
      .replace("{lon}", "37.6156");

    fetch(realApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Сетевой ответ не был успешным");
        }
        return response.json();
      })
      .then((data) => {
        const temperatureK = data.main.temp;
        const feelsLikeK = data.main.feels_like;

        // Преобразование температуры из Кельвинов в Цельсии
        const temperatureC = (temperatureK - 273.15).toFixed(1);
        const feelsLikeC = (feelsLikeK - 273.15).toFixed(1);

        this.shadowRoot.getElementById(
          "температура"
        ).innerText = `Температура: ${temperatureC}°C`;
        this.shadowRoot.getElementById(
          "ощущается-как"
        ).innerText = `Ощущается как: ${feelsLikeC}°C`;
        this.shadowRoot.getElementById("условия").innerText = `Условия: ${data.weather[0].description}`;
        this.shadowRoot.getElementById("восход").innerText = `Восход солнца: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
        this.shadowRoot.getElementById("заход").innerText = `Заход солнца: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
        this.shadowRoot.getElementById("осадки").innerText = `Осадки: ${data.weather[0].main === "Rain" || data.weather[0].main === "Snow" ? "Да" : "Нет"}`;
        this.shadowRoot.getElementById("ветер").innerText = `Скорость ветра: ${data.wind.speed} м/с`;
        this.shadowRoot.getElementById("давление").innerText = `Давление: ${data.main.pressure} гПа`;
        this.shadowRoot.getElementById("влажность").innerText = `Влажность: ${data.main.humidity}%`;
        this.shadowRoot.getElementById("видимость").innerText = `Видимость: ${data.visibility} метров`;
        this.shadowRoot.getElementById("облачность").innerText = `Облачность: ${data.clouds.all}%`;
        this.shadowRoot.getElementById("снег").innerText = `Снег: ${data.snow ? `${data.snow["1h"]} мм` : "N/A"}`;
        this.shadowRoot.getElementById("направление-ветра").innerText = `Направление ветра: ${data.wind.deg}°`;
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о погоде:", error);
      });
  }
}

customElements.define("weather-widget", ВиджетПогоды);
