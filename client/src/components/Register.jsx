import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

// Actions
import { setAlert } from "../actions/alert";
import { removeAlert } from "../actions/alert";
import { register } from "../actions/auth";

import Spinner from "./Spinner.jsx";
import Alert from "./Alert.js";

import styles from "./css/Register.module.css";

import HidePassword from "../assets/hide-password.svg";
import ShowPassword from "../assets/show-password.svg";
import Karolina from "../assets/karolina-grabowska.jpg";

const Register = (props) => {
  const [formData, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2, address, phone } = formData;

  const onChange = (e) => {
    // e.preventDefault();
    setForm({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    let passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }

    let togglePassword = document.getElementById("togglePassword");
    if (togglePassword.src.match(HidePassword)) {
      togglePassword.src = ShowPassword;
    } else {
      togglePassword.src = HidePassword;
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    let confirmPasswordInput = document.getElementById("confirm-password");

    if (confirmPasswordInput.type === "password") {
      confirmPasswordInput.type = "text";
    } else {
      confirmPasswordInput.type = "password";
    }

    let toggleConfirmPassword = document.getElementById(
      "toggleConfirmPassword"
    );
    if (toggleConfirmPassword.src.match(HidePassword)) {
      toggleConfirmPassword.src = ShowPassword;
    } else {
      toggleConfirmPassword.src = HidePassword;
    }
  };

  const setAler = () => {
    for (let idx = 0; idx < props.alerts.length; idx++) {
      const alert = props.alerts[idx];

      if (alert.msg === "Invalid name") {
        let nameInput = document.getElementById("name");
        let nameLabel = document.getElementById("name-label");
        nameInput.className = styles["alert-box"];
        nameLabel.className = styles["alert-label"];
      }

      if (alert.msg === "Invalid email") {
        let emailInput = document.getElementById("email");
        let emailLabel = document.getElementById("email-label");
        emailInput.className = styles["alert-box"];
        emailLabel.className = styles["alert-label"];
      }

      if (alert.msg === "Enter valid password with min length of 6 char") {
        let passwordInput = document.getElementById("password");
        let passwordLabel = document.getElementById("password-label");
        passwordInput.className = styles["alert-box"];
        passwordLabel.className = styles["alert-label"];
      }
    }
  };

  setAler();

  const removeAler = () => {
    let nameInput = document.getElementById("name");
    let nameLabel = document.getElementById("name-label");
    let emailInput = document.getElementById("email");
    let emailLabel = document.getElementById("email-label");
    let passwordInput = document.getElementById("password");
    let passwordLabel = document.getElementById("password-label");
    let cPInput = document.getElementById("confirm-password");
    let cPLabel = document.getElementById("confirm-password-label");

    if (nameInput && nameInput.className === styles["alert-box"])
      nameInput.className = styles["form-control"];
    if (nameLabel && nameLabel.className === styles["alert-label"])
      nameLabel.className = "";

    if (emailInput && emailInput.className === styles["alert-box"])
      emailInput.className = styles["form-control"];
    if (emailLabel && emailLabel.className === styles["alert-label"])
      emailLabel.className = "";

    if (passwordInput && passwordInput.className === styles["alert-box"])
      passwordInput.className = styles["form-control"];
    if (passwordLabel && passwordLabel.className === styles["alert-label"])
      passwordLabel.className = "";

    if (cPInput && cPInput.className === styles["alert-box"])
      cPInput.className = styles["form-control"];
    if (cPLabel && cPLabel.className === styles["alert-label"])
      cPLabel.className = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAler();
    if (password !== password2) {
      let cPInput = document.getElementById("confirm-password");
      let cPLabel = document.getElementById("confirm-password-label");
      cPInput.className = styles["alert-box"];
      cPLabel.className = styles["alert-label"];

      props.setAlert("Passwords do not match", "error");
    } else {
      props.register({ name, email, password, address, phone });
    }
    setTimeout(removeAler, 3500);
  };

  // If already auth, redirect to dashboard
  if (props.isAuth) {
    return <Navigate to="/" />;
  }

  return props.loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className={styles["container"]}>
        <div className={styles["sign-up-container"]}>
          <h2 className={styles["logo"]}>Auction🔨</h2>
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <div className={styles["form-group"]}>
              <h2 className={styles["text-center-h2"]}>Let's Get Started!</h2>
              {/* <p className={styles["text-center-p"]}>Let's get started.</p> */}
              <label id="name-label">Name</label>
              <br />
              <input
                id="name"
                type="text"
                name="name"
                value={name}
                placeholder="Enter your Name"
                className={styles["form-control"]}
                onChange={(e) => {
                  onChange(e);
                }}
              />
              <br />
              <label id="email-label">Email</label>
              <br />
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                className={styles["form-control"]}
                onChange={(e) => {
                  onChange(e);
                }}
              />
              <br />
              <label>Address</label>
              <br />
              <input
                type="text"
                name="address"
                value={address}
                placeholder="Enter your Address"
                className={styles["form-control"]}
                onChange={(e) => {
                  onChange(e);
                }}
              />
              <br />
              <label>Phone Number</label>
              <br />
              <input
                type="text"
                name="phone"
                value={phone}
                placeholder="Enter your Phone Number"
                pattern="[0-9]{10}"
                maxLength={10}
                className={styles["form-control"]}
                onChange={(e) => {
                  onChange(e);
                }}
              />
              <br />
              <label id="password-label">Password</label>
              <div className={styles["form-password"]}>
                <input
                  id="password"
                  type="password"
                  name="password"
                  minLength="6"
                  value={password}
                  placeholder="••••••••"
                  className={styles["form-control"]}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                <img
                  src={HidePassword}
                  //   width="3%"
                  //   height="5%"
                  id="togglePassword"
                  className={styles["toggle-password"]}
                  onClick={togglePasswordVisibility}
                ></img>
              </div>
              <label id="confirm-password-label">Confirm Password</label>
              <div className={styles["form-password"]}>
                <input
                  id="confirm-password"
                  type="password"
                  name="password2"
                  minLength="6"
                  value={password2}
                  placeholder="••••••••"
                  className={styles["form-control"]}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                <img
                  src={HidePassword}
                  //   width="3%"
                  //   height="5%"
                  id="toggleConfirmPassword"
                  className={styles["toggle-password"]}
                  onClick={toggleConfirmPasswordVisibility}
                ></img>
              </div>
              <br />
              <button type="submit" className={styles["signup-button"]}>
                Sign Up
              </button>
            </div>
          </form>
          <div className={styles["signin-container"]}>
            <p className={styles["signin-text-1"]}>Already have an account?</p>
            <Link to="/login" className={styles["signin-text-2"]}>
              Sign in
            </Link>
          </div>
        </div>
        <div className={styles["img-container"]}>
          <img src={Karolina} alt="Sign Up Image" />
        </div>
      </div>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuth: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated,
  loading: state.auth.loading,
  alerts: state.alert,
});

export default connect(mapStateToProps, { setAlert, removeAlert, register })(
  Register
);
