import React, { useState } from "react";
import axios from "axios";
// import { isEmail } from "../utils/validation/Validation";
import { showErrMsg, showSuccessMsg } from "../utils/notification/Notification";

function ForgotPassword() {
  const [data, setData] = useState({
    security_answer: "",
    email: "",
    err: "",
    success: "",
  });

  const { email, security_answer, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const forgotPassword = async () => {
    try {
      const res = await axios.post("/user/forgot", { email, security_answer });
      console.log(res);
      return setData({ ...data, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="login-page">
      <form>
        <h2>Forgot Password</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={email}
          onChange={handleChangeInput}
        />
        <input
          type="security_answer"
          name="security_answer"
          required
          placeholder="Security Answer"
          value={security_answer}
          onChange={handleChangeInput}
        />

        <div className="row">
          <button type="submit" onClick={forgotPassword}>
            Verify your email
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
