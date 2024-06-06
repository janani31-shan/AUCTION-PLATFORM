const mongoose = require("mongoose");
const types = mongoose.Types;

const adSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: types.Decimal128,
      required: true,
    },
    currentPrice: {
      type: types.Decimal128,
      required: true,
    },
    duration: {
      type: Number,
    },
    timer: {
      type: Number,
    },
    startTime: {
      type: types.Decimal128,
      required: true,
    },
    endTime: {
      type: types.Decimal128,
      required: true,
    },
    soldAt: {
      type: Date,
    },
    images: [
      {
        type: String, // Store image URLs as strings
        required: true,
      },
    ],
    category: {
      type: String,
    },
    auctionStarted: {
      type: Boolean,
      default: false,
    },
    auctionEnded: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: types.ObjectId,
      ref: "user",
    },
    purchasedBy: {
      type: types.ObjectId,
      ref: "user",
    },
    currentBidder: {
      type: types.ObjectId,
      ref: "user",
    },
    bids: [
      {
        user: {
          type: types.ObjectId,
          ref: "user",
          required: true,
        },
        amount: {
          type: types.Decimal128,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    room: {
      type: types.ObjectId,
      ref: "room",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ad", adSchema);
