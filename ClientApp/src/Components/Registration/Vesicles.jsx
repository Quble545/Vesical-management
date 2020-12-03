import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import VesicleForm from "../Registration/vesiclesForm";
import Services from "../../httpServices/vesicleServices";
import OwnerServices from "../../httpServices/ownerServices";
import { toast } from "react-toastify";
import joi from "joi-browser";
import BootBox from "bootbox-react";
import Pagination from "./../Common/Pagination";
import Paginate from "../../Utility/pagination";
import _ from "lodash";
import Searching from "../../Utility/vesicleFilter";
import Theader from "../Common/Theader";
import OwnerForm from "../Registration/newOwner";

class Vesicles extends Component {
  state = {
    showModal: false,
    showBootBox: false,
    vesicles: [],
    owners: [],
    show: false,
    vesicle: {
      id: 0,
      plateNo: "",
      type: "",
      hp: "",
      ownerId: "",
      owner: "",
    },
    errors: {},
    deletedVesicle: {},
    pageSize: 10,
    currentPage: 1,
    search: "",
    sortColumn: {
      path: "name",
      order: "asc",
    },
    ths: ["Owner", "PLate No.", "Type", "Hp", "Action"],
  };

  schema = {
    id: joi.number().allow(0),
    plateNo: joi.string().min(3).required().label("PLate No."),
    type: joi.string().required().label("Type"),
    hp: joi.string().required().label("Hp"),
    ownerId: joi.number().required().label("Owner"),
    owner: joi.any().allow(""),
  };

  render() {
    const {
      vesicles: allVesicles,
      vesicle,
      errors,
      showBootBox,
      deletedVesicle,
      currentPage,
      pageSize,
      search,
      sortColumn,
      owners,
      show,
      ths,
    } = this.state;

    const filtered = Searching(allVesicles, search);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const vesicles = Paginate(sorted, pageSize, currentPage);

    return (
      <React.Fragment>
        <BootBox
          show={showBootBox}
          type="confirm"
          message={"Are you sure to delete " + deletedVesicle["plateNo"] + "?"}
          onSuccess={() => this.handleDelete(deletedVesicle.id)}
          onClose={this.closeBootBox}
          onCancel={this.closeBootBox}
        />
        <OwnerForm
          show={show}
          onClose={this.closeModel}
          onPapulate={this.papulateNewCustomer}
        />
        <VesicleForm
          vesicle={vesicle}
          owners={owners}
          errors={errors}
          show={this.state.showModal}
          onClose={this.closeModal}
          onValidate={this.validate}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          showModal={this.showModel}
        />
        <Card>
          <Card.Header>
            <Card.Title as="h5">Vesicles</Card.Title>
            <button
              className="btn btn-primary"
              style={{ float: "right" }}
              onClick={() => this.showModal("new")}
            >
              <i className="feather icon-plus-circle" />
              Add Vesicle
            </button>
            <p>{filtered.length} vesicles are in the database </p>
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
                {vesicles.map((c) => (
                  <tr key={c.id}>
                    <td>{c.owner.name}</td>
                    <td>{c.plateNo}</td>
                    <td>{c.type}</td>
                    <td>{c.hp}</td>
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

  papulateNewCustomer = (owner) => {
    const owners = [owner, ...this.state.owners];
    const vesicle = { ...this.state.vesicle };
    vesicle.ownerId = owner.id;

    this.setState({ owners, vesicle });
  };
  showModel = () => {
    this.setState({ show: true, showModal: false });
  };
  closeModel = () => {
    this.setState({ show: false, showModal: true });
  };
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
  showBootBox = (vesicle) => {
    this.setState({ showBootBox: true, deletedVesicle: vesicle });
  };
  closeBootBox = () => {
    this.setState({ showBootBox: false });
  };
  handleDelete = async (id) => {
    const vesicles = [...this.state.vesicles.filter((c) => c.id !== id)];

    try {
      await Services.delete(id);

      toast.success("Successful deleted");
      this.setState({ vesicles, showBootBox: false });
    } catch (error) {}
  };
  async componentDidMount() {
    const vesicles = await Services.getAll();
    const owners = await OwnerServices.getAll();

    this.setState({ vesicles, owners });
  }
  showModal = async (id) => {
    if (id !== "new") {
      const vesicle = await Services.getById(id);
      delete vesicle.date;

      this.setState({ vesicle });
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
    const vesicle = { ...this.state.vesicle };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = joi.validate(vesicle, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();

    const vesicle = { ...this.state.vesicle };
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      if (vesicle.id === 0) {
        this.closeModal();
        vesicle.owner = null;
        const data = await Services.post(vesicle);
        toast.success("Successful registred.");

        const vesicles = [data, ...this.state.vesicles];
        this.setState({ vesicles });
      } else {
        this.closeModal();
        const data = await Services.put(vesicle.id, vesicle);
        console.log(data);
        toast.success("Successful updated.");

        const vesicles = [
          data,
          ...this.state.vesicles.filter((c) => c.id !== data.id),
        ];
        this.setState({ vesicles });
      }

      this.setState({
        vesicle: {
          id: 0,
          name: "",
          phone: "",
          mobile: "",
          email: "",
          address: "",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };
  handleChange = ({ currentTarget: input }) => {
    const vesicle = { ...this.state.vesicle };
    vesicle[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ vesicle, errors });
  };

  handleSelect = (input) => {
    const vesicle = { ...this.state.vesicle };
    vesicle[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ vesicle, errors });
  };
}

export default Vesicles;
