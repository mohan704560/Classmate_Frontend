import React, { ForwardedRef, forwardRef } from "react";

const CustomDateInput = forwardRef(
  (
    { otherStyle, placeholder }: { otherStyle?: string; placeholder?: string },
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <input
      type="date"
      ref={ref}
      className={`w-full border rounded h-10 px-2 ${otherStyle}`}
      placeholder={placeholder}
    />
  )
);

export default CustomDateInput;
