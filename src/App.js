import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import LineGraph from "./LineGraph";
import Map from "./Map";
import { sortData } from "./utils";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
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
    getWorldwideData();
    getCountriesData();
    const interval = setInterval(() => {
      getWorldwideData();
      getCountriesData();
    }, 60000);
    return () => clearInterval(interval);
  }, [casesType]);

  const onCountryChange = async event => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter(setMapCenter({ lat: 34.00746, lng: -40.4796 }))
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide" ? setMapZoom(2) : setMapZoom(5);
      });
  };

  const onCaseTypeChange = caseType => {
    setCasesType(caseType);
    setTableData(prevData => sortData(prevData, caseType));
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
            <Table countries={tableData} casesType={casesType} />
            <h3>Worldwide {casesType} graph</h3>
            <LineGraph
              classes={{ graph: "app__graph" }}
              casesType={casesType}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
