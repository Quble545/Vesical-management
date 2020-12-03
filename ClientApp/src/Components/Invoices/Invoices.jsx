import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import Services from "../../httpServices/invoicesServices";
import Pagination from "../Common/Pagination";
import Paginate from "../../Utility/pagination";
import _ from "lodash";
import Theader from "../Common/Theader";
import Row from "./InvoiceRow";
import Select from "react-select";
import CustomerServices from "../../httpServices/ownerServices";
import Filter from "../../Utility/searchInvoice";

class Invoices extends Component {
  state = {
    invoices: [],
    customers: [],
    type: [
      { id: "", name: "All" },
      { id: 0, name: "Ticket" },
      { id: 1, name: "Visa" },
    ],
    pageSize: 10,
    currentPage: 1,
    open: { id: 0, isOpen: false },
    subOpen: { id: 0, isOpen: false },
    search: { customer: "All", type: "All", start: "", end: "" },
    sortColumn: {
      path: "customer",
      order: "asc",
    },
    ths: ["", "Customer", "Amount", "Type", "Date", ""],
  };

  render() {
    const {
      invoices: allInvoices,
      currentPage,
      sortColumn,
      type,
      customers,
      pageSize,
      search,
      subOpen,
      open,
      ths,
    } = this.state;

    const filtered = Filter(allInvoices, search);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const invoices = Paginate(sorted, pageSize, currentPage);

    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Invoices</Card.Title>
            <div className="row">
              <div className="col-3">
                <label>Customer</label>
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
                <label>Type</label>
                <Select
                  value={type
                    .map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))
                    .filter((p) => p.label === search.type)}
                  onChange={(e) =>
                    this.onChange({ name: "type", value: e.label })
                  }
                  options={type.map((s) => ({
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
            <p>{filtered.length} invoices are in the database </p>
          </Card.Header>
          <Card.Body>
            <Table responsive hover style={{ color: "#3B3635" }}>
              <Theader
                ths={ths}
                onSort={this.handleSort}
                sortColumn={sortColumn}
              />
              <tbody>
                {invoices.map((c) => (
                  <Row
                    key={c.name}
                    row={c}
                    open={open}
                    setOpen={this.handleOpenRow}
                    SubOpen={subOpen}
                    SubSetOpen={this.handleSubOpenRow}
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

  handleSubOpenRow = (input) => {
    const subOpen = { ...this.state.subOpen };

    if (subOpen.id === input.id) {
      subOpen.isOpen = !subOpen.isOpen;
    } else {
      subOpen.id = input.id;
      subOpen.isOpen = true;
    }

    this.setState({ subOpen });
  };
  handleRedirect = (id) => {
    this.props.history.push("/ticketForm/" + id);
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
    const invoices = await Services.getAll();
    const customers = await CustomerServices.getAll();
    const token = localStorage.getItem("token");
    customers.unshift({ id: "", name: "All" });

    this.setState({ invoices, customers });
  }
}

export default Invoices;
