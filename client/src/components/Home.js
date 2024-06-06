import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
// Styling
import "./css/home.css";
// Components
import Board from "./Board";
import Alert from "./Alert";
import Footer from "./Footer"
// import Board from "./Board";

const Home = (props) => {
  // Check if user is logged
  if (!props.isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      className="home"
      style={{
        backgroundColor: "#F5F6FA",
      }}
    >
      <div className="alert__display">
        <Alert />
      </div>
      <div
        className="product__board"
        style={{
          backgroundColor: "#F5F6FA",
        }}
      >
        <Board />
      </div>
    <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuth: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(Home);
