import * as React from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Actions
import {
  loadAdDetails,
  loadAdImages,
  setImageLoadingStatus,
} from "../actions/ad";

// Files
import imagePlaceholder from "../images/no-image-icon.png";
import { secondsToHmsShort } from "../utils/secondsToHms";

import styles from "./css/Card.module.css";

function MediaCard(props) {
  //   console.log(props.ad);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    navigate(`/ads/${props.ad._id}`);
  };

  // Auction status based on the ad-details
  const updateAuctionStatus = (ad) => {
    if (ad.sold) {
      return "Sold";
    } else if (ad.auctionEnded) {
      return "Ended, not-sold";
    } else if (!ad.auctionStarted) {
      return "Upcoming";
    } else {
      return "Ongoing";
    }
  };

  // startTime - currentTime 
  let timeLeft = new Date(props.ad.startTime) - new Date();
  console.log("timeleft:",timeLeft);

  let sToHms = secondsToHmsShort(props.ad.timer).split(" ");
  let seconds = "";
  let min = "";
  let hour = "";

  if (sToHms.length === 1) {
    seconds = sToHms[0].split("s")[0];
  } else if (sToHms.length === 2) {
    min = sToHms[0].split("m")[0];
    seconds = sToHms[1].split("s")[0];
  } else if (sToHms.length === 3) {
    hour = sToHms[0].split("h")[0];
    min = sToHms[1].split("m")[0];
    seconds = sToHms[2].split("s")[0];
  }

  if (props.ad.timer === 0) {
    seconds = "00";
    min = "00";
    hour = "00";
  }

  if (seconds === "") seconds = "0";
  if (min === "") min = "0";
  if (hour === "") hour = "0";

  return (
    <div
      style={{
        // boxShadow: "0 0 10px 0.5px #dfdfdf",
        border: "1px solid #dfdfdf",
        borderRadius: "5px",
        // border: "none",
        cursor: "pointer",
        margin: "10px",
      }}
      className="card"
      onClick={(e) => {
        handleCardClick(e);
      }}
    >
      {!props.dashCard && (
        <div
          style={{
            background: `url(${
              props.ad.image !== "/upload/image/undefined"
                ? process.env.REACT_APP_API_BASE_URL +
                  "/upload/image/" +
                  props.ad.images[0]
                : imagePlaceholder
            })`,
            width: "100%",
            backgroundPosition: "center",
            backgroundPositionY: "25%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            // objectFit: "contain",
          }}
          className={`${styles["img"]}`}
        >
          <div className={styles["img-overlay"]}>
            <div>
              <p>Hours</p>
              <div className={styles["time"]}>
                <span>
                  <h3>{parseInt(hour) < 10 ? "0" + hour : hour}</h3>
                  {/* <h3>{hour}</h3> */}
                  <p>h</p>
                </span>
              </div>
            </div>
            <div>
              <p>Minute</p>
              <div className={styles["time"]}>
                <span>
                  {/* <h3>{min}</h3> */}
                  <h3>{parseInt(min) < 10 ? "0" + min : min}</h3>
                  <p>m</p>
                </span>
              </div>
            </div>
            <div>
              <p>Second</p>
              <div className={styles["time"]}>
                <span>
                  {/* <h3>{seconds}</h3> */}
                  <h3>{parseInt(seconds) < 10 ? "0" + seconds : seconds}</h3>
                  <p>s</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          padding: `10px 10px`,
          borderRadius: `0 0 5px 5px`,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h5
            style={{
              fontSize: "1rem",
              fontFamily: "GilroyRegular",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            {props.ad.productName}
          </h5>
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
            }}
          >
            <p>$</p>
            <p>{props.ad.currentPrice.$numberDecimal}</p>
          </span>
        </div>
        <div>
          <p>{updateAuctionStatus(props.ad)}</p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  adDetails: state.ad.adDetails,
});

export default connect(mapStateToProps, {
  loadAdDetails,
  loadAdImages,
  setImageLoadingStatus,
})(MediaCard);
