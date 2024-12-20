import React, { ForwardedRef, forwardRef, LegacyRef } from "react";

const CustomModel = forwardRef(
  (
    { children, header }: { children: React.ReactNode; header: string },
    ref: ForwardedRef<HTMLDivElement | null>
  ) => {
    return (
      <div
        id="myModal"
        ref={ref}
        className="modal hidden fixed z-10 top-0 right-0 w-screen h-screen bg-[rgba(0,0,0,0.3)] p-4 flex items-center justify-center"
      >
        <div className=" bg-white w-svw max-h-svh h-fit lg:w-1/2 p-4 rounded-md overflow-y-scroll">
          <div className="flex flex-row justify-between items-center">
            <span className="font-bold text-lg leading-6">{header}</span>
            <button
              className="close text-4xl"
              onClick={() => {
                if (ref && typeof ref !== "function" && ref.current) {
                  ref.current.style.display = "none";
                }
              }}
            >
              &times;
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }
);

export default CustomModel;
