import { Modal } from "react-bootstrap";
import React, { Component } from "react";
import Input from "../../Components/Common/Input";
import Button from "../../Components/Common/Button";
import Select from "react-select";

class SupplierForm extends Component {
  state = {};

  render() {
    const {
      show,
      onClose,
      vesicle,
      owners,
      errors,
      onSubmit,
      onValidate,
      onChange,
      onSelect,
      showModal,
    } = this.props;

    return (
      <Modal show={show} onHide={onClose} animation={true}>
        <Modal.Header>
          {vesicle.id ? (
            <Modal.Title>Update Vesicle</Modal.Title>
          ) : (
            <Modal.Title>Vesicle Registration</Modal.Title>
          )}
        </Modal.Header>
        <form onSubmit={onSubmit}>
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
                onChange={(e) => onSelect({ name: "ownerId", value: e.value })}
                options={owners.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
              />
              {errors["customerId"] && (
                <div className="text-danger">"Owner" is required.</div>
              )}
              <div className="text-primary">
                <i className="feather icon-plus-circle" name="plus" />
                <a onClick={showModal}>New Owner</a>
              </div>
            </div>

            <Input
              name="plateNo"
              label="Plate No."
              value={vesicle.plateNo}
              onChange={onChange}
              errors={errors}
              required={true}
            />

            <Input
              name="type"
              label="Type"
              value={vesicle.type}
              onChange={onChange}
              errors={errors}
              required={true}
            />

            <Input
              name="hp"
              label="Hp"
              value={vesicle.hp}
              onChange={onChange}
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
              disabled={onValidate()}
            />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

export default SupplierForm;
