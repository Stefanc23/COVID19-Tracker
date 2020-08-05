import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import Selector from "./Selector";
import InfoBox from "./InfoBox";
import Table from "./Table";
import LineGraph from "./LineGraph";
import Map from "./Map";
import { sortData } from "./utils";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [casesType, setCasesType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.00746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    const getWorldwideData = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then(res => res.json())
        .then(data => setCountryInfo(data));
    };
    getWorldwideData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(res => res.json())
        .then(data => {
          setCountries(
            data.map(country => ({
              name: country.country,
              value: country.countryInfo.iso2,
            }))
          );
          setTableData(sortData(data, casesType));
          setMapCountries(data);
        });
    };
    getCountriesData();
    const interval = setInterval(() => {
      getCountriesData();
    }, 60000);
    return () => clearInterval(interval);
  }, [casesType]);

  const onCountryChange = value => {
    const countryCode = value;
    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        countryCode === "Worldwide"
          ? setMapCenter(setMapCenter({ lat: 34.00746, lng: -40.4796 }))
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "Worldwide" ? setMapZoom(2) : setMapZoom(5);
      });
  };

  const onCaseTypeChange = caseType => {
    setCasesType(caseType);
    setTableData(prevData => sortData(prevData, caseType));
    console.log({ country: countryInfo });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <Selector
            data={[{ name: "Worldwide", value: "Worldwide" }, ...countries]}
            value={country}
            label={"Select a country"}
            onChange={onCountryChange}
          />
        </div>
        <div className="app__stats">
          <InfoBox
            active={casesType === "cases"}
            onClick={e => onCaseTypeChange("cases")}
            title="Confirmed"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => onCaseTypeChange("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            active={casesType === "deaths"}
            onClick={e => onCaseTypeChange("deaths")}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Most {casesType} by country</h3>
            <Table
              countries={tableData}
              casesType={casesType}
              onClick={onCountryChange}
            />
            <h3>
              {country} {casesType} graph
            </h3>
            <LineGraph
              classes={{ graph: "app__graph" }}
              country={country}
              casesType={casesType}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
