import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import Loader from "./Loader";
import Selector from "./Selector";
import InfoBox from "./InfoBox";
import Table from "./Table";
import LineGraph from "./LineGraph";
import Map from "./Map";
import News from "./News";
import { sortData } from "./utils";
import {
  coronaIcon,
  infectedIcon,
  patientIcon,
  deathIcon,
  worldwideIcon,
} from "./Icons";
import numeral from "numeral";
import "./App.css";
import "leaflet/dist/leaflet.css";

const classes = {
  loader: "app__loader",
  graph: "app__graph",
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [worldwideInfo, setWorldwideInfo] = useState({});
  const [countryInfo, setCountryInfo] = useState({});
  const [casesType, setCasesType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.00746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    const getWorldwideData = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then(res => res.json())
        .then(data => {
          setWorldwideInfo(data);
          setCountryInfo(data);
          setCasesType("cases");
        });
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
      setLoaded(true);
    }, 2000);
    return () => clearInterval(interval);
  }, [casesType]);

  const onCountryChange = async value => {
    const countryCode = value;
    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
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
      {!loaded ? (
        <Loader classes={classes} />
      ) : (
        <>
          <div className="app__top">
            <div className="app__left">
              <div className="app__header">
                <div className="app__title">
                  <img
                    className="app__logo"
                    src={coronaIcon}
                    alt="COVID-19 Tracker icon"
                  />
                  <h2 className="app__name">
                    <span style={{ color: "#cc1034" }}>COVID-19</span>{" "}
                    <span style={{ color: "#6c757d" }}>Tracker</span>
                  </h2>
                </div>
                <Selector
                  data={[
                    { name: "Worldwide", value: "Worldwide" },
                    ...countries,
                  ]}
                  value={country}
                  label={"Select a country"}
                  onChange={onCountryChange}
                />
              </div>
              <div className="app__stats">
                <InfoBox
                  icon={infectedIcon}
                  active={casesType === "cases"}
                  onClick={e => onCaseTypeChange("cases")}
                  title="Confirmed"
                  cases={countryInfo.todayCases}
                  total={countryInfo.cases}
                />
                <InfoBox
                  icon={patientIcon}
                  active={casesType === "recovered"}
                  onClick={e => onCaseTypeChange("recovered")}
                  title="Recovered"
                  cases={countryInfo.todayRecovered}
                  total={countryInfo.recovered}
                />
                <InfoBox
                  icon={deathIcon}
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
                  <div className="app__infoHeader">
                    <h3>Most {casesType} by country</h3>
                    <Card
                      className="app__worldwideInfo"
                      onClick={() => onCountryChange("Worldwide")}
                    >
                      <span>
                        <img src={worldwideIcon} alt="worldwide" />
                        Worldwide
                      </span>
                      {numeral(worldwideInfo[casesType]).format()}
                    </Card>
                  </div>
                  <Table
                    worldwide={worldwideInfo}
                    countries={tableData}
                    casesType={casesType}
                    onClick={onCountryChange}
                  />
                  <h3>
                    {country} {casesType} graph
                  </h3>
                  <LineGraph
                    classes={classes}
                    country={country}
                    casesType={casesType}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="app__middle">
            <Card>
              <CardContent>
                <h2>News Feed</h2>
                <News countryInfo={countryInfo} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
