import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Products from "./products/Products";
import Prescription from "./products/Prescription";
import DetailProduct from "./detailProduct/DetailProduct";
import Login from "./auth/Login";
import Register from "./auth/Register";
import OrderHistory from "./history/OrderHistory";
import OrderDetails from "./history/OrderDetails";
import Cart from "./cart/Cart";
import NotFound from "./utils/not_found/NotFound";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";

import { GlobalState } from "../../GlobalState";
import CheckOut from "./checkOut/CheckOut";
import Invoice from "./checkOut/Invoice";
import UploadReceipt from "./checkOut/UploadReceipt";
import UserDetail from "../mainpages/userdetail/UserDetail";
import Reports from "../mainpages/report/Reports";
import ActivationEmail from "./auth/ActivationEmail";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";


function Pages() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/detail/:id" exact component={DetailProduct} />

      <Route path="/login" exact component={isLogged ? NotFound : Login} />
      <Route
        path="/register"
        exact
        component={isLogged ? NotFound : Register}
      />

      <Route
        path="/category"
        exact
        component={isAdmin ? Categories : NotFound}
      />
      <Route
        path="/create_product"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route
        path="/edit_product/:id"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />

      <Route
        path="/history"
        exact
        component={isLogged ? OrderHistory : NotFound}
      />
      <Route
        path="/history/:id"
        exact
        component={isLogged ? OrderDetails : NotFound}
      />
      <Route path="/report" exact component={isAdmin ? Reports : NotFound} />

      <Route path="/cart" exact component={Cart} />
      <Route path="/checkout" exact component={CheckOut} />
      <Route path="/prescription" exact component={Prescription} />
      <Route path="/invoice/:id" exact component={Invoice} />
      <Route
        path="/upload_receipt/:paymentID"
        exact
        component={UploadReceipt}
      />
      <Route path="/userdetail" exact component={UserDetail} />
      <Route
        path="/user/activation/:activation_token"
        exact
        component={ActivationEmail}
      />
      <Route path="/user/reset/:token" exact component={ResetPassword} />

      <Route path="/forgot" exact component={ForgotPassword} />

      <Route path="*" exact component={NotFound} />
    </Switch>
  );
}

export default Pages;
