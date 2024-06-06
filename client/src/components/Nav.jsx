import React from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

// Actions
import { logout } from "../actions/auth";

import styles from "./css/Nav.module.css";

const Nav = (props) => {
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-light ${styles.nav}`}
    >
      <RouterLink className="navbar-brand" to="/">
        {/* <span className={`ml-2 ${styles.navLogo}`}>Auction🔨</span> */}
      </RouterLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      {props.isAuthenticated ? (
        <div className={`collapse navbar-collapse`} id="navbarNavDropdown">
          <ul className={`navbar-nav ${styles.navContainer}`}>
            <div className={styles.navCenter}>
              <li className="nav-item">
                <RouterLink className={`nav-link ${styles.navLink}`} to="/">
                  Home
                </RouterLink>
              </li>
              <li className="nav-item">
                <RouterLink
                  className={`nav-link ${styles.navLink}`}
                  to="/dashboard"
                >
                  Profile
                </RouterLink>
              </li>
              <li className="nav-item">
                <RouterLink className={`nav-link ${styles.navLink}`} to="/profile">
                  Profile
                </RouterLink>
              </li>
              <li className="nav-item">
                <RouterLink
                  className={`nav-link ${styles.navLink}`}
                  to="/postad"
                >
                  Post Ad
                </RouterLink>
              </li>
              <li className="nav-item">
                <RouterLink
                  className={`nav-link ${styles.navLink}`}
                  to="/myads"
                >
                  AdList
                </RouterLink>
              </li>
              <li className="nav-item">
                <RouterLink
                  className={`nav-link ${styles.navLink}`}
                  to="/purchaseList"
                >
                  MyPurchase
                </RouterLink>
              </li>
            </div>
            <div className={styles.navRight}>
              <li className={`nav-item ${styles.logout}`}>
                <RouterLink
                  className={`nav-link ${styles.navLink}`}
                  to="/login"
                  onClick={props.logout}
                >
                  Logout
                </RouterLink>
              </li>
            </div>
          </ul>
        </div>
      ) : (
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <RouterLink className="nav-link" to="/login">
                Login
              </RouterLink>
            </li>
            <li className="nav-item">
              <RouterLink className="nav-link" to="/register">
                Register
              </RouterLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(Nav);
