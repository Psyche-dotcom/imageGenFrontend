import React from "react";

const Field2 = ({
  name,
  op1,
  op2,
  op3,
  op4,
  op5,
  op6,
  op7,
  op8,
  op9,
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
        <option>Select</option>
        <option value={op1}>{op1}</option>
        <option value={op2}>{op2}</option>
        <option value={op3}>{op3}</option>
        <option value={op4}>{op4}</option>
        <option value={op5}>{op5}</option>
        <option value={op6}>{op6}</option>
        <option value={op7}>{op7}</option>
        <option value={op8}>{op8}</option>
        <option value={op9}>{op9}</option>
      </select>
    </div>
  );
};

export default Field2;
