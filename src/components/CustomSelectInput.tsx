import React, { ForwardedRef, forwardRef } from "react";

const CustomSelectInput = forwardRef(
  (
    {
      otherStyle,
      placeholder,
      optionArray,
    }: {
      otherStyle: string;
      placeholder: string;
      optionArray: { name: string; value: string }[];
    },
    ref: ForwardedRef<HTMLSelectElement>
  ) => (
    <select
      className={`w-full border rounded h-10 px-2 ${otherStyle}`}
      defaultValue=""
      ref={ref}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {optionArray.map(({ name, value }, index) => (
        <option value={value} key={index}>
          {name}
        </option>
      ))}
    </select>
  )
);

export default CustomSelectInput;
