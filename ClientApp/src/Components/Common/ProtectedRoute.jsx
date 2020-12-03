import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class ProtectedRoute extends Component {
  render() {
    const { to } = this.props;

    return <Redirect from="/" to="/reports/Tickets" />;
  }
}

export default ProtectedRoute;
