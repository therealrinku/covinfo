import React, { useEffect, useState } from "react";
import { FaGlobeAsia, GrSearch, VscReply, BiCalendar } from "react-icons/all";
import Moment from "moment";
import "./SearchSection.css";

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  currentCountryName,
  selectedCountry,
  setSelectedCountry,
}) => {
  const [fullData, setFullData] = useState([]);
  const filteredFullData = fullData.filter((e) => {
    return e.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase() || "undefined");
  });

  useEffect(() => {
    fetch("https://restcountries.eu/rest/v2/all")
      .then((res) => res.json())
      .then((data) => {
        setFullData(data);
      });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setSearchQuery("");
      setSelectedCountry(searchQuery);
    }
  };

  return (
    <div className="search_section">
      <form className="search_form" onSubmit={handleFormSubmit}>
        <input
          className="search_input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for country"
        />
        <button type="submit" className="search_input_button">
          <GrSearch />
        </button>
      </form>

      <section
        className="country_recommendation_box"
        style={filteredFullData.length <= 0 ? { display: "none" } : null}
      >
        {filteredFullData.map((e) => {
          return (
            <button
              className="country_layer"
              key={e.name}
              onClick={() => {
                setSelectedCountry(e.name.toLowerCase());
                setSearchQuery("");
              }}
            >
              <img src={e.flag} alt="flag_icon" />
              <p>{e.name}</p>
            </button>
          );
        })}
      </section>

      <div className="top_info_bar">
        <button className="global_fetch_button">
          <FaGlobeAsia />
          <p>{currentCountryName || "Global"}</p>
        </button>

        <button
          className="global_fetch_button"
          onClick={() => setSelectedCountry("")}
          style={selectedCountry === "" ? { display: "none" } : null}
        >
          <VscReply />
          <p>Fetch Global data</p>
        </button>

        <button className="global_fetch_button">
          <BiCalendar />
          <p>{Moment(new Date()).format("LL")}</p>
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
