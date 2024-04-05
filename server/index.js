import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import jwt from "jsonwebtoken"; 
import {
  CreateUniversity,
  GetUniversities,
  deleteUniversity,
  updateUniversity,
} from "./controllers/University.js";
import {
  CreateDepartment,
  GetDepartments,
  GetDepartmentsByUniversityId,
  UpdateDepartment,
  deleteDepartment,
} from "./controllers/Department.js";
import {
  GetProductsByDepartmentId,
  ProductDetails,
  UpdateProduct,
  UpdateProductQty,
  createProduct,
  deleteProduct,
} from "./controllers/Product.js";
import { Login, Register } from "./controllers/User.js";
import { GetCartItems, addToCart, deleteCartItem } from "./controllers/ShoppingCart.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const storageUniv = multer.diskStorage({
  destination: "UploadsUniv/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const UploadsUniv = multer({
  storage: storageUniv,
});

app.post("/university",verifyToken, UploadsUniv.single("image"), CreateUniversity);
app.put("/university",verifyToken, UploadsUniv.single("image"), updateUniversity);
app.delete("/university",verifyToken, deleteUniversity);
app.get("/university",verifyToken, GetUniversities);

const storageDepart = multer.diskStorage({
  destination: "UploadsDepart/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const UploadsDepart = multer({
  storage: storageDepart,
});

app.post("/department",verifyToken, UploadsDepart.single("image"), CreateDepartment);
app.put("/department",verifyToken, UploadsDepart.single("image"), UpdateDepartment);
app.delete("/department",verifyToken, deleteDepartment);
//app.get("/departmentByUniversityId",GetDepartmentsByUniversityId);
app.get("/department",verifyToken,GetDepartmentsByUniversityId);

const storageProduct = multer.diskStorage({
  destination: "UploadsProduct/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const UploadsProduct = multer({
  storage: storageProduct,
});

app.post("/products",verifyToken, UploadsProduct.array("images"), createProduct);
app.put("/products",verifyToken, UploadsProduct.array("images"), UpdateProduct);
app.delete("/products",verifyToken, deleteProduct);

app.get("/products",verifyToken, GetProductsByDepartmentId);
app.get("/productsDetails", ProductDetails);
app.put("/updateProductQty",verifyToken, UpdateProductQty);

app.post("/register", Register);
app.post("/login", Login);
app.post("/cart", addToCart);
app.get("/cart", GetCartItems);
app.delete("/cart",deleteCartItem);

// JWT Token Verification Middleware
const jwtkey = "thisismytokenecommproject";

function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
      jwt.verify(token, jwtkey, (err, valid) => {
        if (err) {
          res.status(401).send({ result: "Please provide valid token" });
        } else {
          next();
        }
      });
    } else {
      res.status(401).send({ result: "Invalid token format" });
    }
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}


// images
app.use(express.static("UploadsUniv/"));
app.use(express.static("UploadsDepart/"));
app.use(express.static("UploadsProduct/"));

mongoose
  .connect(process.env.DB_URL)
  .then((d) => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running at port: " + process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("Database connection error: ", e);
  });
