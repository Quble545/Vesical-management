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
import Services from "../../httpServices/visaServices";
import { toast } from "react-toastify";

class visaForm extends Component {
  state = {
    customers: [],
    suppliers: [],
    cities: [],
    bankAccounts: [],
    visa: {
      id: 0,
      date: this.dateNow(),
      customerId: "",
      paymentMethodId: "",
      bankAccountId: "",
      amount: "",
      supplierId: "",
      country: "",
      price: "",
      commission: "",
      applicants: [],
    },
    show: false,
    errors: {},
    applicantError: {},
    applicant: { id: 0, name: "", visaNumber: "", expiryDate: "" },
    paymentMethod: [
      { label: "Credit", value: 1 },
      { label: "Cash", value: 2 },
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
    country: Joi.string().required().label("Country"),
    price: Joi.number().max(10000).min(0).required().label("Price"),
    commission: Joi.number().max(1000).min(0).required().label("Commission"),
    applicants: Joi.array().min(1).required(),
  };
  applicantschema = {
    id: Joi.number().allow(),
    name: Joi.string().min(3).required().label("Name"),
    visaNumber: Joi.string().required().label("Visa No."),
    expiryDate: Joi.date().allow(""),
  };

  render() {
    const {
      customers,
      paymentMethod,
      suppliers,
      cities,
      applicant,
      bankAccounts,
      visa,
      errors,
      applicantError,
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
              {visa.id === 0 ? "New Visa" : "Update Visa"}
            </Card.Title>
          </Card.Header>
          <form onSubmit={this.handleSubmit}>
            <Card.Body>
              <div className="row form-group">
                <div className="col-4">
                  <label>Date</label>
                  <input
                    value={visa.date}
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
                      .filter((c) => c.value === visa.customerId)}
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
                      (p) => p.value == visa.paymentMethodId
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
                      .filter((b) => b.value === visa.bankAccountId)}
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
                    value={visa.amount}
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
                      .filter((p) => p.value === visa.supplierId)}
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
                  <label>Country</label>
                  <input
                    name="country"
                    value={visa.country}
                    onChange={({ currentTarget: input }) =>
                      this.onChange({ name: input.name, value: input.value })
                    }
                    type="text"
                    className="form-control"
                  />
                  {errors["country"] && (
                    <div className="text-danger">{errors["country"]}</div>
                  )}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-6">
                  <label>
                    Price <span className="text-danger">*</span>
                  </label>
                  <input
                    name="price"
                    value={visa.price}
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
                    value={visa.commission}
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
                <div className="col-5">
                  <label>Passenger name</label>
                  <input
                    name="name"
                    value={applicant.name}
                    onChange={this.passangerOnChange}
                    type="text"
                    className="form-control"
                  />
                  {applicantError["name"] && (
                    <div className="text-danger">{applicantError["name"]}</div>
                  )}
                </div>
                <div className="col-3">
                  <label>Visa No.</label>
                  <input
                    name="visaNumber"
                    value={applicant.visaNumber}
                    onChange={this.passangerOnChange}
                    type="text"
                    className="form-control"
                  />
                  {applicantError["visaNumber"] && (
                    <div className="text-danger">
                      {applicantError["visaNumber"]}
                    </div>
                  )}
                </div>
                <div className="col-3">
                  <label>Expiry date</label>
                  <input
                    name="expiryDate"
                    value={applicant.expiryDate}
                    onChange={this.passangerOnChange}
                    type="date"
                    className="form-control"
                  />
                  {errors["expiryDate"] && (
                    <div className="text-danger">{errors["expiryDate"]}</div>
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
              {visa.applicants.length !== 0 ? (
                <div className="row form-group">
                  <Table>
                    <thead>
                      <tr>
                        <th>Passenger </th>
                        <th>Visa No.</th>
                        <th>Expiry date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visa.applicants.map((p) => (
                        <tr key={p.name}>
                          <td>{p.name}</td>
                          <td>{p.visaNumber}</td>
                          <td>{p.expiryDate}</td>
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
    const visa = { ...this.state.visa };
    const applicant = visa.applicants.find((p) => p.name === name);
    visa.applicants = visa.applicants.filter((p) => p.name !== name);

    this.setState({ applicant, visa });
  };
  papulateNewCustomer = (customer) => {
    const customers = [customer, ...this.state.customers];
    const visa = { ...this.state.visa };
    visa.customerId = customer.id;

    this.setState({ customers, visa });
  };
  showModel = () => {
    this.setState({ show: true });
  };
  closeModel = () => {
    this.setState({ show: false });
  };
  validatePropertyPassenger = (input) => {
    const obj = { [input.name]: input.value };
    const schemo = { [input.name]: this.applicantschema[input.name] };
    const { error } = Joi.validate(obj, schemo);

    if (!error) return null;

    return error.details[0].message;
  };
  validatePassenger = () => {
    const applicant = { ...this.state.applicant };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = Joi.validate(applicant, this.applicantschema, option);

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
    const visa = { ...this.state.visa };
    const option = { abortEarly: false };
    const { error } = Joi.validate(visa, this.schema, option);
    const errors = {};

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();

    const visa = { ...this.state.visa };
    const originalVisa = { ...visa };
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    visa.bankAccountId = visa.bankAccountId === "" ? 0 : visa.bankAccountId;

    visa.amount = visa.amount === "" ? 0 : parseInt(visa.amount);
    visa.commission = parseInt(visa.commission);
    visa.price = parseInt(visa.price);

    try {
      this.setState({
        visa: {
          id: 0,
          date: this.dateNow(),
          customerId: "",
          paymentMethodId: "",
          bankAccountId: "",
          amount: "",
          supplierId: "",
          country: "",
          price: "",
          commission: "",
          visaNumber: "",
          expiryDate: "",
          applicants: [],
        },
      });

      if (visa.id === 0) {
        const { data } = await Services.post(visa);
        toast.success("Operation Success!");
      } else {
        visa.bankAccountId = 0;
        visa.amount = 0;

        const { data } = await Services.put(visa.id, visa);
        toast.success("Successfuly updated.");

        this.props.history.push("/reports/Visas");
      }

      console.log(visa);
    } catch (errors) {
      toast.error("Something went wrong");

      this.setState({ visa: originalVisa });
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
    const visa = { ...this.state.visa };
    visa[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateOnProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ visa, errors });
  };
  handleRemoveRow = (applicant) => {
    const visa = { ...this.state.visa };
    visa.applicants = visa.applicants.filter((p) => p.name !== applicant.name);

    this.setState({ visa });
  };
  handleAddRow = () => {
    const applicant = { ...this.state.applicant };
    const applicants = [applicant, ...this.state.visa.applicants];
    const visa = { ...this.state.visa };
    let errors = this.validatePassenger();

    let p = visa.applicants.filter((p) =>
      p.name.toLocaleLowerCase().startsWith(applicant.name.toLocaleLowerCase())
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

    let v = visa.applicants.filter((p) =>
      p.visaNumber
        .toLocaleLowerCase()
        .startsWith(applicant.visaNumber.toLocaleLowerCase())
    );

    if (v.length !== 0) {
      if (!errors) {
        errors = {
          visaNumber: '"Visa No." already exist.',
        };
      } else {
        errors["visaNumber"] = '"Visa No." already exist.';
      }
    }

    this.setState({ applicantError: errors || {} });

    if (errors) return;

    visa.applicants = applicants;

    this.setState({
      applicant: {
        id: 0,
        name: "",
        visaNumber: "",
        expiryDate: "",
      },
      visa,
    });
  };
  passangerOnChange = ({ currentTarget: input }) => {
    const applicant = { ...this.state.applicant };
    const applicants = [...this.state.visa.applicants];
    applicant[input.name] = input.value;
    const applicantError = { ...this.state.applicantError };
    const errorMessage = this.validatePropertyPassenger(input);

    if (errorMessage) applicantError[input.name] = errorMessage;
    else delete applicantError[input.name];

    if (input.name === "name") {
      const p = applicants.filter((p) =>
        p.name.toLocaleLowerCase().startsWith(input.value.toLocaleLowerCase())
      );

      if (p.length !== 0) {
        applicantError[input.name] = '"Passenger" already exist.';
      }
    }

    if (input.name === "visaNumber") {
      const p = applicants.filter((p) =>
        p.visaNumber
          .toLocaleLowerCase()
          .startsWith(input.value.toLocaleLowerCase())
      );

      if (p.length !== 0) {
        applicantError[input.name] = '"Visa No." already exist.';
      }
    }

    this.setState({ applicant, applicantError });
  };
  async componentDidMount() {
    let visa = { ...this.state.visa };
    const customers = await CustomerServices.getAll();
    const suppliers = await SupplierServices.getAll();
    const cities = await CityServices.getAll();
    const bankAccounts = await BankAccountsServices.getAll();
    const { id } = this.props.match.params;

    if (id !== "new") {
      visa = await Services.getById(id);
      visa.bankAccountId = "";
      visa.amount = "";
    }

    this.setState({ customers, suppliers, cities, bankAccounts, visa });
  }
}

export default visaForm;
