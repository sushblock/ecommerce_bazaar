import React from "react";
import "../styles/Home.css";
import Product from "../components/Product";
import productsData from "../assets/products.json";
import banner from "../assets/shopping_banner.avif"

function Home() {
  return (
    
      
    <div className="home">
      
      <div className="home__container">
        <img
          className="home__image"
          src={banner}
          alt="self sufficient food"
        />

        <div className="home__row">
        {productsData.products.map((product) => (
            <Product
              key={product.id}
              id={String(product.id)}
              title={product.title}
              price={product.price}
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
