import axios from "axios";
import {
  LOAD_ADS,
  LOAD_AD_DETAILS,
  LOAD_HIGHEST_BID,
  PLACE_BID,
  POST_AD,
  START_AUCTION,
  USER_PURCHASED_LOADED,
  AD_POSTED_BY_OTHER,
  UPDATE_AD_IN_AD_LIST,
  UPDATE_TIMER,
  UPDATE_AD_DETAILS,
  LOAD_AD_IMAGE,
  CLEAR_AD_IMAGE,
  IMAGE_LOADING,
  CLEAR_AD_DETAILS,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

// Load ads
export const loadAds =
  (userId = null) =>
  async (dispatch) => {
    let config = null;
    if (userId) {
      config = { params: { user: userId } };
    }
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/ad?option=notexpired`,
        config
      );

      dispatch({
        type: LOAD_ADS,
        payload: res.data,
      });
    } catch (error) {
      // Get errors array sent by api
      if (!error.response) {
        return dispatch(setAlert("Server error", "error"));
      }
      console.log(error.response);
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
      }
    }
  };

// Load ad details
export const loadAdDetails = (adId) => async (dispatch) => {
  try {
    if (localStorage.getItem("token")) {
      setAuthToken(localStorage.getItem("token"));
    }
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/ad/${adId}`
    );

    dispatch({
      type: LOAD_AD_DETAILS,
      payload: res.data,
    });
  } catch (error) {
    // Get errors array sent by api
    if (!error.response) {
      return dispatch(setAlert("Server error", "error"));
    }
    console.log(error.response);
    const errors = error.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
    }
  }
};

// Clear ad details
export const clearAdDetails = () => (dispatch) => {
  dispatch({
    type: CLEAR_AD_DETAILS,
  });
};

// export const loadAdImages = (ads) => async (dispatch) => {
//   try {
//     // Create an array to store the loaded image URLs
//     const adImages = [];

//     for (let i = 0; i < ads.length; i++) {
//       // Generate the complete URL for fetching the image
//       const imageUrl = `${process.env.REACT_APP_API_BASE_URL}/upload/image/${ads[i]}`; // Update this path as needed
//       console.log(ads[i]);
//       // Send a GET request to fetch the image
//       const res = await axios.get(imageUrl, {
//         responseType: "blob",
//       });

//       // If the request is successful, add the URL of the loaded image to the array
//       adImages.push(
//         URL.createObjectURL(res.data)
//       );
//     }

//     // Dispatch an action with the array of loaded image URLs
//     dispatch({
//       type: LOAD_AD_IMAGE, // Assuming LOAD_AD_IMAGE is your Redux action type
//       payload: adImages,
//     });
//   } catch (error) {
//     // Handle errors, such as network issues or server errors
//     console.error(error);

//     if (!error.response) {
//       // Network error, dispatch an alert or handle it as needed
//       return dispatch(setAlert("Network error", "error"));
//     }

//     // Server responded with an error
//     const errors = error.response.data.errors;

//     if (errors) {
//       console.log(errors);

//       // Handle server errors and dispatch alerts as needed
//       errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
//     }
//   }
// };

export const loadAdImages = (ads) => async (dispatch) => {
  try {
    // Create an array of promises to fetch the images
    const imagePromises = ads.map(async (ad) => {
      // Generate the complete URL for fetching the image
      const imageUrl = `${process.env.REACT_APP_API_BASE_URL}/upload/image/${ad}`;

      // Send a GET request to fetch the image and return the URL
      const res = await axios.get(imageUrl, {
        responseType: "blob",
      });

      return URL.createObjectURL(res.data);
    });

    // Use Promise.all to concurrently fetch all images
    const adImages = await Promise.all(imagePromises);

    // Dispatch an action with the array of loaded image URLs
    dispatch({
      type: LOAD_AD_IMAGE, // Assuming LOAD_AD_IMAGE is your Redux action type
      payload: adImages,
    });
  } catch (error) {
    // Handle errors, such as network issues or server errors
    console.error(error);

    if (!error.response) {
      // Network error, dispatch an alert or handle it as needed
      return dispatch(setAlert("Network error", "error"));
    }

    // Server responded with an error
    const errors = error.response.data.errors;

    if (errors) {
      console.log(errors);

      // Handle server errors and dispatch alerts as needed
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
    }
  }
};

// Clear ad image
export const clearAdImage = (adId) => async (dispatch) => {
  dispatch({
    type: CLEAR_AD_IMAGE,
  });
};

// Set image status to loading
export const setImageLoadingStatus = () => async (dispatch) => {
  dispatch({
    type: IMAGE_LOADING,
  });
};

// Set ad details
export const setAdDetails = (ad) => (dispatch) => {
  dispatch({
    type: LOAD_AD_DETAILS,
    payload: ad,
  });
};

// Current highest bid on ad
export const loadHighestBid = (adId) => async (dispatch) => {
  const url = `${process.env.REACT_APP_API_BASE_URL}/bid/${adId}`;
  try {
    const res = await axios.get(url, { params: { option: "highest" } });

    dispatch({
      type: LOAD_HIGHEST_BID,
      payload: res.data[0],
    });
  } catch (error) {
    // Get errors array sent by api
    if (!error.response) {
      return dispatch(setAlert("Server error", "error"));
    }
    console.log(error.response);
    const errors = error.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
    }
  }
};

// Place bid
export const placeBid = (adId, bidAmount) => async (dispatch) => {
  const url = `${process.env.REACT_APP_API_BASE_URL}/bid/${adId}`;
  try {
    const res = await axios.post(url, null, { params: { amount: bidAmount } });
    const res2 = await axios.get(url, { params: { option: "highest" } });
    dispatch({
      type: PLACE_BID,
      payload: { adDetails: res.data, highestBid: res2.data[0] },
    });
    setAlert("Bid submitted", "success");
  } catch (error) {
    // Get errors array sent by api
    if (!error.response) {
      return dispatch(setAlert("Server error", "error"));
    }
    console.log(error.response);
    const errors = error.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
    }
  }
};

// Post ad
export const postAd = (data) => async (dispatch) => {
  const url = `${process.env.REACT_APP_API_BASE_URL}/ad`;
  try {
    const res = await axios.post(url, JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

    dispatch({
      type: POST_AD,
      payload: res.data.ad,
    });
  } catch (error) {
    // Get errors array sent by api
    if (!error.response) {
      return dispatch(setAlert("Server error", "error"));
    }
    console.log(error.response);
    const errors = error.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
    }
  }
};

// Post ad
export const startAuction = (adId) => async (dispatch) => {
  const url = `${process.env.REACT_APP_API_BASE_URL}/auction/start/${adId}`;
  try {
    const res = await axios.get(url);

    dispatch({
      type: START_AUCTION,
      payload: res,
    });
  } catch (error) {
    // Get errors array sent by api
    if (!error.response) {
      return dispatch(setAlert("Server error", "error"));
    }
    console.log(error.response);
    const errors = error.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
    }
  }
};

// Load ads purchased by user
export const getUserPurchasedAds = () => async (dispatch) => {
  const url = `${process.env.REACT_APP_API_BASE_URL}/user/products/purchased`;
  try {
    const res = await axios.get(url);

    dispatch({
      type: USER_PURCHASED_LOADED,
      payload: res.data,
    });
  } catch (error) {
    // Get errors array sent by api
    if (!error.response) {
      return dispatch(setAlert("Server error", "error"));
    }
    console.log(error.response);
    const errors = error.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg, "error", 50000)));
    }
  }
};

// Load ads purchased by user
export const adPostedByOther = (ad) => (dispatch) => {
  dispatch({
    type: AD_POSTED_BY_OTHER,
    payload: ad,
  });
};

// Update ad in ad list
export const updateAdInList = (ad) => (dispatch) => {
  dispatch({
    type: UPDATE_AD_IN_AD_LIST,
    payload: ad,
  });
};

// Update current ad (adDetails)
export const updateTimer = (timer) => (dispatch) => {
  dispatch({
    type: UPDATE_TIMER,
    payload: timer,
  });
};

// Update current ad (adDetails)
export const updateAdDetails = (ad) => (dispatch) => {
  dispatch({
    type: UPDATE_AD_DETAILS,
    payload: ad,
  });
};
