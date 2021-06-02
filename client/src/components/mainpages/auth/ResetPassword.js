import React, { useState } from "react";
import axios from "axios";
import { useParams, Redirect } from "react-router-dom";
import { showErrMsg, showSuccessMsg } from "../utils/notification/Notification";
import { isLength, isMatch } from "../utils/validation/Validation";

function ResetPassword() {
  const [data, setData] = useState({
    password: "",
    err: "",
    cf_password: "",
    success: "",
  });

  //   const [Redirect, setRedirect] = useState(false);
  const { token } = useParams();
  console.log(token);
  const [isPasswordShown, setIsPasswordShown] = useState(true);

  const togglePasswordVisiblity = () => {
    setIsPasswordShown(isPasswordShown ? false : true);
  };
  //   const renderRedirect = () => {
  //     if (Redirect) {
  //       return <Redirect to="/login" />;
  //     }
  //   };

  const { password, cf_password, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleResetPass = async () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match.", success: "" });

    try {
      const res = await axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );
      window.location.href = "/login";
      console.log(password);

      return setData({ ...data, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setData({ ...data, err: err.response.data.msg, success: "" });
    }

    //     if (data.success) {
    //       setRedirect(true);
    //     }
  };

  return (
    <div className="login-page">
      {/* {renderRedirect} */}
      <form>
        <h2>Reset Your Password</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <label>Please Input Your New Password</label>
        <div className="eye">
          <input
            type={isPasswordShown ? "password" : "text"}
            name="password"
            id="password"
            value={password}
            onChange={handleChangeInput}
          />
          <i
            className="fa fa-eye password-icon"
            onClick={togglePasswordVisiblity}
          />
        </div>
        <label>Confirm Password</label>
        <input
          type={isPasswordShown ? "password" : "text"}
          name="cf_password"
          id="cf_password"
          value={cf_password}
          onChange={handleChangeInput}
        />
        <div className="row">
          <button onClick={handleResetPass}>Reset Password</button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
