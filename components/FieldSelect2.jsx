import React from "react";

const FieldSelect2 = ({
  name,
  op1,
  opN1,
  op2,
  opN2,
  op3,
  opN3,
  op4,
  opN4,
  op5,
  opN5,
  selectedOption,
  setSelectedOption,
}) => {
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className="w-full flex gap-4 flex-col">
      <label htmlFor={name}>{name}</label>
      <select
        id={name}
        value={selectedOption}
        onChange={handleSelectChange}
        className="font-medium px-5 py-4 rounded-2xl border-2 border-gray-200 text-black"
      >
        <option value={op1}>{opN1}</option>
        <option value={op2}>{opN2}</option>
        <option value={op3}>{opN3}</option>
        <option value={op4}>{opN4}</option>
        <option value={op5}>{opN5}</option>
      </select>
    </div>
  );
};

export default FieldSelect2;
