import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

// Actions
import { login, skipLogin } from "../actions/auth";
import { setAlert, removeAlert } from "../actions/alert";

import Spinner from "./Spinner.jsx";
import Alert from "./Alert.js";

import styles from "./css/Login.module.css";

import ScottWebb from "../assets/scott-webb.jpg";
import HidePassword from "../assets/hide-password.svg";
import ShowPassword from "../assets/show-password.svg";

const Login = (props) => {
  const [rememberme, setRemberme] = useState(false);
  const [formData, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    // e.preventDefault();
    setForm({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setAler = () => {
    for (let idx = 0; idx < props.alerts.length; idx++) {
      const alert = props.alerts[idx];
      if (alert.msg === "Invalid credentials") {
        let emailInput = document.getElementById("email");
        let emailLabel = document.getElementById("email-label");
        let passwordInput = document.getElementById("password");
        let passwordLabel = document.getElementById("password-label");

        emailInput.className = styles["alert-box"];
        emailLabel.className = styles["alert-label"];
        passwordInput.className = styles["alert-box"];
        passwordLabel.className = styles["alert-label"];
        break;
      }
    }
  };

  setAler();

  const removeAler = () => {
    let emailInput = document.getElementById("email");
    let emailLabel = document.getElementById("email-label");
    let passwordInput = document.getElementById("password");
    let passwordLabel = document.getElementById("password-label");

    if (emailInput && emailInput.className === styles["alert-box"])
      emailInput.className = styles["form-control"];
    if (emailLabel && emailLabel.className === styles["alert-label"])
      emailLabel.className = "";

    if (passwordInput && passwordInput.className === styles["alert-box"])
      passwordInput.className = styles["form-control"];
    if (passwordLabel && passwordLabel.className === styles["alert-label"])
      passwordLabel.className = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    props.login(email, password);

    if (props.alerts.length > 0) setTimeout(removeAler, 4000);
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

  // If already auth, redirect to dashboard
  if (props.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return props.loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className={styles["container"]}>
        <div className={styles["sign-in-container"]}>
          <h2 className={styles["logo"]}>Auction🔨</h2>
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <div className={styles["form-group"]}>
              <h2 className={styles["text-center-h2"]}>Welcome Back Cheif!</h2>
              <p className={styles["text-center-p"]}>
                Enter your details below.
              </p>
              <label id="email-label">Email</label>
              <br />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className={styles["form-control"]}
                value={email}
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
                  placeholder="••••••••"
                  className={styles["form-control"]}
                  minLength="6"
                  value={password}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                <img
                  src={HidePassword}
                  // width="3%"
                  // height="5%"
                  id="togglePassword"
                  className={styles["toggle-password"]}
                  onClick={togglePasswordVisibility}
                ></img>
              </div>
              <div className={styles["form-check"]}>
                <div>
                  <input
                    type="checkbox"
                    className={styles["form-check-input"]}
                    onChange={(e) => setRemberme(e.target.value)}
                  />
                  <label className={styles["form-check-label"]}>
                    Remember me
                  </label>
                </div>
                <a href="#" className={styles["form-check-forgot-password"]}>
                  Forgot password?
                </a>
              </div>
              <button type="submit" className={styles["signin-button"]}>
                Sign In
              </button>
            </div>
          </form>
          <div className={styles["signup-container"]}>
            <p className={styles["signup-text-1"]}>Don't have an account?</p>
            <Link to="/register" className={styles["signup-text-2"]}>
              Sign up
            </Link>
          </div>
        </div>
        <div className={styles["img-container"]}>
          <img src={ScottWebb} alt="Sign In Image" />
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  alerts: state.alert,
});

export default connect(mapStateToProps, {
  login,
  skipLogin,
  setAlert,
  removeAlert,
})(Login);
