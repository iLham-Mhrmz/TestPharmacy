import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
// import Loading from "../utils/loading/Loading";
import { useHistory, useParams} from "react-router-dom";

const initialState = {
  recipientName: "",
  streetName: "",
  city: "",
  state: "",
  postal_code: "",
  bank: "",
  _id: "",
  invoiceId: ""
};

function CheckOut() {
  const state = useContext(GlobalState);
  const [payment] = useState(initialState);
  // const [images, setImages] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState();
  const [isLogged] = state.userAPI.isLogged;
  const [cart, setCart] = state.userAPI.cart;
  // const [user] = state.userAPI.user;
  const [token] = state.token;
  const [bank, setBank] = useState();
  const [total, setTotal] = useState(0);
  // const [invoiceId, setInvoiceId] = useState();

  const HistoryPage = useHistory();
  const params = useParams();

  const banks = [
    { id: 1, name: "BCA", account: 7175667889 },
    { id: 2, name: "BNI", account: 781928299 },
    { id: 3, name: "Mandiri", account: "133-0008-33849" },
  ];
  //   const handleChangeBank = e =>{
  //     const {name, value} = e.target
  //     setBank({...bank, [name]:value})
  // }
  // useEffect(() => {
  //     if(param.id){
  //         setOnEdit(true)
  //         products.forEach(product => {
  //             if(product._id === param.id) {
  //                 setProduct(product)
  //                 setImages(product.images)
  //             }
  //         })
  //     }else{
  //         setOnEdit(false)
  //         setProduct(initialState)
  //         setImages(false)
  //     }
  // }, [param.id, products])
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (!isLogged) return alert("You're not an admin");
  //     const file = e.target.files[0];

  //     if (!file) return alert("File not exist.");

  //     if (file.size > 1024 * 1024)
  //       // 1mb
  //       return alert("Size too large!");

  //     if (file.type !== "image/jpeg" && file.type !== "image/png")
  //       // 1mb
  //       return alert("File format is incorrect.");

  //     let formData = new FormData();
  //     formData.append("file", file);

  //     setLoading(true);
  //     const res = await axios.post("/api/upload", formData, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //         Authorization: token,
  //       },
  //     });
  //     setLoading(false);
  //     setImages(res.data);
  //   } catch (err) {
  //     alert(err.response.data.msg);
  //   }
  // };

  // const handleDestroy = async () => {
  //   try {
  //     if (!isLogged) return alert("You're not an admin");
  //     setLoading(true);
  //     await axios.post(
  //       "/api/destroy",
  //       { public_id: images.public_id },
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     setLoading(false);
  //     setImages(false);
  //   } catch (err) {
  //     alert(err.response.data.msg);
  //   }
  // };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var paymentID = ''
      if (!isLogged) return alert("You're not logged in");

      await axios.post(
        "/api/payment",
        { address: address, cart: cart , bank: bank, total: total},
        {
          headers: { Authorization: token },
        }
      ).then(res => {
        paymentID = res.data.paymentID
      });
      
      setCart([]);
      addToCart([]);
      alert("You have successfully placed an order.");
      // window.location.href = `/invoice/${paymentID}`;
      window.location.href = `/upload_receipt/${paymentID}`;
      // HistoryPage.push(`/invoice/${invoice._id}`)
    } catch (err) {
      alert(err.response.msg);
    }


    // try {
    //     if(!isLogged) return alert("You're not an admin")
    //     if(!images) return alert("No Image Upload")

    //     if(onEdit){
    //         await axios.put(`/api/products/${product._id}`, {...product, images}, {
    //             headers: {Authorization: token}
    //         })
    //     }else{
    //         await axios.post('/api/products', {...product, images}, {
    //             headers: {Authorization: token}
    //         })
    //     }
    //     setCallback(!callback)
    //     history.push("/")
    // } catch (err) {
    //     alert(err.response.data.msg)
    // }
  };

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  // const styleUpload = {
  //   display: images ? "block" : "none",
  // };
  return (
    <div className="create_product">
      <div>
        {cart.map((product) => (
          <div className="detail cart" key={product._id}>
            <div className="box-detail">
              <p>{product.title}</p>
              <p>Rp. {product.price * product.quantity}</p>
              {/* <p>{product.description}</p>
                                <p>{product.stock}</p> */}

              {/* <div className="amount">
                                    <button onClick={() => decrement(product._id)}> - </button>
                                    <span>{product.quantity}</span>
                                    <button onClick={() => increment(product._id)}> + </button>
                                </div>
                                 */}
              <div
                className="delete"
                onClick={() => removeProduct(product._id)}
              >
                X
              </div>
            </div>
          </div>
        ))}
        <div className="total">
          <h3>Total: Rp. {total}</h3>
        </div>
        {/* <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                 */}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <h2>Address Detail</h2>
          <label htmlFor="recipientName">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            id="recipientName"
            required
            defaultValue={payment.recipientName}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="streetName">Street Name</label>
          <input
            type="text"
            name="streetName"
            id="streetName"
            required
            defaultValue={payment.streetName}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            required
            defaultValue={payment.city}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="State">State</label>
          <input
            type="text"
            name="state"
            id="state"
            required
            defaultValue={payment.state}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="postal_code">Postal Code</label>
          <input
            type="number"
            name="postal_code"
            id="stok"
            required
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="banks">Select Bank: </label>
          <select name="bank" value={bank} onChange={e=> setBank(e.target.value)}>
            <option value="">Please Select The bank</option>
            {banks.map((bank) => (
              <option value={bank.name} key={bank.id}>
                {bank.name} - {bank.account}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Checkout</button>
      </form>
    </div>
  );
}

export default CheckOut;
