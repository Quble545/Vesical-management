import React from "react";

const Input = (props) => {
  const { name, label, value, onChange, errors, required } = props;

  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        value={value}
        onChange={onChange}
        id={name}
        name={name}
        type="text"
        className="form-control"
      />
      {errors[name] && <div className="text-danger">{errors[name]}</div>}
    </div>
  );
};

export default Input;
