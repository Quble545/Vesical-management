import { Modal } from "react-bootstrap";
import React, { Component } from "react";
import Input from "../Common/Input";
import Button from "../Common/Button";
import joi from "joi-browser";
import Services from "../../httpServices/customerServices";
import { toast } from "react-toastify";

class CustomerForm extends Component {
  state = {
    customer: { id: 0, name: "", phone: "", email: "", address: "" },
    errors: {},
  };

  schema = {
    id: joi.number().allow(0),
    name: joi.string().min(3).required().label("Name"),
    phone: joi.string().required().label("Phone Number"),
    email: joi.string().email().allow("").label("Email"),
    address: joi.string().allow("").label("Address"),
  };

  render() {
    const { show, onClose } = this.props;

    const { customer, errors } = this.state;

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header>
          {customer.id ? (
            <Modal.Title>Update Customer</Modal.Title>
          ) : (
            <Modal.Title>Customer Registration</Modal.Title>
          )}
        </Modal.Header>
        <form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <Input
              name="name"
              label="Name"
              value={customer.name}
              onChange={this.handleChange}
              errors={errors}
              required={true}
            />

            <Input
              name="phone"
              label="Phone"
              value={customer.phone}
              onChange={this.handleChange}
              errors={errors}
              required={true}
            />

            <Input
              name="email"
              label="Email"
              value={customer.email}
              onChange={this.handleChange}
              errors={errors}
            />

            <Input
              name="address"
              label="Address"
              value={customer.address}
              onChange={this.handleChange}
              errors={errors}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={onClose}
              color="secondary"
              type="button"
              name="Close"
            />
            <Button
              color="primary"
              type="submit"
              name="Submit"
              disabled={this.validate()}
            />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schem = { [input.name]: this.schema[input.name] };
    const { error } = joi.validate(obj, schem);

    if (!error) return null;

    return error.details[0].message;
  };
  validate = () => {
    const customer = { ...this.state.customer };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = joi.validate(customer, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();

    const customer = { ...this.state.customer };
    const { onClose, onPapulate } = this.props;
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      onClose();
      const data = await Services.post(customer);
      toast.success("Successful registred.");

      onPapulate(data);
      this.setState({ customer: {} });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };
  handleChange = ({ currentTarget: input }) => {
    const customer = { ...this.state.customer };
    customer[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ customer, errors });
  };
}

export default CustomerForm;
