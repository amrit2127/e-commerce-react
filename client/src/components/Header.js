import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../navigations/Routes";

function Header() {
  const [user, setUser] = useState({ id: null, role: null });
  const navigate = useNavigate();

  useEffect(() => {
    let id = localStorage.getItem("id");
    let role = localStorage.getItem("role");
    if (id) setUser({ id: id, role: role });
  }, []);

  function renderMenu() {
    if (user?.role === "admin") {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to={ROUTES.universityAdmin.name}>
              University Management
            </Link>
          </li>

          <li className="nav-item active">
            <Link className="nav-link" to={ROUTES.home.name}>
              User Management
            </Link>
          </li>

          <li className="nav-item active">
            <Link className="nav-link" to={ROUTES.contact.name}>
              Contact
            </Link>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to={ROUTES.home.name}>
              Home
            </Link>
          </li>

          <li className="nav-item active">
            <Link className="nav-link" to={ROUTES.about.name}>
              About
            </Link>
          </li>

          <li className="nav-item active">
            <Link className="nav-link" to={ROUTES.contact.name}>
              Contact
            </Link>
          </li>
         <li className="nav-item active">
           <Link className="nav-link" to={user?.id ? ROUTES.cart.name : ROUTES.login.name}>
           <img width="30" height="30"
            src="https://img.icons8.com/ios-glyphs/30/shopping-cart--v1.png"
             alt="shopping-cart--v1"/>
           </Link>
         </li>
        </ul>
      );
    }
  }


  function renderButtons() {
    if (user?.id) {
      return (
        <div>
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            onClick={() => {
              localStorage.clear();
              navigate(ROUTES.login.name);
            }}
          >
            LogOut
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <Link
            to={ROUTES.register.name}
            className="btn btn-outline-success my-2 my-sm-0"
          >
            Register
          </Link>

          <Link
            to={ROUTES.login.name}
            className="btn btn-outline-success my-2 my-sm-0"
          >
            Login
          </Link>
        </div>
      );
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* <Link className="navbar-brand" to={ROUTES.home.name}>
        Your Logo/Title
      </Link> */}

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {renderMenu()}
        {renderButtons()}
      </div>
    </nav>
  );
}

export default Header;
