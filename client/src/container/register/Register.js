import React, { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../navigations/Routes";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function saveUser() {
    try {
      axios
        .post("http://localhost:9995/register", form)
        .then((response) => {
          alert(response.data.message);
          navigate(ROUTES.login.name);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            // If the server responded with a status code and error message
            alert(`Server error: ${error.response.data.message}`);
          } else if (error.request) {
            // The request was made but no response was received
            alert("No response received from the server");
          } else {
            // Something happened in setting up the request that triggered an Error
            alert(`Error: ${error.message}`);
          }
        });
    } catch (error) {
      alert("Unable to register data");
    }
  }
  
  
  function onUserSubmit() {
    let errors = false;
    let error = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (form.firstName.trim().length == 0) {
      errors = true;
      error = { ...error, firstName: "Enter your first name" };
    }
    if (form.lastName.trim().length == 0) {
      errors = true;
      error = { ...error, lastName: "Enter your last name" };
    }
    if (form.email.trim().length == 0) {
      errors = true;
      error = { ...error, email: "Enter your email id" };
    }
    if (form.password.trim().length == 0) {
      errors = true;
      error = { ...error, password: "Enter your password" };
    }
    if (form.confirmPassword.trim().length == 0) {
      errors = true;
      error = { ...error, confirmPassword: "Enter your password again" };
    }
    if (form.password != form.confirmPassword) {
      errors = true;
      error = {
        ...error,
        password: "Password and confirm password suppose to be same",
      };
    }
    if (!(form.password.length >= 6 && form.password.length <= 12)) {
      errors = true;
      error = {
        ...error,
        password: "Password length should be between 6 to 12 words",
      };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      saveUser();
    }
  }

  return (
    <div>
      <Header />
      <div className="row m-2">
        <div class="card text-center mx-auto">
          <div class="card-header bg-primary text-white">New User</div>
          <div class="card-body">
            <div className="form-group row">
              <label for="txtName" className="col-sm-4">
                First Name
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your firstName"
                  className="form-control"
                  id="txtName"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.firstName}</p>
              </div>
            </div>

            <div className="form-group row">
              <label for="txtName1" className="col-sm-4">
                Last Name
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your lastName"
                  className="form-control"
                  id="txtName1"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.lastName}</p>
              </div>
            </div>

            <div className="form-group row">
              <label for="txtEmail" className="col-sm-4">
                Email-Id
              </label>
              <div className="col-sm-8">
                <input
                  type="email" //email
                  name="email"
                  placeholder="Enter your Email"
                  className="form-control"
                  id="txtEmail"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.email}</p>
              </div>
            </div>

            <div className="form-group row">
              <label for="txtPassword" className="col-sm-4">
                Password
              </label>
              <div className="col-sm-8">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your Password"
                  className="form-control"
                  id="txtPassword"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.password}</p>
              </div>
            </div>

            <div className="form-group row">
              <label for="txtCPassword" className="col-sm-4">
                Confirm Password
              </label>
              <div className="col-sm-8">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter your Confirm Password"
                  className="form-control"
                  id="txtCPassword"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.confirmPassword}</p>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
            <button onClick={onUserSubmit} className="btn btn-success">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
