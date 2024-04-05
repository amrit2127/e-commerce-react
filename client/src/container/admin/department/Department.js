import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "font-awesome/css/font-awesome.min.css";
import ROUTES from "../../../navigations/Routes";
import toastr from "toastr";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Department() {
  const queryParams = useQuery();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    image: null,
    universityId: queryParams.get("id"),
  });
  const [formError, setFormError] = useState({ name: "", image: null });

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
      .then((d) => {
        setDepartments(d.data.departData);
        console.log(departments);
      });
  }

  function renderDepartments() {
    return departments?.map((item) => {
      return (
        <tr key={item._id}>
          <td>
            <img
              src={"http://localhost:9995/" + item.image}
              height="150"
              width="150"
              alt={item.name}
            />
          </td>
          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-success"
              onClick={() => {
                navigate(
                  ROUTES.productAdmin.name +
                    "?id=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              <i className="fa fa-plus"></i> Add Product
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteDepartment(item._id);
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
          <td>
            <button
              onClick={() => {
                setDepartmentId(item._id);
                setForm({ ...form, name: item.name });
              }}
              className="btn btn-info"
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
    setForm({ name: "", image: "" });
  }

  function saveDepartments() {
    const token = localStorage.getItem('token');    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId", form.universityId);

      axios
        .post("http://localhost:9995/department", formData, config)
        .then((d) => {
          alert("Data Saved Successfully");
          getAll();
          resetForm();
        });
    } catch (error) {
      console.log("Failed to submit data");
    }
  }

  function updateDepartments() {
    const token = localStorage.getItem('token');    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const formData = new FormData();
      formData.append("id", departmentId);
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("university", form.universityId);

      axios
        .put("http://localhost:9995/department", formData, config)
        .then((d) => {
          alert("Data Updated Successfully");
          getAll();
          resetForm();
        });
    } catch (error) {
      console.log("Failed to update the data");
    }
  }

  function onDepartmentSubmit() {
    let errors = false;
    let error = { name: "", image: "" };

    if (form.name.trim().length === 0) {
      errors = true;
      error = { ...error, name: "Please enter name !!!!" };
    }

    if (form.image === null) {
      errors = true;
      error = { ...error, image: "Please enter image !!!!" };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      departmentId ? updateDepartments() : saveDepartments();
    }
  }

  function deleteDepartment(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the department?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');    
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: { _id: id },
        };

        axios
          .delete("http://localhost:9995/department", config)
          .then(() => {
            getAll();
            Swal.fire("Deleted!", "department has been deleted.", "success");
          })
          .catch((error) => {
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
            {departmentId ? "Edit Department" : "New Department"}
          </div>

          <div class="card-body">
            <div className="form-group row">
              <label className="col-lg-4">University</label>
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
                Department Name
              </label>
              <div className="col-lg-8">
                <input
                  value={form.name}
                  type="text"
                  name="name"
                  id="txtName"
                  className="form-control"
                  placeholder="Enter Name"
                  onChange={changeHandler}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-lg-4" htmlFor="txtImage">
                Department Image
              </label>
              <div className="col-lg-8">
                <input
                  type="file"
                  name="image"
                  id="txtImage"
                  className="form-control"
                  onChange={(e) => {
                    let file = e.target.files[0];
                    setForm({ ...form, image: file });
                  }}
                />
                <p className="text-danger">{formError.image}</p>
              </div>
            </div>
          </div>

          <div class="card-footer text-muted">
            {departmentId ? (
              <button
                className="btn btn-info"
                onClick={onDepartmentSubmit}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-info"
                onClick={onDepartmentSubmit}
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
              <th>Add Product</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{renderDepartments()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Department;
