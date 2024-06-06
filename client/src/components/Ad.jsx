import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import openSocket from "socket.io-client";
import Chat from "./Chat";
// Actions
import {
  loadAdDetails,
  loadAdImages,
  loadHighestBid,
  placeBid,
  startAuction,
  updateTimer,
  updateAdDetails,
  clearAdImage,
  setImageLoadingStatus,
  clearAdDetails,
} from "../actions/ad";
import { setAlert, clearAlerts } from "../actions/alert";
import Nav from "./Nav";

import Spinner from "./Spinner";
// import Share from "./ShareSVG";
import CopyBtn from "./CopyButton";
import imagePlaceholder from "../images/no-image-icon.png";
import blankProfile from "../assets/blank-profile.png";

import { secondsToHms } from "../utils/secondsToHms";

import styles from "./css/Ad.module.css";

const Ad = (props) => {
  console.log(props);
  // Extract route parameters and set initial state
  const params = useParams();
  const [bidPrice, setBidPrice] = useState(0);
  const [bidButton, setBidButton] = useState(true);
  const [ownerAd, setOwnerAd] = useState(false);
  const [startButton, setStartButton] = useState(true);
  const [mainImage, setMainImage] = useState(imagePlaceholder);
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [second, setSecond] = useState("00");
  //   const [shareBtnColor, setShareBtnColor] = useState("#111918");
  const navigate = useNavigate();

  const mainImageStyle = {
    backgroundImage: `url(${mainImage})`,
    height: "100%",
    width: "100%",
    borderRadius: "15px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // Update bid button status based on auction status and bid price
  const updateBidButtonStatus = (updatedPrice) => {
    if (
      updatedPrice > Number(props.adDetails.currentPrice.$numberDecimal) &&
      props.adDetails.auctionStarted &&
      !props.adDetails.auctionEnded
    ) {
      setBidButton(false);
    } else {
      setBidButton(true);
    }
  };

  // Load ad details when the component mounts or when adId changes
  useEffect(() => {
    props.clearAlerts();
    props.setImageLoadingStatus();
    props.loadAdDetails(params.adId);
  }, [params.adId]);

  // Load ad image when the ad image changes
  useEffect(() => {
    if (props.adDetails.images) {
      props.loadAdImages(props.adDetails.images);
    }
    if (props.adImages && props.adImages.length > 0) {
      setMainImage(props.adImages[0]);
      console.log("Main Image Set:", props.adImages[0]);
    }
  }, [props.adDetails.images]);

  // Load highest bid when the component mounts or when adId changes
  useEffect(() => {
    props.loadHighestBid(params.adId);
  }, [params.adId]);

  // Update bid button status when bid price or auction status changes
  useEffect(() => {
    updateBidButtonStatus(bidPrice);
  }, [bidPrice, props.adDetails.auctionEnded]);

  // Set up socket connections for real-time updates related to the ad
  useEffect(() => {
    // Create a socket instance for ad updates
    const adSocket = openSocket(process.env.REACT_APP_API_BASE_URL, {
      path: "/socket/adpage",
    });

    // Join the ad room when entering the ad page
    adSocket.emit("joinAd", { ad: params.adId.toString() });

    // Handle auctionStarted event
    adSocket.on("auctionStarted", (res) => {
      // Update ad details with the new data
      props.updateAdDetails(res.data);
      props.clearAlerts();
      // Show an alert if the auction has started
      if (res.action === "started") props.setAlert("Auction started!", "info");
    });

    // Handle auctionEnded event
    adSocket.on("auctionEnded", (res) => {
      if (res.action === "sold") {
        // Update ad details with the sold item's details
        props.updateAdDetails(res.ad);
        props.clearAlerts();
        // Show an alert if the item was sold
        props.setAlert(
          `Auction ended, item sold to ${res.winner.username}!`,
          "info"
        );
      } else {
        // Update ad details if the item was not sold
        props.updateAdDetails(res.data);
        props.clearAlerts();
        props.setAlert("Item not sold", "info");
      }
    });

    // Handle timer event
    adSocket.on("timer", (res) => {
      // Update the timer in ad details
      props.updateTimer(res.data);
    });

    // Handle bidPosted event
    adSocket.on("bidPosted", (res) => {
      // Load the new highest bid and update ad details
      props.loadHighestBid(res.data._id);
      props.updateAdDetails(res.data);
    });

    // Clean up socket connections when leaving the ad page
    return () => {
      // Leave the ad room and disconnect socket
      adSocket.emit("leaveAd", { ad: params.adId.toString() });
      adSocket.off();
      // Clear ad details and images from Redux store
      props.clearAdDetails();
      props.clearAdImage();
    };
  }, [params.adId]);

  // Check if the current user is the owner of the ad and if the auction can be started
  useEffect(() => {
    if (props.adDetails.owner && props.auth.user) {
      // Determine if the current user is the owner of the ad
      if (props.adDetails.owner._id === props.auth.user._id) setOwnerAd(true);
      else setOwnerAd(false);
    }

    // Check if the auction start button should be enabled
    if (!props.adDetails.auctionStarted && !props.adDetails.auctionEnded) {
      setStartButton(true);
    } else {
      setStartButton(false);
    }
  }, [
    props.adDetails.owner,
    props.auth.user,
    props.adDetails.auctionStarted,
    props.adDetails.auctionEnded,
  ]);

  // Render loading spinner during authentication check
  if (props.authLoading) {
    return (
      <div
        style={{
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner />
      </div>
    );
  }

  // Redirect to login page if not authenticated
  if (!props.isAuth) {
    navigate("/login");
  }

  // Show spinner while loading ad details or highest bid
  if (props.loading || props.loadingHighestBid) {
    return (
      <div
        style={{
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Spinner />
      </div>
    );
  }

  // Event handler for bid price input change
  const handleBidPriceChange = (e) => {
    setBidPrice(e.target.value);
  };

  // Event handler for submitting a bid
  const handleSubmitBid = (e) => {
    e.preventDefault();
    props.placeBid(props.adDetails._id, bidPrice);
    let inp = document.getElementById("price-inp");
    inp.value = "";
  };

  // Event handler for starting the auction
  const handleStartAuction = (e) => {
    e.preventDefault();
    props.startAuction(props.adDetails._id);
    props.setAlert("Auction started", "success");
  };

  // Determine the auction status based on ad details
  const auctionStatus = () => {
    if (props.adDetails.sold) {
      return "Sold";
    } else if (props.adDetails.auctionEnded) {
      return "Ended, not-sold";
    } else if (!props.adDetails.auctionStarted) {
      return "Upcoming";
    } else {
      return "Ongoing";
    }
  };

  const onFocusHandle = () => {
    let inp = document.getElementById("price-inp");
    inp.style.outline = "none";
    inp.style.boxShadow = "none";
  };

  return props.loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <Nav/>
      <div
        style={{
          height: "90vh",
          width: "100vw",
          padding: "5% 55px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "55%",
            borderRadius: "15px",
            border: "1px solid #dfdfdf",
            padding: "20px",
          }}
        >
          {!props.imageLoading && props.adImages ? (
            // Create a div that will contain background image which is initially first element of adImages array and will change on mouseclick on the other images in the array that are shown as thumbnails
            <div id="main-image" style={mainImageStyle}>
              {/* Create a div that will contain the thumbnails of the images */}
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  padding: "10px",
                }}
              >
                <div
                  // add glassmorphic style
                  style={{
                    height: "100px",
                    // width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "15px",
                  }}
                >
                  {props.adImages.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundImage: `url(${image})`,
                        height: "65px",
                        width: "65px",
                        borderRadius: "15px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                        marginRight: "5px",
                        marginLeft: "5px",
                      }}
                      onClick={() => {
                        // Change the background image of the main image container
                        setMainImage(image);
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // center the loader

            <div class={styles["loader"]}></div>
          )}
        </div>
        {props.adDetails.basePrice ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "100%",
              width: "43%",
              padding: "20px",
              // backgroundColor: "#000",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h2 style={{ fontFamily: "GilroyBlack", fontSize: "2rem" }}>
                  {props.adDetails.productName}
                </h2>

                <span
                  style={{
                    fontFamily: "GilroySemiBold",
                    fontSize: "1.2rem",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "7px",
                  }}
                >
                  Base Price
                  <p
                    style={{
                      fontFamily: "GilroyLight",
                      fontWeight: "500",
                      margin: "0",
                      marginLeft: "10px",
                    }}
                  >
                    ${props.adDetails.basePrice.$numberDecimal}
                  </p>
                </span>
                <p
                  style={{
                    fontFamily: "GilroyLight",
                    fontSize: "1rem",
                    color: "#8FA0AF",
                    marginTop: "7px",
                  }}
                >
                  {props.adDetails.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      height: "70px",
                      width: "70px",
                      borderRadius: "50%",
                      background: `url(${blankProfile})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "10px",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "GilroySemiBold",
                        fontSize: "1.2rem",
                        margin: "0",
                      }}
                    >
                      {props.adDetails.owner.username}
                    </p>
                    <p
                      style={{
                        fontFamily: "GilroyLight",
                        fontSize: "1rem",
                        color: "#8FA0AF",
                        margin: "0",
                      }}
                    >
                      Seller
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
  <CopyBtn link={window.location.href} />
  <div style={{ marginLeft: '10px' }}></div> {/* Adjust the spacing */}
  <Chat />
</div>
              {/* <div
                id="share-btn"
                style={{
                  height: "50px",
                  width: "50px",
                  border: "1px solid #454545",
                  borderRadius: "50%",
                  padding: "10px 8px",
                  cursor: "pointer",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Share fillColor={shareBtnColor} />
              </div> */}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "3%",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "GilroySemiBold",
                    fontSize: "1.2rem",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "7px",
                    // width: "200px",
                    backgroundColor: "#daa520",
                    color: "#fff",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "space-evenly",
                    borderRadius: "8px",
                    padding: "8px",
                    //   marginBottom: "0",
                  }}
                >
                  Current Price
                  <p
                    style={{
                      fontFamily: "GilroyLight",
                      fontWeight: "500",
                      marginLeft: "15px",
                      marginBottom: "0",
                    }}
                  >
                    ${props.adDetails.currentPrice.$numberDecimal}
                  </p>
                </span>
                {props.highestBid ? (
                  <span
                    style={{
                      fontFamily: "GilroyLight",
                      fontSize: "1rem",
                      color: "#8FA0AF",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      // marginLeft: "10px",
                      marginTop: "5px",
                    }}
                  >
                    Highest bid by{" "}
                    <p
                      style={{
                        fontFamily: "GilroySemiBold",
                        margin: "0",
                        marginLeft: "5px",
                        color: "#000",
                      }}
                    >
                      {props.highestBid.user.username}
                    </p>
                  </span>
                ) : null}
              </div>
              <div>
                <span
                  style={{
                    width: "53px",
                    fontFamily: "GilroySemiBold",
                    fontSize: "1.7rem",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "space-between",
                  }}
                >
                  {props.adDetails.bids.length}
                  <p
                    style={{
                      //   fontFamily: "GilroyLight",
                      fontSize: "1rem",
                      color: "#8FA0AF",
                      marginTop: "20px",
                      marginLeft: "3px",
                    }}
                  >
                    bids
                  </p>
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  Auction{" "}
                  {auctionStatus() === "Ended, not-sold" ||
                  auctionStatus() === "Sold"
                    ? "Ended"
                    : auctionStatus() === "Ongoing"
                    ? "Ending in"
                    : "Starting in"}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginRight: "10px",
                        // marginLeft: "10px",
                      }}
                    >
                      <div
                        style={{
                          height: "48px",
                          width: "35px",
                          backgroundColor: "#2D2D2D",
                          borderRadius: "3px",
                          marginLeft: "2px",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: "GilroySemiBold",
                            color: "#fff",
                            margin: "0",
                          }}
                        >
                          0
                        </h1>
                      </div>
                      <div
                        style={{
                          height: "48px",
                          width: "35px",
                          backgroundColor: "#2D2D2D",
                          borderRadius: "3px",
                          marginLeft: "2px",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: "GilroySemiBold",
                            color: "#fff",
                            margin: "0",
                          }}
                        >
                          5
                        </h1>
                      </div>
                    </div>
                    <p
                      style={{
                        fontFamily: "GilroyLight",
                        fontSize: ".9rem",
                        fontWeight: "600",
                        marginLeft: "11px",
                      }}
                    >
                      HOURS
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginRight: "10px",
                      }}
                    >
                      <div
                        style={{
                          height: "48px",
                          width: "35px",
                          backgroundColor: "#2D2D2D",
                          borderRadius: "3px",
                          marginLeft: "2px",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: "GilroySemiBold",
                            color: "#fff",
                            margin: "0",
                          }}
                        >
                          2
                        </h1>
                      </div>
                      <div
                        style={{
                          height: "48px",
                          width: "35px",
                          backgroundColor: "#2D2D2D",
                          borderRadius: "3px",
                          marginLeft: "2px",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: "GilroySemiBold",
                            color: "#fff",
                            margin: "0",
                          }}
                        >
                          6
                        </h1>
                      </div>
                    </div>
                    <p
                      style={{
                        fontFamily: "GilroyLight",
                        fontSize: ".9rem",
                        fontWeight: "600",
                        marginLeft: "7px",
                      }}
                    >
                      MINUTES
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        // marginRight: "10px",
                      }}
                    >
                      <div
                        style={{
                          height: "48px",
                          width: "35px",
                          backgroundColor: "#2D2D2D",
                          borderRadius: "3px",
                          marginLeft: "2px",
                          //   alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: "GilroySemiBold",
                            color: "#fff",
                            margin: "0",
                          }}
                        >
                          1
                        </h1>
                      </div>
                      <div
                        style={{
                          height: "48px",
                          width: "35px",
                          backgroundColor: "#2D2D2D",
                          borderRadius: "3px",
                          marginLeft: "2px",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            fontFamily: "GilroySemiBold",
                            color: "#fff",
                            margin: "0",
                          }}
                        >
                          9
                        </h1>
                      </div>
                    </div>

                    <p
                      style={{
                        fontFamily: "GilroyLight",
                        fontSize: ".9rem",
                        fontWeight: "600",
                        marginLeft: "2px",
                      }}
                    >
                      SECONDS
                    </p>
                  </div>
                </div>
              </div>
              {!ownerAd && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "40%",
                  }}
                >
                  <input
                    id="price-inp"
                    style={{
                      width: "100%",
                      height: "40px",
                      margin: "10px 0 20px",
                      paddingLeft: "10px",
                      border: "1px solid #c9c9c6",
                      borderRadius: "8px",
                      fontFamily: "GilroyLight",
                    }}
                    type="text"
                    pattern="[0-9]*"
                    onFocus={onFocusHandle}
                    placeholder="Enter the bid"
                    onChange={(e) => {
                      handleBidPriceChange(e);
                    }}
                  />
                  <button
                    className={styles["bid-btn"]}
                    disabled={bidButton}
                    onClick={(e) => handleSubmitBid(e)}
                  >
                    Place Bid
                  </button>
                </div>
              )}

              {ownerAd && (
                <div
                  style={{
                    height: "100%",
                    width: "40%",
                  }}
                >
                  <button
                    style={{
                      marginTop: "20%",
                    }}
                    className={styles["bid-btn"]}
                    disabled={!startButton}
                    onClick={(e) => handleStartAuction(e)}
                  >
                    Start Auction
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              height: "100%",
              width: "43%",
              padding: "20px",
            }}
          ></div>
        )}
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  adDetails: state.ad.adDetails,
  loading: state.ad.loading,
  authLoading: state.auth.loading,
  isAuth: state.auth.isAuthenticated,
  alerts: state.alert,
  highestBid: state.ad.highestBid,
  loadingBid: state.ad.loadingHighestBid,
  auth: state.auth,
  adImages: state.ad.adImages,
  imageLoading: state.ad.imageLoading,
});

export default connect(mapStateToProps, {
  loadAdDetails,
  loadAdImages,
  loadHighestBid,
  placeBid,
  startAuction,
  setAlert,
  clearAlerts,
  updateTimer,
  updateAdDetails,
  clearAdImage,
  setImageLoadingStatus,
  clearAdDetails,
})(Ad);