import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function ProductDetails() {
  const [productDetails, setProductDetails] = useState(null);
  const navigate = useNavigate();
  const queryParams = useQuery();

  const [form, setForm] = useState({
    user: localStorage.getItem("id"),
    product: queryParams.get("id"),
    count: 1,
  });

  const [formError, setFormError] = useState({
    count: "",
  });

  useEffect(() => {
    getProductDetails();
  }, []);

  function getProductDetails() {
    axios
      .get("http://localhost:9995/productsDetails?id=" + queryParams.get("id"))
      .then((d) => {
        setProductDetails(d.data.productData);
      });
  }
  function incrementCount() {
    setForm((prevState) => ({
      ...prevState,
      count: prevState.count ? parseInt(prevState.count, 10) + 1 : 1,
    }));
  }
  
  function decrementCount() {
    setForm((prevState) => ({
      ...prevState,
      count: prevState.count > 1 ? parseInt(prevState.count, 10) - 1 : 1,
    }));
  }
 
  const changeHandler = (e) => {
  setForm({ ...form, count: e.target.value });
};

  function onCartSubmit() {
    axios
      .post("http://localhost:9995/cart", form)
      .then((response) => {
        // Handle success
        alert("Product Successfully added in the cart !!!!!");
        navigate(ROUTES.cart.name);
      })
      .catch((error) => {
        // Handle error
        console.error("Error adding to cart:", error);
      });
  }

  function renderImages() {
    return productDetails?.images?.map((item) => {
      return (
        <img
          className="card-img-top"
          src={"http://localhost:9995/" + item}
          height="400px"
          width="150px"
        />
      );
    });
  }

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="card text-center">
          <div className="card-header bg-info text-white">Product Details</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="text-center">{renderImages()}</div>
              </div>
              <div className="col-md-6">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <b>Product Name</b>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      value={productDetails?.name}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <b>Product Description</b>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      value={productDetails?.description}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <b>Product Price</b>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      value={productDetails?.price}
                      disabled
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <b>Count</b>
                  </div>
                  <div className="col-md-8">
                  <button onClick={decrementCount} className="btn btn-secondary m-2 p-1">-</button>
                       <input
                         type="text"                         
                         onChange={changeHandler}
                         value={form.count}
                       />
                  <button onClick={incrementCount} className="btn btn-secondary m-2 p-1">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer text-white">
            <div className="form-group row">
              <div className="col-6">
                <button
                  onClick={() => navigate(ROUTES.home.name)}
                  className="btn btn-primary"
                >
                  Back To Home
                </button>
              </div>
              <div className="col-6">
                <button onClick={onCartSubmit} className="btn btn-primary">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
 


