import React from "react";

const Field5 = ({
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
  op10,
  op11,
  op12,
  op13,
  op14,
  op15,
  op16,
  op17,
  op18,
  op19,
  op20,
  op21,
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
        <option value={op10}>{op10}</option>
        <option value={op11}>{op11}</option>
        <option value={op12}>{op12}</option>
        <option value={op13}>{op13}</option>
        <option value={op14}>{op14}</option>
        <option value={op15}>{op15}</option>
        <option value={op16}>{op16}</option>
        <option value={op17}>{op17}</option>
        <option value={op18}>{op18}</option>
        <option value={op19}>{op19}</option>
        <option value={op20}>{op20}</option>
        <option value={op21}>{op21}</option>
      </select>
    </div>
  );
};

export default Field5;
