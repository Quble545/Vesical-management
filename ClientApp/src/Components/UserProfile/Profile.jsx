import React, { Component } from "react";
import Services from "../../httpServices/userServices";
import jwtDecode from "jwt-decode";
import { Card } from "react-bootstrap";
import joi from "joi-browser";
import { toast } from "react-toastify";
import Auth from "../../httpServices/authentication";

class Profile extends Component {
  state = {
    user: {
      id: 0,
      name: "",
      username: "",
      roleId: "",
      role: "",
      phone: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    id: joi.number().allow(0),
    name: joi.string().min(3).required().label("Name"),
    username: joi.string().required().label("Username"),
    phone: joi.string().required().label("Phone"),
    roleId: joi.number().required().label("Role"),
    role: joi.any(),
    password: joi.string().required().label("Password"),
  };

  render() {
    const { user, errors } = this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
        </Card.Header>
        <form onSubmit={this.handleSubmit}>
          <Card.Body>
            <div className="row form-group">
              <div className="col-6">
                <label htmlFor="name">Name</label>
                <input
                  onChange={this.handleChange}
                  value={user.name}
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                />
                {errors["name"] && (
                  <div className="text-danger">{errors["name"]}</div>
                )}
              </div>
              <div className="col-6">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  onChange={this.handleChange}
                  value={user.phone}
                  type="text"
                  className="form-control"
                />
                {errors["phone"] && (
                  <div className="text-danger">{errors["phone"]}</div>
                )}
              </div>
            </div>
            <div className="row form-group">
              <div className="col-6">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  value={user.username}
                  disabled={true}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="col-6">
                <label htmlFor="role">Role</label>
                <input
                  id="role"
                  name="role"
                  value={user.role.name}
                  disabled={true}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-12">
                <label htmlFor="password">Password</label>
                <input
                  value={user.password}
                  onChange={this.handleChange}
                  name="password"
                  id="password"
                  type="text"
                  className="form-control"
                />
                {errors["password"] && (
                  <div className="text-danger">{errors["password"]}</div>
                )}
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={this.validate()}
              >
                Save changes
              </button>
            </div>
          </Card.Footer>
        </form>
      </Card>
    );
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    const { id } = jwtDecode(token);
    const user = await Services.getById(id);

    this.setState({ user });
  }

  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schem = { [input.name]: this.schema[input.name] };
    const { error } = joi.validate(obj, schem);

    if (!error) return null;

    return error.details[0].message;
  };
  validate = () => {
    const user = { ...this.state.user };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = joi.validate(user, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();

    const user = { ...this.state.user };
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      const data = await Services.put(user.id, user);
      const { token } = await Auth.authorize(user);

      localStorage.removeItem("token");
      localStorage.setItem("token", token);

      window.location = "/";
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  handleChange = ({ currentTarget: input }) => {
    const user = { ...this.state.user };
    user[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ user, errors });
  };
}

export default Profile;
