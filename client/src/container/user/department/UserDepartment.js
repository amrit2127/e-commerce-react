import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserDepartment() {
  const [departments, setDepartments] = useState(null);
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
        "http://localhost:9995/department?universityId=" + queryParams.get("id"),
        config
      )
      .then((response) => {
        setDepartments(response.data.departData);
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching departments:", error);
      });
  }

  function renderDepartments() {
    return departments?.map((item) => (
      <div className="col-3" key={item._id}>
        <div className="card">
          <img
            className="card-img-top"
            src={"http://localhost:9995/" + item.image}
            alt="department"
          />
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <button
              onClick={() => {
                navigate(ROUTES.product.name + "?id=" + item._id);
              }}
              className="btn btn-primary"
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <Header />
      <div className="row m-2">{renderDepartments()}</div>
    </div>
  );
}

export default UserDepartment;
