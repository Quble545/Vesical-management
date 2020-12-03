import React from "react";
import "../../assets/scss/style.scss";
import Aux from "../../hoc/_Aux";
import Breadcrumb from "../../App/layout/AdminLayout/Breadcrumb";
import Joi from "joi-browser";
import Authentication from "../../httpServices/authentication";

class SignUp extends React.Component {
  state = {
    user: { username: "", password: "" },
    errors: "",
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  render() {
    const { user, errors } = this.state;
    return (
      <Aux>
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <div className="auth-bg">
              <span className="r" />
              <span className="r s" />
              <span className="r s" />
              <span className="r" />
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-4">
                  <i className="feather icon-unlock auth-icon" />
                </div>
                <h3 className="mb-4">Sign in</h3>
                {errors && (
                  <div className="text-danger">
                    Invalid username or password
                  </div>
                )}
                <form onSubmit={this.handleSubmit}>
                  <div className="input-group mb-3">
                    <input
                      value={user.username}
                      onChange={this.handleOnChange}
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Username"
                    />
                  </div>
                  <div className="input-group mb-4">
                    <input
                      value={user.password}
                      onChange={this.handleOnChange}
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={this.validate()}
                    className="btn btn-primary shadow-2 mb-4"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Aux>
    );
  }

  handleOnChange = ({ currentTarget: input }) => {
    const user = { ...this.state.user };
    user[input.name] = input.value;

    this.setState({ user });
  };
  validate = () => {
    const user = { ...this.state.user };
    const option = { abortEarly: false };
    const errors = {};
    const { error } = Joi.validate(user, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const user = { ...this.state.user };
    const errors = this.validate();

    this.setState({ errors: errors });

    if (errors) return;

    try {
      const data = await Authentication.authorize(user);
      localStorage.setItem("token", data.token);

      window.location = "/";
    } catch (error) {
      if (error.response.status === 400 && error.response.data) {
        const errors = { ...this.state.errors };
        errors["username"] = error.response.data;

        this.setState({ errors });
      }
    }
  };
}

export default SignUp;
