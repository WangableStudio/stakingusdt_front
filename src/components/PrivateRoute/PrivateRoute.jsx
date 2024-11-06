import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children, isAdminRoute }) => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const userRole = useSelector((state) => state.user?.currentUser?.user?.role)

    if(!isAuth) {
        return <Navigate to="/login"/>
    }

    if(isAdminRoute && userRole !== "ADMIN") {
        return <Navigate to="/login" />
    }

    return (children);
}

export default PrivateRoute;