import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <BestSeller />
      <NewsLetter />
    </div>
  );
};

export default Home;
