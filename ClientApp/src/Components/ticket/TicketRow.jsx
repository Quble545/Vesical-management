import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

class Row extends Component {
  render() {
    const { row, open, setOpen, onRedirect, user } = this.props;

    return (
      <React.Fragment>
        <TableRow key={row.id}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen({ id: row.id, isOpen: true })}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="left">{row.customer}</TableCell>
          <TableCell align="left">{row.supplier}</TableCell>
          <TableCell align="left">{row.ticketType}</TableCell>
          <TableCell align="left">{row.paymentMethod}</TableCell>
          <TableCell align="left">{row.from}</TableCell>
          <TableCell align="left">{row.to}</TableCell>
          <TableCell align="left">{row.price}</TableCell>
          <TableCell align="left">{row.commission}</TableCell>
          <TableCell align="left">{row.date}</TableCell>
          {user.role == "Admin" ? (
            <TableCell align="left">
              <a onClick={() => onRedirect(row.id)}>
                <i
                  className="feather icon-edit"
                  style={{ fontSize: 20, color: "blue" }}
                />
              </a>
            </TableCell>
          ) : (
            ""
          )}
        </TableRow>
        <TableRow key={"as"}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={open.id === row.id && open.isOpen}
              timeout="auto"
              unmountOnExit
            >
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Passengers
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow key={"a"}>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}>Passenger</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}>
                          Reservation No{" "}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}>
                          Departure date{" "}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}> Return date </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.passengers.map((passenger) => (
                      <TableRow key={passenger.id}>
                        <TableCell component="th" scope="row">
                          {passenger.name}
                        </TableCell>
                        <TableCell>{passenger.reservation}</TableCell>
                        <TableCell align="left">
                          {passenger.departure}
                        </TableCell>
                        <TableCell align="left">{passenger.return}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  handleDate = (date) => {
    let d = new Date(date);

    return d.toLocaleDateString();
  };
}

export default Row;
