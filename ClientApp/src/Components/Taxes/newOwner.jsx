import { Modal } from "react-bootstrap";
import React, { Component } from "react";
import Input from "../Common/Input";
import Button from "../Common/Button";
import joi from "joi-browser";
import Services from "../../httpServices/ownerServices";
import { toast } from "react-toastify";

class OwnerForm extends Component {
  state = {
    owner: { id: 0, name: "", phone: "" },
    errors: {},
  };

  schema = {
    id: joi.number().allow(0),
    name: joi.string().min(3).required().label("Name"),
    phone: joi.string().required().label("Phone Number"),
  };

  render() {
    const { show, onClose, onPapulate } = this.props;

    const { owner, errors } = this.state;

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header>
          {owner.id ? (
            <Modal.Title>Update Owner</Modal.Title>
          ) : (
            <Modal.Title>Owner Registration</Modal.Title>
          )}
        </Modal.Header>
        <form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <Input
              name="name"
              label="Name"
              value={owner.name}
              onChange={this.handleChange}
              errors={errors}
              required={true}
            />

            <Input
              name="phone"
              label="Phone"
              value={owner.phone}
              onChange={this.handleChange}
              errors={errors}
              required={true}
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
    const { onClose, onPapulate } = this.props;
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      onClose();
      const data = await Services.post(owner);
      toast.success("Successful registred.");

      onPapulate(data);
      this.setState({ owner: {} });
    } catch (error) {
      console.log(error);
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

export default OwnerForm;
