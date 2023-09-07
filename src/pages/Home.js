import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Product from "../components/Product";
import productsData from "../assets/products_data.json"; // Assuming you've imported the new JSON data format
import banner from "../assets/shopping_banner.avif";

function Home() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(productsData.products.map((product) => product.category))
    );
    setFilteredCategories(uniqueCategories);

    const uniqueManufacturers = Array.from(
      new Set(productsData.products.map((product) => product.manufacturer))
    );
    setFilteredManufacturers(uniqueManufacturers);
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategoryFilter(selectedCategory);

    if (selectedCategory !== "all") {
      const filteredManufacturers = productsData.products
        .filter((product) => product.category === selectedCategory)
        .map((product) => product.manufacturer);
      setFilteredManufacturers(Array.from(new Set(filteredManufacturers)));
    } else {
      setFilteredManufacturers(
        Array.from(
          new Set(productsData.products.map((product) => product.manufacturer))
        )
      );
    }
  };

  const handleManufacturerChange = (event) => {
    const selectedManufacturer = event.target.value;
    setManufacturerFilter(selectedManufacturer);

    if (selectedManufacturer !== "all") {
      const filteredCategories = productsData.products
        .filter((product) => product.manufacturer === selectedManufacturer)
        .map((product) => product.category);
      setFilteredCategories(Array.from(new Set(filteredCategories)));
    } else {
      setFilteredCategories(
        Array.from(
          new Set(productsData.products.map((product) => product.category))
        )
      );
    }
  };

  const filteredProducts = productsData.products.filter((product) => {
    if (categoryFilter === "all" && manufacturerFilter === "all") {
      return true;
    }
    if (categoryFilter === "all") {
      return product.manufacturer === manufacturerFilter;
    }
    if (manufacturerFilter === "all") {
      return product.category === categoryFilter;
    }
    return product.category === categoryFilter && product.manufacturer === manufacturerFilter;
  });

  return (
    <div className="home">
      <div className="home__container">
        <img className="home__image" src={banner} alt="DevotionDepot" />

        <div className="home__filter">
          <h4 htmlFor="category" className="home_label_width">
            Category:
          </h4>
          <select
            id="category"
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="home_filter_width"
          >
            <option value="all">All</option>
            {filteredCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="home__filter">
          <h4 htmlFor="manufacturer" className="home_label_width">
            Manufacturer:
          </h4>
          <select
            id="manufacturer"
            value={manufacturerFilter}
            onChange={handleManufacturerChange}
            className="home_filter_width"
          >
            <option value="all">All</option>
            {filteredManufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </div>

        <div className="home__row">
          {filteredProducts.map((product) => (
            <Product
              key={product.id}
              id={String(product.id)}
              title={product.title}
              price={product.price}
              rating={product.rating}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
