import React, { useEffect } from "react";
import Header from "./components/header/Header";
import NavBar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import PartnerAcc from "./components/user/acc/Acc";
import Status from "./components/user/status/Status";
import History from "./components/user/history/History";

import Footer from "./components/footer/Footer";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FormReg from "./components/authorization/FormReg";
import FormLog from "./components/authorization/FormLog";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "./components/action/user";
import Users from "./components/admin/users/Users"
import Orders from "./components/admin/orders/Orders";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminNavbar from "./components/navbar/AdminNavbar";
import WithdrawRequests from "./components/admin/WithdrawRequests/WithdrawRequests";
import Refferals from "./pages/Refferals/Refferals";
import "./index.css";
import Profile from "./components/Profile/Profile";
import axios from "axios";
import AdminProfile from "./components/admin/AdminProfile/AdminProfile";
import InterestRate from "./components/admin/interestRate/interestRate";

function App() {
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth());
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Header />

      <div>
        <Routes>
          <Route
            path="/"
            element={(
              <Home />
            )}
          />
          <Route
            path="/registration"
            element={(
              <>
                <Home />
                <FormReg />
              </>
            )}
          />
          <Route
            path="/login"
            element={(
              <>
                <Home />
                <FormLog />
              </>
            )}
          />
          <Route
            path="/loginadmin"
            element={(
              <>
                <Home />
                <FormLog />
              </>
            )}
          />
        </Routes>
      </div>



      <Routes >
        <Route
          path="/users"
          element={
            <PrivateRoute isAdminRoute={true}>
              <AdminNavbar />
              <Users />
            </PrivateRoute>
          }
        />

        <Route
          path="/withdraw-requests"
          element={
            <PrivateRoute isAdminRoute={true}>
              <AdminNavbar />
              <WithdrawRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/interest-rate"
          element={
            <PrivateRoute isAdminRoute={true}>
              <AdminNavbar />
              <InterestRate />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute isAdminRoute={true}>
              <NavBar />
              <AdminProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/acc"
          element={
            <PrivateRoute>
              <NavBar />
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <NavBar />
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/refferals"
          element={
            <PrivateRoute>
              <NavBar />
              <Refferals />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute >
              <NavBar />
              <History />
            </PrivateRoute>
          }
        />

        <Route
          path="/status"
          element={
            <PrivateRoute>
              <NavBar />
              <Status />
            </PrivateRoute>}
        />
      </Routes>

      
    </BrowserRouter>
  );
}

export default App;
