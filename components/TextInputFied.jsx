import React from "react";

const TextInputField = ({
  id,
  type,
  placeholder,
  setstate,
  name,
  errorMessage,
  errorState,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-black">{name}</span>
      <input
        name={id}
        type={type}
        placeholder={placeholder}
        id={id}
        className="w-full p-4 border-2 border-gray-200 text-black rounded-xl focus:border-main_projcolor"
        onChange={(e) => setstate(e.target.value)}
      />
      {errorState && <p className="text-red-600 text-xs">{errorMessage}</p>}
    </div>
  );
};

export default TextInputField;
