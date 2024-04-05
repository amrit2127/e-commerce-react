import About from "../container/about/About";
import Department from "../container/admin/department/Department";
import Product from "../container/admin/product/Product";
import University from "../container/admin/university/University";
import Contact from "../container/contact/Contact";
import Login from "../container/login/Login";
import Register from "../container/register/Register";
import Cart from "../container/user/cart/Cart";
import UserDepartment from "../container/user/department/UserDepartment";
import Home from "../container/user/home/Home";
import UserProduct from "../container/user/product/UserProduct";
import ProductDetails from "../container/user/productDetails/ProductDetails";
import Checkout from "../container/user/cart/Checkout";
import Products from "../container/user/products/Products";


const ROUTES = {
  contact: {
    name: "/contact",
    component: <Contact />,
  },

  about: {
    name: "/about",
    component: <About />,
  },

  register: {
    name: "/register",
    component: <Register />,
  },

  login: {
    name: "/login",
    component: <Login />,
  },

  universityAdmin: {
    name: "/universityAdmin",
    component: <University />,
  },

  departmentAdmin: {
    name: "/departmentAdmin",
    component: <Department />,
  },

  productAdmin: {
    name: "/productAdmin",
    component: <Product />,
  },

  home: {
    name: "/",
    component: <Home />,
  },

  department: {
    name: "/department",
    component: <UserDepartment />,
  },

  product: {
    name: "/product",
    component: <UserProduct />,
  },

  productDetails: {
    name: "/productDetails",
    component: <ProductDetails />,
  },
  cart: {
    name: "/cart",
    component: <Cart />,
  },
  checkout:{
    name:"/checkout",
    component:<Checkout/>
  }  ,
  products:{
    name:"/products",
    component:<Products/>
  }
};
export default ROUTES;
