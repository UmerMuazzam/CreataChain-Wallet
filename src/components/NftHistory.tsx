import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const NftHistory = () => {
  const router = useRouter();
  const nftTransactionHistory =
    JSON.parse(localStorage.getItem("nftTransactionHistory")) || [];

  const navigate = (hash: string) => {
    router.push(`https://www.oklink.com/amoy/tx/${hash}`);
  };

  return (
    <div>
      {nftTransactionHistory.length ? (
        <h3 className="font-bold text-center text-[18px] mt-6">History</h3>
      ) : (
        ""
      )}
      {nftTransactionHistory.map((item) => (
        <div
          className="flex justify-between mt-4 cursor-pointer bg-slate-100 border rounded-md p-2 hover:opacity-80"
          key={item.date}
          onClick={() => navigate(item.hash)}
        >
          <div>
            <div className="flex flex-col ">
              <span className="font-semibold">Send {item.symbol}</span>
              <span className="bg-blue text-white text-[11px] py-[2px] px-[5px] w-20 rounded ">
                Confirmed
              </span>
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
