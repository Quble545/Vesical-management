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
import { NavLink } from "react-router-dom";

class Row extends Component {
  render() {
    const { row, open, setOpen, onRedirect, user } = this.props;

    return (
      <React.Fragment>
        <TableRow key={row}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen({ id: row.id, isOpen: true })}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="left">${row.amount}</TableCell>
          <TableCell align="left">{row.area}</TableCell>
          <TableCell align="left">{row.bookNo}</TableCell>
          <TableCell align="left">{this.handleDate(row.date)}</TableCell>
          <TableCell align="left">
            <NavLink to={"/service/taxForm/" + row.id}>
              <i
                className="feather icon-edit"
                style={{ fontSize: 20, color: "blue" }}
              />
            </NavLink>
          </TableCell>
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
                  Vesicle
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow key={"a"}>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}>Owner</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}>Plate No.</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}>Type</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}>Hp</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontWeight: "bold" }}> date </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={row.vesicle.id}>
                      <TableCell component="th" scope="row">
                        {row.vesicle.owner.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.vesicle.plateNo}
                      </TableCell>
                      <TableCell>{row.vesicle.type}</TableCell>
                      <TableCell align="left">{row.vesicle.hp}</TableCell>
                      <TableCell align="left">
                        {this.handleDate(row.vesicle.date)}
                      </TableCell>
                    </TableRow>
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
