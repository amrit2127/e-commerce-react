import React, { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../navigations/Routes";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function checkUser() {
    try {
      axios
        .post("http://localhost:9995/login", form)
        .then((response) => {
          const { data } = response;        

          if (data.token) {
            // Store the token in localStorage
            localStorage.setItem("token", data.token);            
            localStorage.setItem("id", data.id);
            localStorage.setItem("role", data.role);            
            if (data.role === "admin") navigate(ROUTES.universityAdmin.name);
            else navigate(ROUTES.home.name);
          }
        })
        .catch((error) => {
          alert("Wrong Username/Password");
        });
    } catch (error) {
      alert("Unable to Login the user");
    }
  }

  function onUserSubmit() {
    let errors = false;
    let error = {
      email: "",
      password: "",
    };
    if (form.email.trim().length === 0) {
      errors = true;
      error = { ...error, email: "Enter your registered email-id" };
    }
    if (form.password.trim().length === 0) {
      errors = true;
      error = { ...error, password: "Enter your password" };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      checkUser();
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-header bg-info text-white">Login</div>
              <div className="card-body">
                <div className="form-group row">
                  <label className="col-lg-4 col-form-label">Email-ID</label>
                  <div className="col-lg-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email-id"
                      onChange={changeHandler}
                      name="email"
                    />
                    <p className="text-danger">{formError.email}</p>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-lg-4 col-form-label">Password</label>
                  <div className="col-lg-8">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      onChange={changeHandler}
                      name="password"
                    />
                    <p className="text-danger">{formError.password}</p>
                  </div>
                </div>
              </div>
              <div className="card-footer text-muted">
                <button onClick={onUserSubmit} className="btn btn-primary">
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
