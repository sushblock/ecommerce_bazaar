import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Product from "../components/Product";
import productsData from "../assets/products.json";
import banner from "../assets/shopping_banner.avif";

function Home() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(productsData.products.map((product) => product.category))
    );
    setFilteredCategories(uniqueCategories);

    const uniqueBrands = Array.from(
      new Set(productsData.products.map((product) => product.brand))
    );
    setFilteredBrands(uniqueBrands);
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategoryFilter(selectedCategory);

    if (selectedCategory !== "all") {
      const filteredBrands = productsData.products
        .filter((product) => product.category === selectedCategory)
        .map((product) => product.brand);
      setFilteredBrands(Array.from(new Set(filteredBrands)));
    } else {
      setFilteredBrands(
        Array.from(
          new Set(productsData.products.map((product) => product.brand))
        )
      );
    }
  };

  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setBrandFilter(selectedBrand);

    if (selectedBrand !== "all") {
      const filteredCategories = productsData.products
        .filter((product) => product.brand === selectedBrand)
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
    if (categoryFilter === "all" && brandFilter === "all") {
      return true;
    }
    if (categoryFilter === "all") {
      return product.brand === brandFilter;
    }
    if (brandFilter === "all") {
      return product.category === categoryFilter;
    }
    return product.category === categoryFilter && product.brand === brandFilter;
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
          <h4 htmlFor="brand" className="home_label_width">
            Brand:
          </h4>
          <select
            id="brand"
            value={brandFilter}
            onChange={handleBrandChange}
            className="home_filter_width"
          >
            <option value="all">All</option>
            {filteredBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
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
              price={product.price * 80}
              rating={product.rating}
              image={product.thumbnail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
