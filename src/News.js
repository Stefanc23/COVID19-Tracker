import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import { truncate } from "./utils";
import "./News.css";

function News({ countryInfo }) {
  const [feeds, setFeeds] = useState([]);
  const [focusedFeed, setFocusedFeed] = useState("");

  useEffect(() => {
    const getNewsFeeds = async () => {
      await fetch(
        "https://covid-19-news.p.rapidapi.com/v1/covid?sources=theguardian.com%252Cfda.gov%252Cnytimes.com%252Ccnn.com%252Cforbes.com&lang=en&sort_by=date&page_size=40&media=True&q=covid",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "covid-19-news.p.rapidapi.com",
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          },
        }
      )
        .then(res => res.json())
        .then(data => {
          setFeeds(data.articles);
        })
        .catch(err => console.log(err));
    };
    getNewsFeeds();
  }, [countryInfo]);

  const handleHover = (title = "") => {
    setFocusedFeed(title);
  };

  return (
    <div className="news">
      <div className="news__feeds">
        {feeds &&
          feeds.map(
            ({ _id, clean_url, media, link, title, summary }) =>
              media && (
                <Card
                  className={`news__feed ${focusedFeed === title && "focused"}`}
                  onMouseEnter={() => handleHover(title)}
                  onMouseLeave={() => handleHover()}
                  key={_id}
                >
                  <CardContent>
                    <a href={link}>
                      <h5>{clean_url}</h5>
                      <img src={media} alt={title} />
                      <h3>{title}</h3>
                      <p>
                        {truncate(summary, 75)} <a href={link}>see more</a>
                      </p>
                    </a>
                  </CardContent>
                </Card>
              )
          )}
      </div>
    </div>
  );
}

export default News;
