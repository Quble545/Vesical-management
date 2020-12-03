import { Modal } from "react-bootstrap";
import React, { Component } from "react";
import Input from "../../Components/Common/Input";
import Button from "../../Components/Common/Button";
import Select from "react-select";

class CityForm extends Component {
  state = {};

  render() {
    const {
      show,
      onClose,
      user,
      roles,
      errors,
      onSubmit,
      onValidate,
      onChange,
      onSelect,
    } = this.props;

    return (
      <Modal show={show} onHide={onClose} animation={true}>
        <Modal.Header>
          {user.id ? (
            <Modal.Title>Update User</Modal.Title>
          ) : (
            <Modal.Title>User Registration</Modal.Title>
          )}
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Body>
            <Input
              name="name"
              label="Name"
              value={user.name}
              onChange={onChange}
              errors={errors}
              required={true}
            />

            <Input
              name="username"
              label="Username"
              value={user.username}
              onChange={onChange}
              errors={errors}
              required={true}
            />

            <Input
              name="password"
              label="Password"
              value={user.password}
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

export default CityForm;
