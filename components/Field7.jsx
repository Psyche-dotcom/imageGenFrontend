import React from "react";

const Field7 = ({
  name,
  op1,
  opN1,
  op2,
  opN2,

  selectedOption,
  setSelectedOption,
}) => {
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="w-full flex gap-4 flex-col  text-black">
      <label htmlFor={name}>{name}</label>
      <select
        id={name}
        value={selectedOption}
        onChange={handleSelectChange}
        className="font-medium px-5 py-4 rounded-2xl border-2 border-gray-200"
      >
        <option value={op1}>{opN1}</option>
        <option value={op2}>{opN2}</option>
      </select>
    </div>
  );
};

export default Field7;
