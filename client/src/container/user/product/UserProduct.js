import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserProduct() {
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();
  const queryParams = useQuery();

  useEffect(() => {
    getAll();
  }, []);

  function getAll() {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios
      .get(
        "http://localhost:9995/products?departmentId=" + queryParams.get("id"),
        config
      )
      .then((response) => {
        setProducts(response.data.productData);
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching products:", error);
      });
  }

  function renderProducts() {
    return products?.map((item) => (
      <div className="col-3" key={item._id}>
        <div className="card">
          <img
            src={"http://localhost:9995/" + item.images[0]}
            height="150"
            width="150"
            alt="product"
          />
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <button
              onClick={() => {
                navigate(ROUTES.productDetails.name + "?id=" + item._id);
              }}
              className="btn btn-primary"
            >
              View Product Details
            </button>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <Header />
      <div className="row m-2">{renderProducts()}</div>
    </div>
  );
}

export default UserProduct;
