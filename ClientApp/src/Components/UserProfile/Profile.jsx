import React, { Component } from "react";
import { Card } from "react-bootstrap";
import OwnerService from "../../httpServices/ownerServices";

class Profile extends Component {
  state = { owner: {} };

  render() {
    const { owner } = this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
          <Card.Body>
            <image src={owner.image} alt="Owner image" />
            <p className="text-center strong">
              <h3>
                {owner.name} ({owner.phone})
              </h3>
            </p>
          </Card.Body>
        </Card.Header>
      </Card>
    );
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const owner = await OwnerService.getById(id);

    this.setState({ owner });
  }
}

export default Profile;
