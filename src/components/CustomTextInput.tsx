import React, { ForwardedRef, forwardRef } from "react";

const CustomTextInput = forwardRef(
  (
    { otherStyle, placeholder }: { otherStyle?: string; placeholder?: string },
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <input
      type="text"
      ref={ref}
      className={`w-full border rounded h-10 px-2 ${otherStyle}`}
      placeholder={placeholder}
    />
  )
);

export default CustomTextInput;
