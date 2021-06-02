import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";

function OrderDetails() {
  const state = useContext(GlobalState);
  const [invoice, setInvoice] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({});
  const [status, setStatus] = useState("");
  const [paymentID, setPaymentID] = useState("");
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const statuses = [
    { id: 1, name: "Pending" },
    { id: 2, name: "Approved" },
    { id: 3, name: "Rejected" },
  ];

  const params = useParams();

  useEffect(() => {
    if (token) {
      const getOrderDetails = async () => {
        const res = await axios.get(`/api/payment/${params.id}`, {
          headers: { Authorization: token },
        });
        setInvoice(res.data);
        setCart(res.data.cart);
        setAddress(res.data.address);
        setStatus(res.data.status);
        setPaymentID(res.data._id);
      };
      getOrderDetails();
    }
  }, [token, setInvoice, setCart, setAddress, setStatus, setPaymentID]);

  const handleChangeStatus = async (e) => {
    e.preventDefault();
    console.log(status);
    try {
      const res = await axios
        .put(
          `../api/payment/${params.id}`,
          { status: e.target.value },
          { headers: { Authorization: token } }
        )
        .then((res) => {
          alert(res.data.msg);
        });
      window.location.href = `/history/${params.id}`;
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  console.log(invoice);
  console.log(invoice.address);
  console.log(invoice.status);
  console.log(params.id);

  return (
    <div className="history-page">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Postal Code</th>
            <th>Country Code</th>
            <th>Status Payment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{invoice.name}</td>
            <td>{address.streetName + " - " + address.city}</td>
            <td>{address.postal_code}</td>
            <td>{address.state}</td>
            <td>
              {isAdmin ? (
                <select
                  name="status"
                  value={status}
                  onChange={handleChangeStatus}
                >
                  {statuses.map((item) => (
                    <option value={item.name} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              ) : (
                <option>{invoice.status}</option>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{ margin: "30px 0px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>$ {item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
