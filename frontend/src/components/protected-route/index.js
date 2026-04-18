import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ component: Component, loggedIn, ...props }) {
  return (
    <Route
      {...props}
      render={(routeProps) =>
        loggedIn ? (
          <Component {...routeProps} {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
}

export default ProtectedRoute;