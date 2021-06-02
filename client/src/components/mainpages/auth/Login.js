import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { showErrMsg, showSuccessMsg } from "../utils/notification/Notification";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    err: "",
    success: "",
  });
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  const togglePasswordVisiblity = () => {
    setIsPasswordShown(isPasswordShown ? false : true);
  };

  const { email, password, err, success } = user;

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", {
        email,
        password,
      });

      localStorage.setItem("firstLogin", true);

      window.location.href = "/";
      setUser({ ...user, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={loginSubmit}>
        <h2>Login</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
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

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
          <Link to="/forgot">Forget Password</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
