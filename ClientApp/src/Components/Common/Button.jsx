import React from "react";

const Button = (props) => {
  const { color, disabled, name, type, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={"btn btn-" + color}
      disabled={disabled}
      type={type}
    >
      {name}
    </button>
  );
};

export default Button;
