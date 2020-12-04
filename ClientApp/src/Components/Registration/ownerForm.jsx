import { Modal } from "react-bootstrap";
import React, { Component } from "react";
import Input from "../../Components/Common/Input";
import Button from "../../Components/Common/Button";

class CustomerForm extends Component {
  state = {};

  render() {
    const {
      show,
      onClose,
      owner,
      errors,
      onSubmit,
      onValidate,
      onChange,
    } = this.props;

    return (
      <Modal show={show} onHide={onClose} animation={true}>
        <Modal.Header>
          {owner.id ? (
            <Modal.Title>Update Owner</Modal.Title>
          ) : (
            <Modal.Title>Owner Registration</Modal.Title>
          )}
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Body>
            <Input
              name="name"
              label="Name"
              value={owner.name}
              onChange={onChange}
              errors={errors}
              required={true}
            />

            <Input
              name="phone"
              label="Phone"
              value={owner.phone}
              onChange={onChange}
              errors={errors}
              required={true}
            />

            {/* <div className="form-group">
              <label htmlFor="">
                Photo <span className="text-danger"> *</span>
              </label>
              <input
                name="image"
                value={owner.image}
                onChange={onChange}
                type="file"
                className="form-control"
              />
            </div> */}
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

export default CustomerForm;
