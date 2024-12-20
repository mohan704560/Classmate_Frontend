import React, { ForwardedRef, forwardRef } from "react";

const CustomTextArea = forwardRef(
  (
    {
      rows,
      cols,
      otherStyle,
      placeholder,
    }: {
      rows?: number;
      cols?: number;
      otherStyle?: string;
      placeholder?: string;
    },
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => (
    <textarea
      rows={rows}
      cols={cols}
      ref={ref}
      className={`w-full border rounded px-2 ${otherStyle}`}
      placeholder={placeholder}
    />
  )
);

export default CustomTextArea;
