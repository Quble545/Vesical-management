import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import Services from "../../httpServices/visaServices";
import Pagination from "../Common/Pagination";
import Paginate from "../../Utility/pagination";
import _ from "lodash";
import Theader from "../Common/Theader";
import Row from "./visaRow";
import Select from "react-select";
import CustomerServices from "../../httpServices/ownerServices";
import SupplierServices from "../../httpServices/supplierServices";
import Filter from "../../Utility/filterTickets";
import JwtDecode from "jwt-decode";

class Tickets extends Component {
  state = {
    visas: [],
    customers: [],
    suppliers: [],
    pageSize: 10,
    currentPage: 1,
    user: "",
    open: { id: 0, isOpen: false },
    search: { customer: "All", supplier: "All", start: "", end: "" },
    sortColumn: {
      path: "customer",
      order: "asc",
    },
    ths: [
      "",
      "Customer",
      "Supplier",
      "Payment",
      "Country",
      "Price",
      "CMN",
      "Date",
      "",
    ],
  };

  render() {
    const {
      visas: allVisas,
      currentPage,
      sortColumn,
      suppliers,
      customers,
      pageSize,
      search,
      open,
      user,
      ths,
    } = this.state;

    const filtered = Filter(allVisas, search);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const visas = Paginate(sorted, pageSize, currentPage);

    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Visas</Card.Title>
            <div className="row">
              <div className="col-3">
                <label>Customers</label>
                <Select
                  value={customers
                    .map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))
                    .filter((c) => c.label === search.customer)}
                  onChange={(e) =>
                    this.onChange({ name: "customer", value: e.label })
                  }
                  options={customers.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                />
              </div>
              <div className="col-3">
                <label>Suppliers</label>
                <Select
                  value={suppliers
                    .map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))
                    .filter((p) => p.label === search.supplier)}
                  onChange={(e) =>
                    this.onChange({ name: "supplier", value: e.label })
                  }
                  options={suppliers.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
                />
              </div>
              <div className="col-3">
                <label>Start date</label>
                <input
                  onChange={(e) =>
                    this.onChange({
                      name: "start",
                      value: e.currentTarget.value,
                    })
                  }
                  value={search.start}
                  name="start"
                  type="date"
                  className="form-control"
                />
              </div>
              <div className="col-3">
                <label>End date</label>
                <input
                  name="end"
                  onChange={(e) =>
                    this.onChange({
                      name: "end",
                      value: e.currentTarget.value,
                    })
                  }
                  value={search.end}
                  type="date"
                  className="form-control"
                />
              </div>
            </div>
            <p>{filtered.length} visas are in the database </p>
          </Card.Header>
          <Card.Body>
            <Table responsive hover style={{ color: "#3B3635" }}>
              <Theader
                ths={ths}
                onSort={this.handleSort}
                sortColumn={sortColumn}
              />
              <tbody>
                {visas.map((c) => (
                  <Row
                    user={user}
                    key={c.name}
                    row={c}
                    open={open}
                    setOpen={this.handleOpenRow}
                    onRedirect={this.handleRedirect}
                  />
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
  onChange = (input) => {
    const search = { ...this.state.search };
    search[input.name] = input.value;

    this.setState({ search });
  };
  handleOpenRow = (input) => {
    const open = { ...this.state.open };

    if (open.id === input.id) {
      open.isOpen = !open.isOpen;
    } else {
      open.id = input.id;
      open.isOpen = true;
    }

    this.setState({ open });
  };
  handleRedirect = (id) => {
    this.props.history.push("/visaForm/" + id);
  };
  handleDate = (date) => {
    let d = new Date(date);

    return d.toLocaleDateString();
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
  handlePagination = (currentPage) => {
    this.setState({ currentPage });
  };
  async componentDidMount() {
    const visas = await Services.getAll();
    const customers = await CustomerServices.getAll();
    const suppliers = await SupplierServices.getAll();
    const token = localStorage.getItem("token");
    const user = JwtDecode(token);

    customers.unshift({ id: "", name: "All" });
    suppliers.unshift({ id: "", name: "All" });

    this.setState({ visas, customers, suppliers, user });
  }
}

export default Tickets;
