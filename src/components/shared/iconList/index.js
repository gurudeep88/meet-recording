import React from "react";

const Icons = ({onClick, name}) => {
  return (
    <span
      className="material-icons material-icons-outlined"
      onClick={onClick}
    >
      {name}
    </span>
  );
};

export default Icons;
