import React, { ForwardedRef, forwardRef } from "react";

const CustomTimeInput = forwardRef(
  (
    { otherStyle, placeholder }: { otherStyle?: string; placeholder?: string },
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <input
      type="time"
      ref={ref}
      className={`w-full border rounded h-10 px-2 ${otherStyle}`}
      placeholder={placeholder}
    />
  )
);

export default CustomTimeInput;
