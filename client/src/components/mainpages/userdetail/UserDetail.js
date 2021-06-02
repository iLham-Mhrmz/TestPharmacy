import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
// import { Link } from "react-router-dom";
import axios from "axios";
import TablePagination from "@material-ui/core/TablePagination";

// function useToggle(initialValue = false) {
//   const [value, setValue] = React.useState(initialValue);
//   const toggle = React.useCallback(() => {
//     setValue((v) => !v);
//   }, []);
//   return [value, toggle];
// }

function UserDetail() {
  const state = useContext(GlobalState);
  const [users] = state.userAPI.users;
  // const [user, setUser] = state.userAPI.user;
  const [callback, setCallback] = state.userAPI.callback;
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = useState();
  const [rowsPerPage, setRowsPerPage] = React.useState();
  // const [dense, setDense] = React.useState(false);
  const statuses = [
    { no: 1, name: "Active" },
    { no: 2, name: "Inactive" },
  ];

  const handleChangePage = (event, users) => {
    setPage(users);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.users.value, 10));
    setPage(0);
  };

  console.log(users);
  // console.log(user);
  const userDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this account?")) {
        const res = await axios.delete(`/user/delete/${id}`, {
          headers: { Authorization: token },
        });
        // setCallback(!callback);
        window.location.href = "/user_detail";
      }
    } catch (err) {
      // alert(err.response.data.msg);
    }
  };
  const editStatus = async (id, name) => {
    try {
      await axios
        .patch(
          `/user/update_status/${id}`,
          {
            status: id.target.value,
          },
          { headers: { Authorization: token } }
        )
        .then((res) => {
          alert(res.data.msg);
        });
      window.location.href = `/userdetail`;
    } catch (err) {
      alert(err);
    }
  };

  // const editStatus = async (id) => {
  //   setupdateStatus(id.target.value);
  //   if (window.confirm("Are you sure you want to update this user status?")) {
  //     if (token) {
  //       if (isAdmin) {
  //         try {
  //           await axios
  //             .put(
  //               `/user/user_status/${id}`,
  //               { status: id.target.status },
  //               {
  //                 headers: { Authorization: token },
  //               }
  //             )
  //             .then((res) => {
  //               alert(res.data.msg);
  //             });
  //           window.location.href = "/user_detail";
  //         } catch (err) {
  //           alert(err.response.data.msg);
  //         }
  //       }
  //     }
  //   }
  // };

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
  return (
    <div className="history-page">
      <h2>List Users</h2>

      <h4>You have {users.length} Users</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Register Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((items) => (
            <tr key={items._id}>
              <td>{items.name}</td>
              <td>{items.email}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                {isAdmin ? (
                  <select
                    name="status"
                    value={items.status}
                    onChange={ editStatus()}
                  >
                    {statuses.map((item) => (
                      <option value={item.name} key={item.no}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <option>{items.status}</option>
                )}
              </td>
              <td>
                {/* <button
                  style={{ color: "blue", paddingRight: "50px" }}
                  onClick={() => editStatus(items._id)}
                >
                  Change Status
                </button> */}
                <button
                  style={{ color: "red" }}
                  onClick={() => userDelete(items._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div>
        <ul className="flex-1 flex justify-start my-4 items-center">
          <li>
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={handlePrev}
              disabled={currentPage == pages[0] ? true : false}
            >
              Previous
            </button>
          </li>
          {pageDecrementBtn}
          {/ {renderPageNumbers} /}
          {pageIncrementBtn}
          <li>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-5"
              onClick={handleNext}
              disabled={currentPage == pages[pages.length - 1] ? true : false}
            >
              Next
            </button>
          </li>
        </ul>
      </div> */}
      {/* {users.map((items) => ( */}
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOption={(5, 10)}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {/* ))} */}
    </div>
  );
}

export default UserDetail;
