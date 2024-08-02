import Image from "next/image";
import React from "react";

const NftHistory = () => {
  const nftTransactionHistory =
    JSON.parse(localStorage.getItem("nftTransactionHistory")) || [];
  return (
    <div>
      {nftTransactionHistory.length? <h3 className="font-bold text-center text-[18px] mt-6">History</h3> : ''}
      {nftTransactionHistory.map((item) => (
        <div className="flex justify-between mt-4" key={item.date}>
          <div>
            <div className="flex flex-col ">
              <span className="font-semibold">Send {item.symbol}</span>
              <span className="bg-blue text-white text-[11px] py-[2px] px-[5px] rounded-md">Confirmed</span>
            </div>
          </div>

          <div>{item.date}</div>

          <div className="text-blue">0 {item.symbol}</div>
        </div>
      ))}
    </div>
  );
};

export default NftHistory;
