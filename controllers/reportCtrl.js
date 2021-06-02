const Reports = require("../models/reportModel");

// Filter, sorting, and paginating

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; // queryString = req.query;
    // console.log({ before: queryObj }); // before delete page
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // console.log({ after: queryObj }); // after delete page

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    // console.log({ queryObj, queryStr });

    //  gte = greater than or equal
    //  gt  = greater than
    //  lte = lesser than or equal
    //  lt  = lesser than
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      //console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");//createdAt kurang -
    }

    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const reportCtrl = {
  getReports: async (req, res) => {
    try {
      // console.log(req.query);
      const features = new APIfeatures(Reports.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const reports = await features.query;

      res.json({
        //status: "success",
        result: reports.length,
        reports: reports,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createReport: async (req, res) => {
    try {
      const {
        revenue,
        profit,
        top_3_most_sold,
        cost_operational,
        cost_fixed,
        number_of_sales,
      } = req.body;

      //   const report = await report.find();
      //   if (report)
      //     return res.status(400).json({ msg: "This report already exists" });

      const newReport = new Reports({
        revenue,
        profit,
        top_3_most_sold,
        cost_operational,
        cost_fixed,
        number_of_sales,
      });
      await newReport.save();
      res.json({ msg: "Created a report" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteReport: async (req, res) => {
    try {
      await Reports.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a report" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateReport: async (req, res) => {
    try {
      const {
        revenue,
        profit,
        top_3_most_sold,
        cost_operational,
        cost_fixed,
        number_of_sales,
      } = req.body;

      await Reports.findOneAndUpdate(
        { _id: req.params.id },
        {
          revenue,
          profit,
          top_3_most_sold,
          cost_operational,
          cost_fixed,
          number_of_sales,
        }
      );
      res.json({ msg: "Updated a report" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = reportCtrl;
