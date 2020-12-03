import { Modal } from "react-bootstrap";
import React, { Component } from "react";
import Input from "../Common/Input";
import Button from "../Common/Button";
import joi from "joi-browser";
import Services from "../../httpServices/vesicleServices";
import { toast } from "react-toastify";
import Select from "react-select";
import NewOwner from "./newOwner";

class newViscle extends Component {
  state = {
    vesicle: { id: 0, plateNo: "", type: "", hp: "", ownerId: "", owner: "" },
    showOwner: false,
    owners: this.props.owners,
    errors: {},
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
    const { show, onClose, owners } = this.props;

    const { vesicle, errors } = this.state;

    return (
      <React.Fragment>
        <Modal show={show} onHide={onClose}>
          <Modal.Header>
            {vesicle.id ? (
              <Modal.Title>Update Vesicle</Modal.Title>
            ) : (
              <Modal.Title>Vesicle Registration</Modal.Title>
            )}
          </Modal.Header>
          <form onSubmit={this.handleSubmit}>
            <Modal.Body>
              <div className="form-group">
                <label>
                  Owner <span className="text-danger">*</span>
                </label>
                <Select
                  name="customerId"
                  value={owners
                    .map((c) => ({
                      label: c.name,
                      value: c.id,
                    }))
                    .filter((c) => c.value === vesicle.ownerId)}
                  onChange={(e) =>
                    this.handleSelect({ name: "ownerId", value: e.value })
                  }
                  options={owners.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                />
                {errors["customerId"] && (
                  <div className="text-danger">"Owner" is required.</div>
                )}
              </div>

              <Input
                name="plateNo"
                label="Plate No"
                value={vesicle.plateNo}
                onChange={this.handleChange}
                errors={errors}
                required={true}
              />

              <Input
                name="type"
                label="Type"
                value={vesicle.type}
                onChange={this.handleChange}
                errors={errors}
                required={true}
              />

              <Input
                name="hp"
                label="Hp"
                value={vesicle.hp}
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
      </React.Fragment>
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
    const { onClose, onPapulate } = this.props;
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      onClose();
      vesicle.owner = null;
      const data = await Services.post(vesicle);
      toast.success("Successful registred.");

      onPapulate(data);
      this.setState({ vesicle: {} });
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

export default newViscle;
