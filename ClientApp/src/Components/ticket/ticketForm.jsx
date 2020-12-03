import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
import Button from "../Common/Button";
import Select from "react-select";
import CustomerServices from "../../httpServices/customerServices";
import SupplierServices from "../../httpServices/supplierServices";
import CityServices from "../../httpServices/cityServices";
import BankAccountsServices from "../../httpServices/bankServices";
import Fontawesome from "react-fontawesome";
import Joi from "joi-browser";
import NewCustomer from "./newCustomer";
import Services from "../../httpServices/ticketServices";
import { toast } from "react-toastify";

class TicketForm extends Component {
  state = {
    customers: [],
    suppliers: [],
    cities: [],
    bankAccounts: [],
    ticket: {
      id: 0,
      date: this.dateNow(),
      customerId: "",
      paymentMethodId: "",
      bankAccountId: "",
      amount: "",
      supplierId: "",
      ticketTypeId: "",
      from: "",
      to: "",
      price: "",
      commission: "",
      passengers: [],
    },
    show: false,
    errors: {},
    passengerErrors: {},
    passenger: { id: 0, name: "", reservation: "", departure: "", return: "" },
    paymentMethod: [
      { label: "Credit", value: 1 },
      { label: "Cash", value: 2 },
    ],
    ticketType: [
      { label: "Domestic", value: 1 },
      { label: "International", value: 2 },
    ],
  };
  schema = {
    id: Joi.number().allow(),
    date: Joi.date().required().label("Date"),
    customerId: Joi.number().required().label("Customer"),
    paymentMethodId: Joi.number().required().label("Payment method"),
    bankAccountId: Joi.number().when("amount", {
      is: "",
      then: Joi.allow(""),
      otherwise: Joi.required(),
    }),
    amount: Joi.number().max(10000).min(1).allow(""),
    supplierId: Joi.number().required().label("Supplier"),
    ticketTypeId: Joi.number().required().label("Ticket type"),
    from: Joi.number().required().label("From city"),
    to: Joi.number().required().label("To city"),
    price: Joi.number().max(10000).min(0).required().label("Price"),
    commission: Joi.number().max(1000).min(0).required().label("Commission"),
    passengers: Joi.array().min(1).required(),
  };
  passengerSchema = {
    id: Joi.number().allow(),
    name: Joi.string().min(3).required().label("Name"),
    reservation: Joi.string().required().label("Reservation"),
    departure: Joi.date().required().label("Departure date"),
    return: Joi.date().allow(""),
  };

  render() {
    const {
      customers,
      paymentMethod,
      suppliers,
      cities,
      ticketType,
      passenger,
      bankAccounts,
      ticket,
      errors,
      passengerErrors,
      show,
    } = this.state;

    return (
      <React.Fragment>
        <NewCustomer
          show={show}
          onClose={this.closeModel}
          onPapulate={this.papulateNewCustomer}
        />
        <Card>
          <Card.Header>
            <Card.Title as="h5">
              {ticket.id === 0 ? "New Ticket" : "Update Ticket"}
            </Card.Title>
          </Card.Header>
          <form onSubmit={this.handleSubmit}>
            <Card.Body>
              <div className="row form-group">
                <div className="col-4">
                  <label>Date</label>
                  <input
                    value={ticket.date}
                    onChange={(e) =>
                      this.onChange({
                        name: "date",
                        value: e.currentTarget.value,
                      })
                    }
                    type="date"
                    className="form-control"
                  />
                  {errors["date"] && (
                    <div className="text-danger">{errors["date"]}</div>
                  )}
                </div>
                <div className="col-4 div">
                  <label>
                    Customer <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="customerId"
                    value={customers
                      .map((c) => ({
                        label: c.name,
                        value: c.id,
                      }))
                      .filter((c) => c.value === ticket.customerId)}
                    onChange={(e) =>
                      this.onChange({ name: "customerId", value: e.value })
                    }
                    options={customers.map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))}
                  />
                  {errors["customerId"] && (
                    <div className="text-danger">"Customer" is required.</div>
                  )}
                  <div className="text-primary">
                    <i className="feather icon-plus-circle" name="plus" />
                    <a onClick={this.showModel}>New Customer</a>
                  </div>
                </div>
                <div className="col-4 div">
                  <label>
                    Payment method <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="paymentMethodId"
                    value={paymentMethod.filter(
                      (p) => p.value == ticket.paymentMethodId
                    )}
                    onChange={(e) =>
                      this.onChange({ name: "paymentMethodId", value: e.value })
                    }
                    options={paymentMethod}
                  />
                  {errors["paymentMethodId"] && (
                    <div className="text-danger">
                      "Payment method" is requied.
                    </div>
                  )}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-6">
                  <label>Account</label>
                  <Select
                    name="bankAccountId"
                    value={bankAccounts
                      .map((b) => ({
                        label: b.bank + " (" + b.account + ")",
                        value: b.id,
                      }))
                      .filter((b) => b.value === ticket.bankAccountId)}
                    onChange={(e) =>
                      this.onChange({ name: "bankAccountId", value: e.value })
                    }
                    options={bankAccounts.map((b) => ({
                      label: b.bank + " (" + b.account + ")",
                      value: b.id,
                    }))}
                  />
                  {errors["bankAccountId"] && (
                    <div className="text-danger">"Account" is required.</div>
                  )}
                </div>
                <div className="col-6">
                  <label>Amount</label>
                  <input
                    name="amount"
                    value={ticket.amount}
                    onChange={({ currentTarget: input }) =>
                      this.onChange({ name: input.name, value: input.value })
                    }
                    type="text"
                    className="form-control"
                    placeholder="$0.00"
                  />
                  {errors["amount"] && (
                    <div className="text-danger">{errors["amount"]}</div>
                  )}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-6">
                  <label>
                    Supplier <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="supplierId"
                    value={suppliers
                      .map((s) => ({
                        label: s.name,
                        value: s.id,
                      }))
                      .filter((p) => p.value === ticket.supplierId)}
                    onChange={(e) =>
                      this.onChange({ name: "supplierId", value: e.value })
                    }
                    options={suppliers.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))}
                  />
                  {errors["supplierId"] && (
                    <div className="text-danger">"Supplier" is required.</div>
                  )}
                </div>
                <div className="col-6">
                  <label>
                    Ticket type <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="ticketTypeId"
                    value={ticketType.filter(
                      (f) => f.value === ticket.ticketTypeId
                    )}
                    onChange={(e) =>
                      this.onChange({ name: "ticketTypeId", value: e.value })
                    }
                    options={ticketType}
                  />
                  {errors["ticketTypeId"] && (
                    <div className="text-danger">
                      "Ticket type" is required.
                    </div>
                  )}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-6">
                  <label>
                    From city <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="from"
                    value={cities
                      .map((s) => ({
                        label: s.name + " (" + s.code + ")",
                        value: s.id,
                      }))
                      .filter((c) => c.value === ticket.from)}
                    onChange={(e) =>
                      this.onChange({ name: "from", value: e.value })
                    }
                    options={cities.map((s) => ({
                      label: s.name + " (" + s.code + ")",
                      value: s.id,
                    }))}
                  />
                  {errors["from"] && (
                    <div className="text-danger">"From city" is required.</div>
                  )}
                </div>
                <div className="col-6">
                  <label>
                    To city <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="to"
                    value={cities
                      .map((s) => ({
                        label: s.name + " (" + s.code + ")",
                        value: s.id,
                      }))
                      .filter((p) => p.value === ticket.to)}
                    onChange={(e) =>
                      this.onChange({ name: "to", value: e.value })
                    }
                    options={cities.map((s) => ({
                      label: s.name + " (" + s.code + ")",
                      value: s.id,
                    }))}
                  />
                  {errors["to"] && (
                    <div className="text-danger">"To city" is required.</div>
                  )}
                </div>
                <div className="6"></div>
              </div>
              <div className="row form-group">
                <div className="col-6">
                  <label>
                    Price <span className="text-danger">*</span>
                  </label>
                  <input
                    name="price"
                    value={ticket.price}
                    onChange={({ currentTarget: input }) =>
                      this.onChange({ name: input.name, value: input.value })
                    }
                    type="text"
                    className="form-control"
                    placeholder="$0.00"
                  />
                  {errors["price"] && (
                    <div className="text-danger">{errors["price"]}</div>
                  )}
                </div>
                <div className="col-6">
                  <label>
                    Commission <span className="text-danger">*</span>
                  </label>
                  <input
                    name="commission"
                    value={ticket.commission}
                    onChange={({ currentTarget: input }) =>
                      this.onChange({ name: input.name, value: input.value })
                    }
                    type="text"
                    className="form-control"
                    placeholder="$0.00"
                  />
                  {errors["commission"] && (
                    <div className="text-danger">{errors["commission"]}</div>
                  )}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-3">
                  <label>Passenger name</label>
                  <input
                    name="name"
                    value={passenger.name}
                    onChange={this.passangerOnChange}
                    type="text"
                    className="form-control"
                  />
                  {passengerErrors["name"] && (
                    <div className="text-danger">{passengerErrors["name"]}</div>
                  )}
                </div>
                <div className="col-2">
                  <label>Reservation No</label>
                  <input
                    name="reservation"
                    value={passenger.reservation}
                    onChange={this.passangerOnChange}
                    type="text"
                    className="form-control"
                  />
                  {passengerErrors["reservation"] && (
                    <div className="text-danger">
                      {passengerErrors["reservation"]}
                    </div>
                  )}
                </div>
                <div className="col-3">
                  <label>Departure date</label>
                  <input
                    name="departure"
                    value={passenger.departure}
                    onChange={this.passangerOnChange}
                    type="date"
                    className="form-control"
                  />
                  {passengerErrors["departure"] && (
                    <div className="text-danger">
                      {passengerErrors["departure"]}
                    </div>
                  )}
                </div>
                <div className="col-3">
                  <label>Return date</label>
                  <input
                    name="return"
                    value={passenger.return}
                    onChange={this.passangerOnChange}
                    type="date"
                    className="form-control"
                  />
                  {passengerErrors["return"] && (
                    <div className="text-danger">
                      {passengerErrors["return"]}
                    </div>
                  )}
                </div>
                <div className="col-1">
                  <label className="text-white">Add</label>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleAddRow}
                    disabled={this.validatePassenger()}
                  >
                    <Fontawesome className="fas fa-plus-circle" name="plus" />
                  </button>
                </div>
              </div>
              {ticket.passengers.length !== 0 ? (
                <div className="row form-group">
                  <Table>
                    <thead>
                      <tr>
                        <th>Passenger name</th>
                        <th>Reservation No.</th>
                        <th>Departure date</th>
                        <th>Return date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticket.passengers.map((p) => (
                        <tr key={p.name}>
                          <td>{p.name}</td>
                          <td>{p.reservation}</td>
                          <td>{p.departure}</td>
                          <td>{p.return}</td>
                          <td>
                            <a
                              onClick={() => this.handleEditPassenger(p.name)}
                              style={{ fontSize: 20, color: "blue" }}
                            >
                              <Fontawesome
                                className="fas fa-edit"
                                name="edit"
                              />
                            </a>
                            <a
                              className="ml-3"
                              onClick={() => this.handleRemoveRow(p)}
                              style={{ fontSize: 20, color: "red" }}
                            >
                              <Fontawesome
                                className="fas fa-trash"
                                name="trash"
                              />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                ""
              )}
            </Card.Body>
            <Card.Footer>
              <div className="text-center">
                <Button
                  name="Save"
                  type="submit"
                  color="primary"
                  disabled={this.validate()}
                />
              </div>
            </Card.Footer>
          </form>
        </Card>
      </React.Fragment>
    );
  }
  handleEditPassenger = (name) => {
    const ticket = { ...this.state.ticket };
    const passenger = ticket.passengers.find((p) => p.name === name);
    ticket.passengers = ticket.passengers.filter((p) => p.name !== name);

    this.setState({ passenger, ticket });
  };
  papulateNewCustomer = (customer) => {
    const customers = [customer, ...this.state.customers];
    const ticket = { ...this.state.ticket };
    ticket.customerId = customer.id;

    this.setState({ customers, ticket });
  };
  showModel = () => {
    this.setState({ show: true });
  };
  closeModel = () => {
    this.setState({ show: false });
  };
  validatePropertyPassenger = (input) => {
    const obj = { [input.name]: input.value };
    const schemo = { [input.name]: this.passengerSchema[input.name] };
    const { error } = Joi.validate(obj, schemo);

    if (!error) return null;

    return error.details[0].message;
  };
  validatePassenger = () => {
    const passenger = { ...this.state.passenger };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = Joi.validate(passenger, this.passengerSchema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  validateOnProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schemo = { [input.name]: this.schema[input.name] };
    const { error } = Joi.validate(obj, schemo);

    if (!error) return null;

    return error.details[0].message;
  };
  validate = () => {
    const ticket = { ...this.state.ticket };
    const option = { abortEarly: false };
    const { error } = Joi.validate(ticket, this.schema, option);
    const errors = {};

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();

    const ticket = { ...this.state.ticket };
    const originalTicket = { ...ticket };
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    ticket.bankAccountId =
      ticket.bankAccountId === "" ? 0 : ticket.bankAccountId;

    ticket.amount = ticket.amount === "" ? 0 : parseInt(ticket.amount);
    ticket.commission = parseInt(ticket.commission);
    ticket.price = parseInt(ticket.price);
    ticket.passengers.map((p) => {
      p.return === "" ? (p.return = null) : (p.return = p.return);

      return p;
    });

    try {
      this.setState({
        ticket: {
          id: 0,
          date: this.dateNow(),
          customerId: "",
          paymentMethodId: "",
          bankAccountId: "",
          amount: "",
          supplierId: "",
          ticketTypeId: "",
          from: "",
          to: "",
          price: "",
          commission: "",
          passengers: [],
        },
        passengers: [],
      });

      if (ticket.id === 0) {
        const { data } = await Services.post(ticket);
        toast.success("Operation Success!");
      } else {
        ticket.bankAccountId = 0;
        ticket.amount = 0;

        const { data } = await Services.put(ticket.id, ticket);
        toast.success("Successfuly updated.");

        this.props.history.push("/reports/Tickets");
      }
    } catch (errors) {
      toast.error("Something went wrong");

      this.setState({ ticket: originalTicket });
    }
  };
  dateNow(input) {
    if (input === undefined) {
      let date = new Date();
      let today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      return today;
    } else {
      let date = new Date(input);
      let d =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      return d;
    }
  }
  onChange = (input) => {
    const ticket = { ...this.state.ticket };
    ticket[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateOnProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ ticket, errors });
  };
  handleRemoveRow = (passenger) => {
    const ticket = { ...this.state.ticket };
    ticket.passengers = ticket.passengers.filter(
      (p) => p.name !== passenger.name
    );

    this.setState({ ticket });
  };
  handleAddRow = () => {
    const passenger = { ...this.state.passenger };
    const passengers = [passenger, ...this.state.ticket.passengers];
    const ticket = { ...this.state.ticket };
    let errors = this.validatePassenger();

    let departure = new Date(passenger.departure);
    let returnDate = new Date(passenger.return);

    if (returnDate <= departure && passenger.return !== "") {
      if (!errors) {
        errors = {
          return: '"Return date" must be greater than departure date',
        };
      } else {
        errors["return"] = '"Return date" must be greater than departure date';
      }
    }

    let p = ticket.passengers.filter((p) =>
      p.name.toLocaleLowerCase().startsWith(passenger.name.toLocaleLowerCase())
    );

    if (p.length !== 0) {
      if (!errors) {
        errors = {
          name: '"Passenger" already exist.',
        };
      } else {
        errors["name"] = '"Passenger" already exist.';
      }
    }

    p = ticket.passengers.filter((p) =>
      p.reservation
        .toLocaleLowerCase()
        .startsWith(passenger.reservation.toLocaleLowerCase())
    );

    if (p.length !== 0) {
      if (!errors) {
        errors = {
          reservation: '"Reservation" already exist.',
        };
      } else {
        errors["reservation"] = '"Reservation" already exist.';
      }
    }

    this.setState({ passengerErrors: errors || {} });

    if (errors) return;

    ticket.passengers = passengers;

    this.setState({
      passengers,
      passenger: {
        id: 0,
        name: "",
        reservation: "",
        departure: passenger.departure,
        return: passenger.return,
      },
      ticket,
    });
  };
  passangerOnChange = ({ currentTarget: input }) => {
    const passenger = { ...this.state.passenger };
    const passengers = [...this.state.ticket.passengers];
    passenger[input.name] = input.value;
    const passengerErrors = { ...this.state.passengerErrors };
    const errorMessage = this.validatePropertyPassenger(input);

    if (errorMessage) passengerErrors[input.name] = errorMessage;
    else delete passengerErrors[input.name];

    if (input.name === "return") {
      let departure = new Date(passenger.departure);
      let returnDate = new Date(passenger.return);

      if (returnDate <= departure && passenger.return !== "") {
        passengerErrors[input.name] =
          '"Return date" must be greater than departure date';
      }
    }

    if (input.name === "name") {
      const p = passengers.filter((p) =>
        p.name.toLocaleLowerCase().startsWith(input.value.toLocaleLowerCase())
      );

      if (p.length !== 0) {
        passengerErrors[input.name] = '"Passenger" already exist.';
      }
    }

    if (input.name === "reservation") {
      const p = passengers.filter((p) =>
        p.reservation
          .toLocaleLowerCase()
          .startsWith(input.value.toLocaleLowerCase())
      );

      if (p.length !== 0) {
        passengerErrors[input.name] = '"Reservation" already exist.';
      }
    }

    this.setState({ passenger, passengerErrors });
  };
  async componentDidMount() {
    let ticket = { ...this.state.ticket };
    const customers = await CustomerServices.getAll();
    const suppliers = await SupplierServices.getAll();
    const cities = await CityServices.getAll();
    const bankAccounts = await BankAccountsServices.getAll();
    const { id } = this.props.match.params;

    if (id !== "new") {
      ticket = await Services.getById(id);
      ticket.date = this.dateNow(ticket.date);
      ticket.to = ticket.toCityId;
      ticket.from = ticket.fromCityId;
      ticket.amount = "";
      ticket.bankAccountId = "";

      delete ticket.toCityId;
      delete ticket.fromCityId;
    }

    this.setState({ customers, suppliers, cities, bankAccounts, ticket });
  }
}

export default TicketForm;
