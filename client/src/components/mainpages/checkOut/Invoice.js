import React, {useContext, useEffect, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'


function Invoice() {
    const state = useContext(GlobalState)
    const [invoice, setInvoice] = useState([])
    const [cart, setCart] = useState([])
    const [address, setAddress] = useState([])
    const [total, setTotal] = useState(0)
    const [isLogged] = state.userAPI.isLogged
    const [token] = state.token
    
    const params = useParams()
    useEffect(() =>  {
        if(token){
            const getInvoice = async() =>{
                const res = await axios.get(`/api/payment/${params.id}`, {
                    headers: {Authorization: token}
                })
                setInvoice(res.data)
                setCart(res.data.cart)
                setAddress(res.data.address)
                setTotal(res.data.total)
                console.log(res.data)
            }
            getInvoice()
        }
        
    },[token, isLogged])
    console.log(cart)
    console.log(address)


    return (
        <div className="invoice-box">
      <table cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr className="top">
            <td colSpan={2}>
              <table>
                <tbody>
                  <tr>
                    <td className="title">
                      <img
                        src="https://www.sparksuite.com/images/logo.png"
                        style={{ width: "100%", maxWidth: "300px" }}
                      />
                    </td>
                    <td>
                      {invoice.paymentID}
                      <br />
                      Created:{" "}
                      {new Date(invoice.createdAt).toLocaleDateString()}
                      <br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr className="information">
            <td colSpan={2}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      Sparksuite, Inc.
                      <br />
                      12345 Sunny Road
                      <br />
                      Sunnyville, CA 12345
                    </td>
                    <td>
                      {invoice.name}
                      <br />
                      {invoice.email}
                      <br />
                    </td>
                    <td>
                        {address.streetName}<br/>
                        {address.city}<br/>
                        {address.state}<br/>
                        {address.postal_code}<br/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr className="heading">
            <td>Payment Method</td>
            <td></td>
            <td></td>
          </tr>
          <tr className="details">
            <td>Bank Transfer</td>
            <td></td>
            <td>{invoice.bank}</td>
          </tr>
          <tr className="heading">
            <td>Item</td>
            <td>Quantity</td>
            <td>Price</td>
          </tr>
          {cart.map((item) => (
            <tr key={item._id} className="item">
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>$ {item.price * item.quantity}</td>
            </tr>
          ))}
          <tr className="details">
            <td></td>
            <td>Total:</td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
    )
}

export default Invoice
