import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Fragment } from "react";

import Spinner from "./Spinner";
import Nav from "./Nav";

// Actions
import { postAd } from "../actions/ad";
import { setAlert, clearAlerts } from "../actions/alert";

import styles from "./css/AdForm.module.css";
import Footer from "./Footer";

const AdForm = (props) => {
  const [form, setForm] = useState({
    productName: "",
    category: "",
    basePrice: 0,
    description: "",
    images: [],
    startTime: new Date(),
    endTime: new Date(),
    duration: 0,
  });

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imgs, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imgPaths, setImgPaths] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    return () => {
      props.clearAlerts();
    };
  }, []);

  const handleFormChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleImageOnChange = (e) => {
    let inp = document.getElementById(e.target.id);
    inp.parentElement.children[0].textContent = e.target.files[0].name;

    let file = e.target.files[0];
    setImages(
      imgs.concat({
        name: file.name,
        file: file,
      })
    );
  };

  const removeAlerts = () => {
    let pLabel = document.getElementById("productLabel");
    let pInp = document.getElementById("productInput");
    pLabel.style.color = "#696969";
    pInp.style.border = "2px solid #c9c9c6";

    let cInp = document.getElementById("categoryInput");
    let cLabel = document.getElementById("categoryLabel");
    cLabel.style.color = "#696969";
    cInp.style.border = "2px solid #c9c9c6";

    let bInp = document.getElementById("basePriceInput");
    let bLabel = document.getElementById("basePriceLabel");
    bLabel.style.color = "#696969";
    bInp.style.border = "2px solid #c9c9c6";

    let dInp = document.getElementById("descInput");
    let dLabel = document.getElementById("descLabel");
    dLabel.style.color = "#696969";
    dInp.style.border = "2px solid #c9c9c6";

    let imgLabel = document.getElementById("imgLabel");
    imgLabel.style.color = "#696969";

    let imgContainers = document.getElementsByClassName("img-upload");
    for (let i = 0; i < imgContainers.length; i++) {
      imgContainers[i].style.border = "2px dashed #c9c9c6";
    }

    let startDateLabel = document.getElementById("startDateLabel");
    startDateLabel.style.color = "#696969";

    let startTimeLabel = document.getElementById("startTimeLabel");
    startTimeLabel.style.color = "#696969";

    let startDateInput = document.getElementById("startDate");
    startDateInput.style.border = "2px solid #c9c9c6";

    let startTimeInput = document.getElementById("startTime");
    startTimeInput.style.border = "2px solid #c9c9c6";

    let endDateLabel = document.getElementById("endDateLabel");
    endDateLabel.style.color = "#696969";

    let endTimeLabel = document.getElementById("endTimeLabel");
    endTimeLabel.style.color = "#696969";

    let endDateInput = document.getElementById("endDate");
    endDateInput.style.border = "2px solid #c9c9c6";

    let endTimeInput = document.getElementById("endTime");
    endTimeInput.style.border = "2px solid #c9c9c6";

    let uImgDiv = document.getElementById("upload-images");
    uImgDiv.children.item(2).style.color = "#9f9f9d";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.productName === "") {
      let pLabel = document.getElementById("productLabel");
      let pInp = document.getElementById("productInput");
      pLabel.style.color = "#df501c";
      pInp.style.border = "2px solid #df501c";
    }

    if (form.category === "") {
      let cInp = document.getElementById("categoryInput");
      let cLabel = document.getElementById("categoryLabel");
      cLabel.style.color = "#df501c";
      cInp.style.border = "2px solid #df501c";
    }

    if (form.basePrice === 0) {
      let bInp = document.getElementById("basePriceInput");
      let bLabel = document.getElementById("basePriceLabel");
      bLabel.style.color = "#df501c";
      bInp.style.border = "2px solid #df501c";
    }

    if (form.description === "") {
      let dInp = document.getElementById("descInput");
      let dLabel = document.getElementById("descLabel");
      dLabel.style.color = "#df501c";
      dInp.style.border = "2px solid #df501c";
    }

    if (imgs.length != 4) {
      let imgLabel = document.getElementById("imgLabel");
      imgLabel.style.color = "#df501c";

      let imgContainers = document.getElementsByClassName("img-upload");
      for (let i = 0; i < imgContainers.length; i++) {
        imgContainers[i].style.border = "2px dashed #df501c";
      }
    }

    if (startDate === "" || startTime === "") {
      let startDateLabel = document.getElementById("startDateLabel");
      startDateLabel.style.color = "#df501c";

      let startTimeLabel = document.getElementById("startTimeLabel");
      startTimeLabel.style.color = "#df501c";

      let startDateInput = document.getElementById("startDate");
      startDateInput.style.border = "2px solid #df501c";

      let startTimeInput = document.getElementById("startTime");
      startTimeInput.style.border = "2px solid #df501c";
    }

    if (endDate === "" || endTime === "") {
      let endDateLabel = document.getElementById("endDateLabel");
      endDateLabel.style.color = "#df501c";

      let endTimeLabel = document.getElementById("endTimeLabel");
      endTimeLabel.style.color = "#df501c";

      let endDateInput = document.getElementById("endDate");
      endDateInput.style.border = "2px solid #df501c";

      let endTimeInput = document.getElementById("endTime");
      endTimeInput.style.border = "2px solid #df501c";
    }

    if (imgs.length != 4) {
      let uImgDiv = document.getElementById("upload-images");
      uImgDiv.children.item(2).style.color = "#df501c";
    }

    if (
      form.productName === "" ||
      form.category === "" ||
      form.basePrice === 0 ||
      form.description === "" ||
      imgs.length !== 4 ||
      startDate === "" ||
      startTime === "" ||
      endDate === "" ||
      endTime === "" ||
      imgs.length !== 4
    )
      setTimeout(removeAlerts, 3000);
    else {
      await Promise.all(
        imgs.map(async (img) => {
          const formData = new FormData();
          formData.append("image", img.file);

          const res = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/upload/image`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          return res.data.imagePath;
        })
      ).then(async (res) => {
        console.log(
          Math.abs(
            new Date(startDate + "T" + startTime) -
              new Date(endDate + "T" + endTime)
          )
        );
        await props.postAd({
          ...form,
          images: res,
          startTime: startDate + "T" + startTime,
          endTime: endDate + "T" + endTime,
          duration:
            Math.abs(
              new Date(startDate + "T" + startTime) -
                new Date(endDate + "T" + endTime)
            ) / 1000,
        });
        navigate("/");
        console.log("st",startTime);
        console.log("et",endTime);
      });
    }
  };

  // Check if user is logged
  if (!props.isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <Fragment>
      <Nav/>
      <div
        style={{
          width: "100vw",
          height: "92.8vh",
          backgroundColor: "#F5F6FA",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#fff",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              width: "45%",
              height: "100%",
            }}
          >
            <h2
              style={{
                fontFamily: "GilroyBold",
                fontSize: "2rem",
              }}
            >
              Post Ad
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
              }}
            >
              <label className={styles["form-control-label"]} id="productLabel">
                Product Name
              </label>
              <input
                id="productInput"
                type="text"
                className={styles["form-control"]}
                name="productName"
                required={true}
                pattern="[a-zA-Z]+"
                placeholder="Enter the name of the product"
                maxLength={25}
                style={{
                  fontFamily: "GilroyLight",
                  fontSize: ".9rem",
                }}
                onChange={(e) => handleFormChange(e)}
              />
              <p
                style={{
                  fontFamily: "GilroyLight",
                  fontSize: ".9rem",
                  color: "#9f9f9d",
                  margin: "0",
                  marginTop: "5px",
                }}
              >
                Do not exceed 25 characters when entering the product name.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
              }}
            >
              <label
                className={styles["form-control-label"]}
                id="categoryLabel"
              >
                Category
              </label>
              <input
                id="categoryInput"
                type="text"
                className={styles["form-control"]}
                name="category"
                pattern="[a-zA-Z]+"
                placeholder="Enter the category of the product"
                style={{
                  marginBottom: "5px",
                  fontFamily: "GilroyLight",
                  fontSize: ".9rem",
                }}
                onChange={(e) => handleFormChange(e)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
              }}
            >
              <label
                id="basePriceLabel"
                className={styles["form-control-label"]}
              >
                Base Price
              </label>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <input
                  id="basePriceInput"
                  type="number"
                  min={0}
                  className={styles["form-control"]}
                  name="basePrice"
                  placeholder="Auction will start from this price"
                  style={{
                    marginBottom: "5px",
                    fontFamily: "GilroyLight",
                    fontSize: ".9rem",
                    width: "87%",
                  }}
                  onChange={(e) => handleFormChange(e)}
                />
                <div
                  style={{
                    width: "10%",
                    height: "40px",
                    border: "2px solid #c9c9c6",
                    borderRadius: "8px",
                    textAlign: "center",
                    marginTop: "3px",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "GilroyBlack",
                      fontWeight: "800",
                      color: "#696969",
                      margin: "0",
                      marginTop: "3px",
                    }}
                  >
                    ₹
                  </h4>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
              }}
            >
              <label className={styles["form-control-label"]} id="descLabel">
                Description
              </label>
              <textarea
                id="descInput"
                name="description"
                maxLength={450}
                onChange={(e) => handleFormChange(e)}
                className={styles["form-control-textarea"]}
              ></textarea>
              <p
                style={{
                  fontFamily: "GilroyLight",
                  fontSize: ".9rem",
                  color: "#9f9f9d",
                  margin: "0",
                  marginTop: "5px",
                }}
              >
                Do not exceed 450 characters when entering the description.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-around",
              width: "55%",
              // backgroundColor: "#000",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "45%",
              }}
            >
              <div
                id="upload-images"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                }}
              >
                <label className={styles["form-control-label"]} id="imgLabel">
                  Product Image
                </label>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: ".5rem 0",
                  }}
                >
                  <label
                    htmlFor="file1"
                    className={`img-upload ${styles["custom-file-upload"]}`}
                  >
                    <div>
                      <p>
                        <i className="fa fa-cloud-upload"></i> Upload Image
                      </p>
                      <input
                        type="file"
                        name="img1"
                        id="file1"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageOnChange(e);
                        }}
                      />
                    </div>
                  </label>
                  <label
                    htmlFor="file2"
                    className={`img-upload ${styles["custom-file-upload"]}`}
                  >
                    <div>
                      <p>
                        <i className="fa fa-cloud-upload"></i> Upload Image
                      </p>
                      <input
                        type="file"
                        name="img2"
                        id="file2"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageOnChange(e);
                        }}
                      />
                    </div>
                  </label>
                  <div
                    style={{
                      width: "33%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="file3"
                      className={`img-upload ${styles["custom-file-upload"]}`}
                      style={{
                        height: "47%",
                        width: "100%",
                      }}
                    >
                      <div>
                        <p>
                          <i className="fa fa-cloud-upload"></i> Upload Image
                        </p>
                        <input
                          type="file"
                          name="img3"
                          id="file3"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageOnChange(e);
                          }}
                        />
                      </div>
                    </label>
                    <label
                      htmlFor="file4"
                      className={`img-upload ${styles["custom-file-upload"]}`}
                      style={{
                        height: "47%",
                        width: "100%",
                      }}
                    >
                      <div>
                        <p>
                          <i className="fa fa-cloud-upload"></i> Upload Image
                        </p>
                        <input
                          type="file"
                          name="img4"
                          id="file4"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageOnChange(e);
                          }}
                        />
                      </div>
                    </label>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "GilroyLight",
                    fontSize: ".9rem",
                    color: "#9f9f9d",
                    margin: "0",
                    marginTop: "5px",
                  }}
                >
                  You need to upload atleast 4 images of the product to post an
                  ad. Pay attention to quality of the images.
                </p>
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "45%",
                  }}
                >
                  <label
                    className={styles["form-control-label"]}
                    id="startDateLabel"
                  >
                    Auction Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    className={styles["form-control"]}
                    style={{
                      fontFamily: "GilroyLight",
                      fontSize: ".9rem",
                    }}
                    onChange={(e) => handleStartDateChange(e)}
                  />
                </div>
                <div
                  style={{
                    width: "45%",
                  }}
                >
                  <label
                    className={styles["form-control-label"]}
                    id="startTimeLabel"
                  >
                    Auction Start Time
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    // value="00:00:00"
                    step={1}
                    className={styles["form-control"]}
                    // style={{ width: "95%" }}
                    onChange={(e) => handleStartTimeChange(e)}
                  />
                </div>
              </div>
              <p
                style={{
                  fontFamily: "GilroyLight",
                  fontSize: ".9rem",
                  color: "#9f9f9d",
                  margin: "0",
                  marginTop: "5px",
                }}
              >
                Auction will start at this date and time.
              </p>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "45%",
                  }}
                >
                  <label
                    className={styles["form-control-label"]}
                    id="endDateLabel"
                  >
                    Auction End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className={styles["form-control"]}
                    style={{
                      fontFamily: "GilroyLight",
                      fontSize: ".9rem",
                    }}
                    onChange={(e) => handleEndDateChange(e)}
                  />
                </div>
                <div
                  style={{
                    width: "45%",
                  }}
                >
                  <label
                    className={styles["form-control-label"]}
                    id="endTimeLabel"
                  >
                    Auction End Time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    // value="00:00:00"
                    step={1}
                    className={styles["form-control"]}
                    // style={{ width: "95%" }}
                    onChange={(e) => handleEndTimeChange(e)}
                  />
                </div>
              </div>

              <p
                style={{
                  fontFamily: "GilroyLight",
                  fontSize: ".9rem",
                  color: "#9f9f9d",
                  margin: "0",
                  marginTop: "5px",
                }}
              >
                Auction will start at this date and time.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <button
                className={`${styles["form-control-btn"]} ${styles["add-btn"]}`}
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                Add Product
              </button>
              <button
                className={`${styles["form-control-btn"]} ${styles["cancel-btn"]}`}
                onClick={() => {
                  // navigate to /
                  navigate("/");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuth: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { postAd, setAlert, clearAlerts })(
  AdForm
);