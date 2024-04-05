import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Product() {
  const queryParams = useQuery();
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [productId, setProductId] = useState(null);
  const [departmentId, setDepartmentId] = useState(queryParams.get("id"));

  const [form, setForm] = useState({
    name: "",
    images: null,
    departmentId: queryParams.get("id"),
    description: "",
    quantity: "10",
    price: "",
  });

  const [formError, setFormError] = useState({
    name: "",
    images: null,
    description: "",
    quantity: "",
    price: "",
  });

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
      .then((d) => {
        setProducts(d.data.productData);
      });
  }

  function renderProducts() {
    return products?.map((item) => {
      return (
        <tr key={item._id}>
          <td>
            <img
              src={"http://localhost:9995/" + item.images[0]}
              height="150"
              width="150"
              alt={item.name}
            />
          </td>
          <td>{item.name}</td>
          <td>
            <button className="btn btn-success">ProductDetails</button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteProducts(item._id);
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                setProductId(item._id);
                setForm({
                  ...form,
                  name: item.name,
                  description: item.description,
                  quantity: item.quantity,
                  price: item.price,
                });
              }}
            >
              <i className="fa fa-edit"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function resetForm() {
    setForm({
      name: "",
      images: null,
      description: "",
      price: 0,
      quantity: 10,
    });
  }

  function saveProducts() {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const formData = new FormData();
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i], form.images[i].name);
      }
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("quantity", form.quantity);
      formData.append("price", form.price);
      formData.append("departmentId", form.departmentId);

      axios
        .post("http://localhost:9995/products", formData, config)
        .then((d) => {
          alert("Data Saved Successfully");
          getAll();
          resetForm();
        });
    } catch (error) {
      alert("Unable to save the data");
    }
  }

  function updateProducts() {
    debugger
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const formData = new FormData();
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i], form.images[i].name);
      }
      formData.append("_id", productId);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("quantity", form.quantity);
      formData.append("price", form.price);
      formData.append("departmentId", departmentId);

      axios
        .put("http://localhost:9995/products", formData, config)
        .then((d) => {
          alert("Data Updated Successfully");
          getAll();
          resetForm();
        });
    } catch (error) {
      alert("Unable to update the data");
    }
  }

  function onProductSubmit() {
    let errors = false;
    let error = {
      name: "",
      images: "",
      description: "",
      quantity: "",
      price: "",
    };

    if (form.name.trim().length === 0) {
      errors = true;
      error = { ...error, name: "Please enter name !!!!" };
    }

    if (form.images === null) {
      errors = true;
      error = { ...error, images: "Please enter images !!!!" };
    }

    if (form.description === "") {
      errors = true;
      error = { ...error, description: "Please enter description !!!!" };
    }

    if (form.quantity === "" || form.quantity === 0) {
      errors = true;
      error = { ...error, quantity: "Please enter quantity !!!!" };
    }

    if (form.price === "" || form.price === 0) {
      errors = true;
      error = { ...error, price: "Please enter price !!!!" };
    }

    if (errors) setFormError(error);
    else {
      setFormError(error);
      productId ? updateProducts() : saveProducts();
    }
  }

  function deleteProducts(id) {
    // Use SweetAlert to confirm the deletion
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the products?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicks "Yes," proceed with deletion
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: { _id: id },
        };

        axios
          .delete("http://localhost:9995/products", config)
          .then(() => {
            // Successful deletion
            getAll();
            Swal.fire("Deleted!", "product has been deleted.", "success");
          })
          .catch((error) => {
            // Handle error and display with SweetAlert
            Swal.fire(
              "Error",
              error.response?.data?.message || "An error occurred",
              "error"
            );
          });
      }
    });
  }

  return (
    <div>
      <Header />
      <div className="row m-2 p-2">
        <div class="card text-center mx-auto">
          <div class="card-header bg-info text-white">
            {productId ? "Edit Product" : "New Product"}
          </div>

          <div class="card-body">
            <div className="form-group row">
              <label className="col-lg-4">Department</label>
              <div className="col-lg-8">
                <input
                  type="text"
                  className="form-control"
                  value={queryParams.get("name")}
                  disabled
                />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-lg-4" htmlFor="txtName">
                Name
              </label>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="name"
                  id="txtName"
                  className="form-control"
                  placeholder="Enter Name"
                  onChange={changeHandler}
                  value={form.name}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-lg-4" htmlFor="txtDescription">
                Description
              </label>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="description"
                  id="txtDescription"
                  className="form-control"
                  placeholder="description"
                  onChange={changeHandler}
                  value={form.description}
                />
                <p className="text-danger">{formError.description}</p>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-lg-4" htmlFor="txtQuantity">
                Quantity
              </label>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="quantity"
                  id="txtQuantity"
                  className="form-control"
                  placeholder="quantity"
                  onChange={changeHandler}
                  value={form.quantity}
                />
                <p className="text-danger">{formError.quantity}</p>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-lg-4" htmlFor="txtPrice">
                Price
              </label>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="price"
                  id="txtPrice"
                  className="form-control"
                  placeholder="price"
                  value={form.price}
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.price}</p>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-lg-4" htmlFor="txtImage">
                Product Image
              </label>
              <div className="col-lg-8">
                <input
                  type="file"
                  onChange={(e) => {
                    let files = e.target.files;
                    setForm({ ...form, images: files });
                  }}
                  id="txtImage"
                  className="form-control"
                />
                <p className="text-danger">{formError.images}</p>
              </div>
            </div>
          </div>

          <div class="card-footer text-muted">
            {productId ? (
              <button
                className="btn btn-info"
                onClick={() => {
                  onProductSubmit();
                }}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-info"
                onClick={() => {
                  onProductSubmit();
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border m-2 p-2">
        <table className="table table-striped table bordered">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>ProductDetails</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{renderProducts()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Product;
