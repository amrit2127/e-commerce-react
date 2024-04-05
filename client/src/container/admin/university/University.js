import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "font-awesome/css/font-awesome.min.css";
import ROUTES from "../../../navigations/Routes";

function University() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState(null);
  const [form, setForm] = useState({ name: "", image: null });
  const [formError, setFormError] = useState({ name: "", image: "" });
  const [UniversityId, setUniversityId] = useState(null);

  useEffect(() => {
    getAll();
  }, []);

  function getAll() {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get("http://localhost:9995/university", config)
      .then((response) => {
        setUniversities(response.data.univData);
      })
      .catch((error) => {
        console.error("Error fetching universities:", error);
      });
  }

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function renderUniversities() {
    return universities?.map((item) => {
      return (
        <tr key={item._id}>
          <td>
            <img src={"http://localhost:9995/" + item.image} height="150" width="150" alt={item.name} />
          </td>
          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-success"
              onClick={() => {
                navigate(
                  ROUTES.departmentAdmin.name +
                    "?id=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              <i className="fa fa-plus">&nbsp;&nbsp;</i>
              Add Department
            </button>
          </td>
          <td>
            <button className="btn btn-danger" onClick={() => deleteUniversity(item._id)}>
              <i className="fa fa-trash"></i>
            </button>
          </td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                setUniversityId(item._id);
                setForm({ ...form, name: item.name });
              }}
            >
              <i className="fa fa-edit"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  function saveUniversities() {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);

      axios.post("http://localhost:9995/university", formData, config).then((d) => {
        // Display SweetAlert success dialog
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data Saved Successfully",
        }).then(() => {
          getAll();
          resetForm();
        });
      });
    } catch (error) {
      // If an error occurs, log it
      console.log("Failed to submit data");
    }
  }

  function updateUniversities() {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const formData = new FormData();
      formData.append("_id", UniversityId);
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);

      axios.put("http://localhost:9995/university", formData, config).then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data Updated Successfully",
        }).then(() => {
          getAll();
          resetForm();
        });
      });
    } catch (error) {
      console.log("Failed to update the data");
    }
  }

  function onUniversitySubmit() {
    let errors = false;
    let error = { name: "", image: "" };

    if (form.name.trim().length === 0) {
      errors = true;
      error = { ...error, name: "Please enter name !!!!" };
    }

    if (form.image === null) {
      errors = true;
      error = { ...error, image: "Please select an image !!!!" };
    }
    if (errors) {
      setFormError(error);
    } else {
      setFormError(error);
      UniversityId ? updateUniversities() : saveUniversities();
    }
  }

  function deleteUniversity(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the university?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { _id: id },
        };
        axios
          .delete("http://localhost:9995/university", config)
          .then(() => {
            getAll();
            Swal.fire("Deleted!", "University has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire("Error", error.response?.data?.message || "An error occurred", "error");
          });
      }
    });
  }

  function resetForm() {
    setForm({ name: "", image: "" });
  }

  return (
    <div>
      <Header />
      <div className="row m-2 p-2">
        <div className="card text-center mx-auto">
          <div className="card-header bg-info text-white">{UniversityId ? "Edit University" : "New University"}</div>

          <div className="card-body">
            <div className="form-group row">
              <label className="col-lg-4" htmlFor="txtName">
                University Name
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
              <label className="col-lg-4" htmlFor="txtImage">
                University Image
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

          <div className="card-footer text-muted">
            {UniversityId ? (
              <button className="btn btn-info" onClick={onUniversitySubmit}>
                Update
              </button>
            ) : (
              <button className="btn btn-info" onClick={onUniversitySubmit}>
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
              <th>Add Department</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{renderUniversities()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default University;
