import React from "react";
import CommaProvider from "comma-number";
import "./TodaySummary.css";

const TodaySummary = ({ todayCases, todayRecovered, todayDeaths, error }) => {
  return (
    <div className="summary_section">
      <p style={{ color: "red" }}>{error}</p>

      <div className="cards">
        <div className="cases_card card">
          <p>Infected</p>
          <p>{CommaProvider(todayCases)}</p>
        </div>

        <div className="recovered_card card">
          <p>Recovered</p>
          <p>{CommaProvider(todayRecovered)}</p>
        </div>

        <div className="deaths_card card">
          <p>Deaths</p>
          <p>{CommaProvider(todayDeaths)}</p>
        </div>
      </div>
    </div>
  );
};

export default TodaySummary;
