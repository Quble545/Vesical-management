import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import UserForm from "../../Components/Registration/userForm";
import Services from "../../httpServices/userServices";
import { toast } from "react-toastify";
import joi from "joi-browser";
import BootBox from "bootbox-react";
import Pagination from "../Common/Pagination";
import Paginate from "../../Utility/pagination";
import Searching from "../../Utility/searchUsers";
import _ from "lodash";
import Theader from "../Common/Theader";
import JwtDecode from "jwt-decode";

class Users extends Component {
  state = {
    showModal: false,
    showBootBox: false,
    users: [],
    user: {
      id: 0,
      name: "",
      username: "",
      password: "",
    },
    errors: {},
    deletedUser: {},
    pageSize: 10,
    currentPage: 1,
    search: "",
    sortColumn: {
      path: "name",
      order: "asc",
    },
    ths: ["Name", "Username", ""],
  };

  schema = {
    id: joi.number().allow(0),
    name: joi.string().min(3).required().label("Name"),
    username: joi.string().required().label("Username"),
    password: joi.string().required().label("Password"),
  };

  render() {
    const {
      users: allUsers,
      user,
      errors,
      showBootBox,
      deletedUser,
      currentPage,
      pageSize,
      search,
      sortColumn,
      ths,
    } = this.state;

    const filtered = Searching(allUsers, search);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const users = Paginate(sorted, pageSize, currentPage);

    return (
      <React.Fragment>
        <BootBox
          show={showBootBox}
          type="confirm"
          message={"Are you sure to delete " + deletedUser["name"] + "?"}
          onSuccess={() => this.handleDelete(deletedUser.id)}
          onClose={this.closeBootBox}
          onCancel={this.closeBootBox}
        />
        <UserForm
          user={user}
          errors={errors}
          show={this.state.showModal}
          onClose={this.closeModal}
          onValidate={this.validate}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onSelect={this.handleChangeOnSelect}
        />
        <Card>
          <Card.Header>
            <Card.Title as="h5">Users</Card.Title>
            <button
              className="btn btn-primary"
              style={{ float: "right" }}
              onClick={() => this.showModal("new")}
            >
              <i className="feather icon-plus-circle" />
              Add User
            </button>
            <p>{filtered.length} users are in the database </p>
            <input
              value={search}
              onChange={this.handleSearch}
              className="form-control float-right"
              style={{ float: "right", width: 165 }}
              placeholder="Search"
            />
          </Card.Header>
          <Card.Body>
            <Table responsive hover style={{ color: "#3B3635" }}>
              <Theader
                ths={ths}
                onSort={this.handleSort}
                sortColumn={sortColumn}
              />
              <tbody>
                {users.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.username}</td>
                    <td>
                      <a onClick={() => this.showModal(c.id)}>
                        <i
                          className="feather icon-edit"
                          style={{ fontSize: 20, color: "blue" }}
                        />
                      </a>
                      <a className="ml-2" onClick={() => this.showBootBox(c)}>
                        <i
                          className="feather icon-trash"
                          style={{ fontSize: 20, color: "red" }}
                        />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              count={filtered.length}
              onPagination={this.handlePagination}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
  handleSort = (path) => {
    const sortColumn = { ...this.state.sortColumn };

    if (sortColumn.path === path.toLocaleLowerCase()) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path.toLocaleLowerCase();
      sortColumn.order = "asc";
    }

    this.setState({ sortColumn });
  };
  handleSearch = ({ currentTarget: input }) => {
    this.setState({ search: input.value.toLocaleLowerCase() });
  };
  handlePagination = (currentPage) => {
    this.setState({ currentPage });
  };
  showBootBox = (user) => {
    this.setState({ showBootBox: true, deletedUser: user });
  };
  closeBootBox = () => {
    this.setState({ showBootBox: false });
  };
  handleDelete = async (id) => {
    const users = [...this.state.users.filter((c) => c.id !== id)];

    try {
      await Services.delete(id);

      toast.success("Successful deleted");
      this.setState({ users, showBootBox: false });
    } catch (error) {}
  };
  async componentDidMount() {
    const data = await Services.getAll();
    const token = localStorage.getItem("token");
    const user = JwtDecode(token);
    const users = data.filter((u) => u.id != user.id);

    this.setState({ users });
  }
  showModal = async (id) => {
    if (id !== "new") {
      const user = await Services.getById(id);

      this.setState({ user });
    }
    this.setState({ showModal: true });
  };
  closeModal = () => {
    this.setState({ showModal: false });
  };
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

    const originUser = { ...this.state.user };
    const user = { ...this.state.user };
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      if (user.id === 0) {
        this.closeModal();
        const data = await Services.post(user);
        toast.success("Successful registred.");

        const users = [data, ...this.state.users];
        this.setState({ users });
      } else {
        this.closeModal();
        const data = await Services.put(user.id, user);
        toast.success("Successful updated.");

        const users = [
          data,
          ...this.state.users.filter((c) => c.id !== data.id),
        ];

        this.setState({ users });
      }

      this.setState({
        user: {
          id: 0,
          name: "",
          username: "",
          roleId: "",
          role: "",
          phone: "",
        },
      });
    } catch (error) {
      if (error.response.status === 400 && error.response.data) {
        const errors = { ...this.state.errors };
        errors["username"] = error.response.data;
        this.setState({ showModal: true, errors });
      } else {
        toast.error("Something went wrong.");
      }
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

  handleChangeOnSelect = (input) => {
    const user = { ...this.state.user };
    user[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ user, errors });
  };
}

export default Users;
