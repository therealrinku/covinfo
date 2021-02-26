import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Moment from "moment";
import "./App.css";
import SearchSection from "../Components/SearchSection/SearchSection";
import TodaySummary from "../Components/TodaySummary/TodaySummary";
import { MdErrorOutline } from "react-icons/md";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [casesHistoryData, setCasesHistoryData] = useState([]);
  const [recoveredHistoryData, setRecoveredHistoryData] = useState([]);
  const [deathsHistoryData, setdeathsHistoryData] = useState([]);

  useEffect(() => {
    const globalDataFetchingUrl = `https://disease.sh/v3/covid-19/all`;
    const countryDataFetchingUrl = `https://disease.sh/v3/covid-19/countries/${selectedCountry}`;

    fetch(selectedCountry ? countryDataFetchingUrl : globalDataFetchingUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) {
          console.log(data);
          setData(data);
        } else {
          setError(data.message);

          setTimeout(() => {
            setError("");
          }, 3000);
        }
      });

    const historicalDataCountrySpecificURL = `https://disease.sh/v3/covid-19/historical/${selectedCountry}`;
    const historicalDataWorldSpecificURL = `https://disease.sh/v3/covid-19/historical/all`;

    fetch(
      selectedCountry !== ""
        ? historicalDataCountrySpecificURL
        : historicalDataWorldSpecificURL
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.timeline) {
          setCasesHistoryData(data.timeline.cases);
          setRecoveredHistoryData(data.timeline.recovered);
          setdeathsHistoryData(data.timeline.deaths);
        } else if (data.cases) {
          setCasesHistoryData(data.cases);
          setRecoveredHistoryData(data.recovered);
          setdeathsHistoryData(data.deaths);
        }
      });
  }, [selectedCountry]);

  let lineLabelData = [];
  for (let e in casesHistoryData) {
    lineLabelData.push(Moment(e).format("ll"));
  }

  let caseNumData = [];
  for (let e in casesHistoryData) {
    caseNumData.push(casesHistoryData[e]);
  }

  let casesDailyTollData = [].filter((e) => {
    return e !== undefined;
  });
  for (let e in caseNumData) {
    casesDailyTollData.push(caseNumData[e] - caseNumData[e - 1]);
  }

  //new
  let deathsNumData = [];
  for (let e in deathsHistoryData) {
    deathsNumData.push(deathsHistoryData[e]);
  }

  let deathsDailyTollData = [].filter((e) => {
    return e !== undefined;
  });
  for (let e in deathsNumData) {
    deathsDailyTollData.push(deathsNumData[e] - deathsNumData[e - 1]);
  }

  //
  let recoveredNumData = [];
  for (let e in recoveredHistoryData) {
    recoveredNumData.push(recoveredHistoryData[e]);
  }

  let recoveredDailyTollData = [].filter((e) => {
    return e !== undefined;
  });
  for (let e in recoveredNumData) {
    recoveredDailyTollData.push(recoveredNumData[e] - recoveredNumData[e - 1]);
  }

  const lineData = {
    labels: lineLabelData.slice(-7),
    yLabels: [0, 5000, 10000, 50000, 100000],
    datasets: [
      {
        label: "Infected",
        data: casesDailyTollData.slice(-7),
        borderColor: "#0f7173",
      },
      {
        label: "Recovered",
        data: recoveredDailyTollData.slice(-7),
        borderColor: "#09814a",
      },
      {
        label: "Deaths",
        data: deathsDailyTollData.slice(-7),
        borderColor: "#f05d5e",
      },
    ],
  };

  return (
    <div className="app">
      <br />

      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentCountryName={data.country}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        error={error}
      />

      <TodaySummary
        todayCases={data.todayCases}
        todayDeaths={data.todayDeaths}
        todayRecovered={data.todayRecovered}
        error={error}
      />

      <div className="line">
        <p>Last 7 days info</p>
        <p style={{ color: "red" }}>{error}</p>
        <Line
          data={lineData}
          options={{
            scales: {
              xAxes: [
                {
                  display: false, //this will remove all the x-axis grid lines
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  var tooltipValue =
                    data.datasets[tooltipItem.datasetIndex].data[
                      tooltipItem.index
                    ];
                  return parseInt(tooltipValue).toLocaleString();
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default App;
