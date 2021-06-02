import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";

function Filters() {
  const state = useContext(GlobalState);

  const [sort, setSort] = state.reportsAPI.sort;

  return (
    <div className="filter_menu">
      <div className="row sort">
        <span>Sort By: </span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value=""></option>
          <option value="sort=createdAt">Transaction Date (Ascending)</option>
          <option value="sort=-createdAt">Transaction Date (Descending)</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
