import React, { ForwardedRef, forwardRef } from "react";

const CustomEmailInput = forwardRef(
  (
    { otherStyle, placeholder }: { otherStyle?: string; placeholder?: string },
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <input
      type="email"
      ref={ref}
      className={`w-full border rounded h-10 px-2 ${otherStyle}`}
      placeholder={placeholder}
    />
  )
);

export default CustomEmailInput;
