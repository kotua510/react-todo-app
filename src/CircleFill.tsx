import React from "react";

type CircleFillProps = {
  LVexp: number; 
};

export const CircleFill = ({ LVexp }: CircleFillProps) => {
  return (
    <div className="relative w-16 h-16 rounded-full border-4 border-white overflow-hidden">
      <div className="absolute inset-0 bg-gray-200" />

      <div
        className="absolute bottom-0 left-0 w-full bg-indigo-400 transition-all duration-500"
        style={{ height: `${LVexp * 100}%` }}
      />
    </div>
  );
};
