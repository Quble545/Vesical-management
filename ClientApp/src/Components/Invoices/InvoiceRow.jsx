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
    const { row, open, setOpen, SubOpen, SubSetOpen } = this.props;

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
          <TableCell align="left">{row.amount}</TableCell>
          <TableCell align="left">{row.type}</TableCell>
          <TableCell align="left">{row.date}</TableCell>
        </TableRow>
        <TableRow key={"as"}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={open.id === row.id && open.isOpen}
              timeout="auto"
              unmountOnExit
            >
              {row.type === "Visa" ? (
                <Box margin={1}>
                  <Typography variant="h6" gutterBottom component="div">
                    Visa
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow key={"a"}>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>
                              SubSetOpen({ id: row.id, isOpen: true })
                            }
                          >
                            {open ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Supplier</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Country</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Payment</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Price</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Commission</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Date</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={row.service.id}>
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell component="th" scope="row">
                          {row.service.supplier}
                        </TableCell>
                        <TableCell>{row.service.country}</TableCell>
                        <TableCell align="left">
                          {row.service.paymentMethod}
                        </TableCell>
                        <TableCell align="left">{row.service.price}</TableCell>
                        <TableCell align="left">
                          {row.service.commission}
                        </TableCell>
                        <TableCell align="left">{row.service.date}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Box margin={1}>
                  <Typography variant="h6" gutterBottom component="div">
                    Ticket
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow key={"a"}>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>
                              SubSetOpen({ id: row.id, isOpen: true })
                            }
                          >
                            {open ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Supplier</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Type</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>payment</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>From</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>To</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Price</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Commission</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Date</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={row.service.id}>
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell component="th" scope="row">
                          {row.service.supplier}
                        </TableCell>
                        <TableCell>{row.service.ticketType}</TableCell>
                        <TableCell align="left">
                          {row.service.paymentMethod}
                        </TableCell>
                        <TableCell align="left">{row.service.from}</TableCell>
                        <TableCell align="left">{row.service.to}</TableCell>
                        <TableCell align="left">{row.service.price}</TableCell>
                        <TableCell align="left">
                          {row.service.commission}
                        </TableCell>
                        <TableCell align="left">{row.service.date}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Collapse>
          </TableCell>
        </TableRow>
        {row.type === "Visa" ? (
          <TableRow key={"as"}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse
                in={SubOpen.id === row.id && SubOpen.isOpen}
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
                          <div style={{ fontWeight: "bold" }}>Name</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Visa No.</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Expiry date</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.service.applicants.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell component="th" scope="row">
                            {p.name}
                          </TableCell>
                          <TableCell>{p.visaNumber}</TableCell>
                          <TableCell align="left">{p.expiryDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow key={"as"}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse
                in={SubOpen.id === row.id && SubOpen.isOpen}
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
                            Reservation No.
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>
                            Departure date
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontWeight: "bold" }}>Return date</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.service.passengers.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell component="th" scope="row">
                            {p.name}
                          </TableCell>
                          <TableCell>{p.reservation}</TableCell>
                          <TableCell align="left">{p.departure}</TableCell>
                          <TableCell align="left">{p.return}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  }

  handleDate = (date) => {
    let d = new Date(date);

    return d.toLocaleDateString();
  };
}

export default Row;
