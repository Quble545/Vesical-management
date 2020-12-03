import React, { Component } from "react";
import Fontawesome from "react-fontawesome";

class Theader extends Component {
  render() {
    const { ths, onSort, sortColumn } = this.props;
    return (
      <thead>
        <tr key={ths[0]}>
          {ths.map((t) => (
            <th onClick={() => onSort(t)} key={t}>
              {sortColumn.path === t.toLocaleLowerCase()
                ? this.handleIcon(sortColumn)
                : ""}
              {t}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
  handleIcon = (sortColumn) => {
    return sortColumn.order === "asc" ? (
      <Fontawesome className="fas fa-sort-up" name="arrow" />
    ) : (
      <Fontawesome className="fas fa-sort-down" name="arrow" />
    );
  };
}

export default Theader;
