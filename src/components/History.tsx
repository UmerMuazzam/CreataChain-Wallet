import { useRouter } from 'next/navigation';
import React from 'react'

const History = ({ transactionHistory, value }) => { 
  const router = useRouter();

  const navigate = (hash: string) => {
    router.push(`https://www.oklink.com/amoy/tx/${hash}`);
  };

  return (
    <div>
      <h3 className='font-bold text-center text-[18px] mt-6'>History</h3>
      {transactionHistory.length > 0 && (
        <div className="">
          {transactionHistory?.map((item, i) => {
            return (
              <div className='cursor-pointer' key={i} onClick={() => navigate(item.value)} >
                <div className="flex flex-col    gap-2   my-6">
                  <span className="text-gray-500 text-[14px]">
                    <b>Sender</b> : {item.from}
                  </span>
                  <span className="text-gray-500 text-[14px]">
                    <b>Reciever</b> : {item.to}
                  </span>
                  <span className="text-gray-500 text-[14px] cursor-pointer w-[450px] whitespace-nowrap overflow-hidden overflow-ellipsis underline">
                    <b>{value} </b> : {item.value}
                  </span>
                  <span className="text-gray-500 text-[14px]">
                    <b>Status</b> :{" "}
                    <span className="rounded text-[12px] bg-green-400 px-2 py-1 text-white">
                      Successfull
                    </span>
                  </span>
                </div>
                <div className="h-[2px] bg-white w-[100%]"></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History
