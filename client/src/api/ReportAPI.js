import { useState, useEffect } from "react";
import axios from "axios";

function ReportsAPI() {
  const [reports, setReports] = useState([]);
  const [callback, setCallback] = useState(false);
//   const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const getReports = async () => {
      const res = await axios.get(`/api/reports?limit=${page * 50}&${sort}`);
      setReports(res.data.reports);
      setResult(res.data.result);
    };
    getReports();
  }, [callback, sort, page]);

  return {
    reports: [reports, setReports],
    callback: [callback, setCallback],
    sort: [sort, setSort],
    page: [page, setPage],
    result: [result, setResult],
  };
}

export default ReportsAPI;