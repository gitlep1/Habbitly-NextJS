"use client";

import "./about.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const About = () => {
  const [news, setNews] = useState({});

  const [error, setError] = useState("");

  useEffect(() => {
    getSiteNewsData();
  }, []);

  const getSiteNewsData = async () => {
    return axios
      .get("/api/news")
      .then((res) => {
        setNews(res.data);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  };

  return (
    <div className="min-w-screen h-[90dvh]">
      <div className="text-center">
        <h1 className="about-title">About</h1>
        <p className="text-blue-300">This is the about page</p>
      </div>

      <div className="data-fetch text-center scroll-auto">
        News
        {news.length > 1 ? (
          <div>
            {news.map((siteNews) => (
              <h1 key={siteNews.id}>{siteNews.title}</h1>
            ))}
          </div>
        ) : (
          <p>No News</p>
        )}
      </div>
    </div>
  );
};

export default About;
