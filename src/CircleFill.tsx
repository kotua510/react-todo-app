import React from "react";

type CircleFillProps = {
  LVexp: number; // 親から渡される「経験値（0〜1）」
};

export const CircleFill = ({ LVexp }: CircleFillProps) => {
  return (
    <div className="relative w-16 h-16 rounded-full border-4 border-white overflow-hidden">
      {/* 下地：まだ塗られていない部分 */}
      <div className="absolute inset-0 bg-gray-200" />

      {/* 塗りつぶし部分（LVexpに応じて高さを変更） */}
      <div
        className="absolute bottom-0 left-0 w-full bg-indigo-400 transition-all duration-500"
        style={{ height: `${LVexp * 100}%` }}
      />
    </div>
  );
};
