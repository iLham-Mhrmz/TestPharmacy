import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { showErrMsg, showSuccessMsg } from "../utils/notification/Notification";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    security_answer: "",
    err: "",
    success: "",
  });

  // const { name, email, password, security_answer } = user;
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  const togglePasswordVisiblity = () => {
    setIsPasswordShown(isPasswordShown ? false : true);
  };

  const { name, email, password, security_answer, err, success } = user;

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/user/register", {
        name,
        email,
        password,
        security_answer,
      });

      localStorage.setItem("firstLogin", true);

      setUser({ ...user, err: "", success: res.data.msg });
      // window.location.href = "/register";
      console.log();
    } catch (err) {
      // alert(err.response.data.msg);
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={registerSubmit}>
        <h2>Register</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          value={user.name}
          onChange={onChangeInput}
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput}
        />
        <div className="eye">
          <input
            type={isPasswordShown ? "password" : "text"}
            name="password"
            required
            autoComplete="on"
            placeholder="Password"
            value={user.password}
            onChange={onChangeInput}
          />
          <i
            className="fa fa-eye password-icon"
            onClick={togglePasswordVisiblity}
          />
        </div>

        <input
          type="security_answer"
          name="security_answer"
          required
          autoComplete="on"
          placeholder="Favorite Color?"
          value={user.security_answer}
          onChange={onChangeInput}
        />

        <div className="row">
          <button type="submit">Register</button>
          <Link to="/login">Login</Link>
          <Link to="/forgot">Forget Password</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
