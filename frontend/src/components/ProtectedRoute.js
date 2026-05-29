import React from "react";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <h2>Access Denied. Please login.</h2>;
  }
  return children;
}

export default ProtectedRoute;