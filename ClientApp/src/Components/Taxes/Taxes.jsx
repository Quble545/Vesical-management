import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import Services from "../../httpServices/taxServices";
import Pagination from "../Common/Pagination";
import Paginate from "../../Utility/pagination";
import _ from "lodash";
import Theader from "../Common/Theader";
import Row from "./TaxRow";
import JwtDecode from "jwt-decode";

class Taxes extends Component {
  state = {
    Taxes: [],
    pageSize: 10,
    currentPage: 1,
    open: { id: 0, isOpen: false },
    sortColumn: {
      path: "amount",
      order: "asc",
    },
    ths: ["", "Amount", "Area", "Book No.", "Date", ""],
  };

  render() {
    const {
      Taxes: allTaxes,
      currentPage,
      sortColumn,
      pageSize,
      open,
      ths,
    } = this.state;

    const sorted = _.orderBy(allTaxes, [sortColumn.path], [sortColumn.order]);
    const Taxes = Paginate(sorted, pageSize, currentPage);

    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Taxes</Card.Title>
            <p>{allTaxes.length} Taxes are in the database </p>
          </Card.Header>
          <Card.Body>
            <Table responsive hover style={{ color: "#3B3635" }}>
              <Theader
                ths={ths}
                onSort={this.handleSort}
                sortColumn={sortColumn}
              />
              <tbody>
                {Taxes.map((c) => (
                  <Row
                    key={c.id}
                    row={c}
                    open={open}
                    setOpen={this.handleOpenRow}
                    onRedirect={this.handleRedirect}
                  />
                ))}
              </tbody>
            </Table>
            <Pagination
              count={allTaxes.length}
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
    const Taxes = await Services.getAll();
    const token = localStorage.getItem("token");
    const user = JwtDecode(token);

    this.setState({ Taxes, user });
  }
}

export default Taxes;
