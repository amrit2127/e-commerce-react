import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";


function Home() {
  const [universities, setUniversities] = useState(null);
  const [dataTableData, setDataTableData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAll();
  }, []);

  function getAll() {
    const token = localStorage.getItem('token');
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  
    axios.get("http://localhost:9995/university", config)
      .then((response) => {
        setUniversities(response.data.univData);
        setDataTableData(response.data.univData);
      })
      .catch((error) => {
        console.error('Error fetching universities:', error);
      });
  }

  

  function renderUniversities() {
    return universities?.map((item) => (
      <div className="col-3">
        <div className="card">
          <img
            className="card-img-top"
            src={"http://localhost:9995/" + item.image}
            alt="card image cap"
          />
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <button
              onClick={() => {
                navigate(ROUTES.department.name + "?id=" + item._id);
              }}
              className="btn btn-primary"
            >
              View Department
            </button>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <Header />      

      <div className="row m-2">{renderUniversities()}</div>
    </div>
  );
}

export default Home;

