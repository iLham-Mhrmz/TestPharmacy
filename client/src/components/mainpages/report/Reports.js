import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Filters from "./Filters";
import LoadMore from "./LoadMore";
import Loading from "../utils/loading/Loading";

function Reports() {
  const state = useContext(GlobalState);
  const [reports, setReports] = state.reportsAPI.reports;
  const [isAdmin] = state.userAPI.isAdmin;
  const [callback, setCallback] = state.reportsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [token] = state.token;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  useEffect(() => {
    if (token) {
      const getReports = async () => {
        if (isAdmin) {
          const res = await axios.get("/api/reports", {
            headers: { Authorization: token },
          });
          setReports(res.data.reports);
        }
      };
      getReports();
    }
  }, [reports, setReports, isAdmin, token]);

  console.log(reports);

  const editReport = async (id, reports) => {
    setID(id);
    setReports(reports);
    setOnEdit(true);
  };

  const deleteReport = async (id) => {
    try {
      const res = await axios.delete(`/api/reports/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <div>
      {/* <Filters /> */}
      <div className="history-page">
        <h2>List Reports</h2>

        <h4>You have {reports.length} reports</h4>

        <table>
          <thead>
            <tr>
              <th>Revenue</th>
              <th>Profit</th>
              <th>Top 3 Most Sold</th>
              <th>Cost Operational</th>
              <th>Cost Fixed</th>
              <th>Number of Sales</th>
              <th>Report Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((items) => (
              <tr key={items._id}>
                <td>{items.revenue}</td>
                <td>{items.profit}</td>
                <td>{items.top_3_most_sold}</td>
                <td>{items.cost_operational}</td>
                <td>{items.cost_fixed}</td>
                <td>{items.number_of_sales}</td>
                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => editReport(items._id, reports)}>
                    Edit
                  </button>
                  <button onClick={() => deleteReport(items._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LoadMore />
      {reports.length === 0 && <Loading />}
    </div>
  );
}

export default Reports;
