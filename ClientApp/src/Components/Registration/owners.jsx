import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import OwnerForm from "../../Components/Registration/ownerForm";
import Services from "../../httpServices/ownerServices";
import { toast } from "react-toastify";
import joi from "joi-browser";
import BootBox from "bootbox-react";
import Pagination from "../Common/Pagination";
import Paginate from "../../Utility/pagination";
import Searching from "../../Utility/ownerFilter";
import _ from "lodash";
import Theader from "../Common/Theader";

class Owners extends Component {
  state = {
    showModal: false,
    showBootBox: false,
    owners: [],
    owner: { id: 0, name: "", phone: "" },
    errors: {},
    deletedOwner: {},
    pageSize: 10,
    currentPage: 1,
    search: "",
    sortColumn: {
      path: "name",
      order: "asc",
    },
    ths: ["Name", "Phone", "Action"],
  };

  schema = {
    id: joi.number().allow(0),
    name: joi.string().min(3).required().label("Name"),
    phone: joi.string().required().label("Phone Number"),
  };

  render() {
    const {
      owners: allOwners,
      owner,
      errors,
      showBootBox,
      deletedOwner,
      currentPage,
      pageSize,
      search,
      sortColumn,
      ths,
    } = this.state;

    const filtered = Searching(allOwners, search);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const owners = Paginate(sorted, pageSize, currentPage);

    return (
      <React.Fragment>
        <BootBox
          show={showBootBox}
          type="confirm"
          message={"Are you sure to delete " + deletedOwner["name"] + "?"}
          onSuccess={() => this.handleDelete(deletedOwner.id)}
          onClose={this.closeBootBox}
          onCancel={this.closeBootBox}
        />
        <OwnerForm
          owner={owner}
          errors={errors}
          show={this.state.showModal}
          onClose={this.closeModal}
          onValidate={this.validate}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
        />
        <Card>
          <Card.Header>
            <Card.Title as="h5">Owners</Card.Title>
            <button
              className="btn btn-primary"
              style={{ float: "right" }}
              onClick={() => this.showModal("new")}
            >
              <i className="feather icon-plus-circle" />
              Add Owner
            </button>
            <p>{filtered.length} owners are in the database </p>
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
                {owners.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
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
  showBootBox = (owner) => {
    this.setState({ showBootBox: true, deletedOwner: owner });
  };
  closeBootBox = () => {
    this.setState({ showBootBox: false });
  };
  handleDelete = async (id) => {
    const owners = [...this.state.owners.filter((c) => c.id !== id)];

    try {
      await Services.delete(id);

      toast.success("Successful deleted");
      this.setState({ owners, showBootBox: false });
    } catch (error) {}
  };
  async componentDidMount() {
    const owners = await Services.getAll();

    this.setState({ owners });
  }
  showModal = async (id) => {
    if (id !== "new") {
      const owner = await Services.getById(id);

      this.setState({ owner });
    }
    this.setState({ showModal: true, id });
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
    const owner = { ...this.state.owner };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = joi.validate(owner, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();

    const owner = { ...this.state.owner };
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      if (owner.id === 0) {
        this.closeModal();
        const data = await Services.post(owner);
        toast.success("Successful registred.");

        const owners = [data, ...this.state.owners];
        this.setState({ owners });
      } else {
        this.closeModal();
        const data = await Services.put(owner.id, owner);
        toast.success("Successful updated.");

        const owners = [
          data,
          ...this.state.owners.filter((c) => c.id !== data.id),
        ];
        this.setState({ owners });
      }

      this.setState({
        owner: { id: 0, name: "", phone: "", email: "", address: "" },
      });
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  handleChange = ({ currentTarget: input }) => {
    const owner = { ...this.state.owner };
    owner[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ owner, errors });
  };
}

export default Owners;
