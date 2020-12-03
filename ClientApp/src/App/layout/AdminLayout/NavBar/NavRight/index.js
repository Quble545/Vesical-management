import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import JwtDecode from "jwt-decode";

import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";

import Avatar1 from "../../../../../assets/images/user/avatar-1.jpg";

class NavRight extends Component {
  state = {
    listOpen: false,
    user: {},
  };

  render() {
    const { user } = this.state;

    return (
      <Aux>
        <ul className="navbar-nav ml-auto">
          <li>
            <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
              <Dropdown.Toggle variant={"link"} id="dropdown-basic">
                <i className="icon feather icon-settings" />
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight className="profile-notification">
                <div className="pro-head">
                  <img
                    src={Avatar1}
                    className="img-radius"
                    alt="User Profile"
                  />
                  <span>{user.name}</span>
                  <a
                    href={DEMO.BLANK_LINK}
                    className="dud-logout"
                    title="Logout"
                  ></a>
                </div>
                <ul className="pro-body">
                  <li>
                    <NavLink to="/user/profile">
                      <i className="feather icon-user" /> Profile
                    </NavLink>
                  </li>
                  <li>
                    <a onClick={this.handeLogOut} className="dropdown-item">
                      <i className="feather icon-lock" /> Log out
                    </a>
                  </li>
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </Aux>
    );
  }
  handeLogOut = () => {
    localStorage.removeItem("token");

    window.location = "/auth/signin";
  };
  componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      const user = JwtDecode(token);

      this.setState({ user });
    } catch (error) {
      window.location = "/auth/signin";
    }
  }
}

export default NavRight;
