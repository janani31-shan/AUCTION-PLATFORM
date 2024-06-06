import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
// Project files
import Spinner from "./Spinner";
import Nav from "./Nav";
import LoadingDisplay from "./LoadingDisplay";
import imagePlaceholder from "../images/no-image-icon.png";

import { loadUserAds } from "../actions/ad";

const AdList = (props) => {
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (props.isAuth) {
      const fetchData = async () => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/products/posted`
        );
        setAds(res.data);
      };
      fetchData();
    }
    setLoading(false);
  }, [props.loading]);

  console.log(props);

  return loading ? (
    <LoadingDisplay />
  ) : (
    <Fragment>
      <Nav />
      {console.log(ads)}
      <table
        style={{
          width: "90%",
          border: "None",
          borderCollapse: "collapse",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        <thead
          style={{
            borderBottom: "1px solid #ddd",
          }}
        >
          <tr>
            <th
              style={{
                textAlign: "left",
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "0 0 15px",
              }}
            >
              Product
            </th>
            <th
              style={{
                textAlign: "left",
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "0 0 15px",
              }}
            >
              Base Price
            </th>
            <th
              style={{
                textAlign: "left",
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "0 0 15px",
              }}
            >
              Current Price
            </th>
            <th
              style={{
                textAlign: "left",
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "0 0 15px",
              }}
            >
              Start Date
            </th>
            <th
              style={{
                textAlign: "left",
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "0 0 15px",
              }}
            >
              End Date
            </th>
            <th
              style={{
                textAlign: "right",
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "0 0 15px",
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr
              key={ad._id}
              style={{
                borderBottom: "1px solid #ddd",
              }}
            >
              <td
                style={{
                  textAlign: "left",
                  padding: "15px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      ad.image !== "/upload/image/undefined"
                        ? process.env.REACT_APP_API_BASE_URL +
                          "/upload/image/" +
                          ad.images[0]
                        : imagePlaceholder
                    }
                    alt=""
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      marginRight: "10px",
                    }}
                  />
                  <p
                    style={{
                      margin: "0",
                      fontFamily: "GilroySemiBold",
                      // marginRight: "-50px",
                      marginLeft: "10px",
                    }}
                  >
                    {ad.productName}
                  </p>
                </div>
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "15px 0",
                }}
              >
                ₹{ad.basePrice.$numberDecimal}
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "15px 0",
                }}
              >
                ₹{ad.currentPrice.$numberDecimal}
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "15px 0",
                }}
              >
                    {moment.unix(ad.startTime).format('YYYY-MM-DD HH:mm:ss').split("T")[0]}
                {/* {ad.startTime.split("T")[0]} */}
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "15px 0",
                }}
              >
                {moment.unix(ad.endTime).format('YYYY-MM-DD HH:mm:ss').split("T")[0]}
                {/* {ad.endTime.split("T")[0]} */}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "15px 0",
                }}
              >
                {ad.sold ? (
                  <span
                    style={{
                      color: "green",
                    }}
                  >
                    Sold
                  </span>
                ) : (
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    Not Sold
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(AdList);