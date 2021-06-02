const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    revenue: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
    top_3_most_sold: {
      type: Array,
      default: [],
    },
    cost_operational: {
      type: Number,
      required: true,
    },
    cost_fixed: {
      type: Number,
      required: true,
    },
    number_of_sales: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Important
  }
);

module.exports = mongoose.model("Reports", reportSchema);
