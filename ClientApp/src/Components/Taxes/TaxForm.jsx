import React, { Component } from "react";
import { Card } from "react-bootstrap";
import Button from "../Common/Button";
import Select from "react-select";
import VesicleServices from "../../httpServices/vesicleServices";
import OwnerServices from "../../httpServices/ownerServices";
import Joi, { wait } from "joi-browser";
import Services from "../../httpServices/taxServices";
import { toast } from "react-toastify";
import VesicleForm from "./newVesicle";

class TaxForm extends Component {
  state = {
    vesicles: [],
    owners: [],
    tax: {
      id: 0,
      amount: "",
      area: "",
      bookNo: "",
      amount: "",
      vesicleId: "",
    },
    showVesicle: false,
    errors: {},
  };
  schema = {
    id: Joi.number().allow(),
    area: Joi.string().required().label("Area"),
    bookNo: Joi.string().required().label("Book No."),
    amount: Joi.number().max(10000).min(1).allow("Amount"),
    vesicleId: Joi.number().required().label("Vesicle"),
  };

  render() {
    const { vesicles, tax, errors, owners, showVesicle } = this.state;

    return (
      <React.Fragment>
        <VesicleForm
          owners={owners}
          errors={errors}
          show={showVesicle}
          onClose={this.closeVesicle}
          onValidate={this.validate}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          showOwner={this.showOwner}
          onPapulate={this.papulateNewVesicle}
        />
        <Card>
          <Card.Header>
            <Card.Title as="h5">
              {tax.id === 0 ? "New Tax" : "Update Tax"}
            </Card.Title>
          </Card.Header>
          <form onSubmit={this.handleSubmit}>
            <Card.Body>
              <div className="row form-group">
                <div className="col-6">
                  <label>
                    Vesicle <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="customerId"
                    value={vesicles
                      .map((c) => ({
                        label: c.plateNo + " (" + c.type + ")",
                        value: c.id,
                      }))
                      .filter((c) => c.value === tax.vesicleId)}
                    onChange={(e) =>
                      this.onChange({ name: "vesicleId", value: e.value })
                    }
                    options={vesicles.map((c) => ({
                      label: c.plateNo + " (" + c.type + ")",
                      value: c.id,
                    }))}
                  />
                  {errors["vesicleId"] && (
                    <div className="text-danger">"Vesicle" is required.</div>
                  )}
                  <div className="text-primary">
                    <i className="feather icon-plus-circle" name="plus" />
                    <a onClick={this.showVesicle}>New Vesicle</a>
                  </div>
                </div>
                <div className="col-6">
                  <label>
                    Amount <span className="text-danger">*</span>
                  </label>
                  <input
                    name="amount"
                    value={tax.amount}
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
              <div className="row">
                <div className="col-6">
                  <label>
                    Area <span className="text-danger">*</span>
                  </label>
                  <input
                    name="area"
                    value={tax.area}
                    onChange={({ currentTarget: input }) =>
                      this.onChange({ name: input.name, value: input.value })
                    }
                    type="text"
                    className="form-control"
                    placeholder="Km4"
                  />
                  {errors["area"] && (
                    <div className="text-danger">{errors["area"]}</div>
                  )}
                </div>
                <div className="col-6">
                  <label>
                    Book No. <span className="text-danger">*</span>
                  </label>
                  <input
                    name="bookNo"
                    value={tax.bookNo}
                    onChange={({ currentTarget: input }) =>
                      this.onChange({ name: input.name, value: input.value })
                    }
                    type="text"
                    className="form-control"
                    placeholder="LK65445"
                  />
                  {errors["bookNo"] && (
                    <div className="text-danger">{errors["bookNo"]}</div>
                  )}
                </div>
              </div>
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

  papulateNewVesicle = (vesicle) => {
    const vesicles = [vesicle, ...this.state.vesicles];
    const tax = { ...this.state.tax };
    tax.vesicleId = vesicle.id;

    this.setState({ vesicles, tax });
  };
  showVesicle = () => {
    this.setState({ showVesicle: true });
  };
  closeVesicle = () => {
    this.setState({ showVesicle: false });
  };

  validateOnProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schemo = { [input.name]: this.schema[input.name] };
    const { error } = Joi.validate(obj, schemo);

    if (!error) return null;

    return error.details[0].message;
  };
  validate = () => {
    const tax = { ...this.state.tax };
    const option = { abortEarly: false };
    const { error } = Joi.validate(tax, this.schema, option);
    const errors = {};

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();

    const tax = { ...this.state.tax };
    const originalTax = { ...tax };
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    tax.amount = parseInt(tax.amount);

    try {
      this.setState({
        tax: {
          id: 0,
          amount: "",
          area: "",
          bookNo: "",
          amount: "",
          vesicleId: "",
        },
      });

      if (tax.id === 0) {
        await Services.post(tax);
        toast.success("Operation Success!");
      } else {
        await Services.put(tax.id, tax);
        toast.success("Successfuly updated.");

        this.props.history.push("/reports/taxes");
      }
    } catch (errors) {
      toast.error("Something went wrong");

      this.setState({ tax: originalTax });
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
    const tax = { ...this.state.tax };
    tax[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateOnProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ tax, errors });
  };

  async componentDidMount() {
    let tax = { ...this.state.tax };
    const vesicles = await VesicleServices.getAll();
    const owners = await OwnerServices.getAll();
    const { id } = this.props.match.params;

    if (id !== "new") {
      tax = await Services.getById(id);
      delete tax.date;
      delete tax.vesicle;
    }

    this.setState({ vesicles, tax, owners });
  }
}

export default TaxForm;
