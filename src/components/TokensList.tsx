import Image from "next/image";
import Link from "next/link";
import React from "react";

const TokensList = ({ contractDetails }) => { 
  return (
    <>
      {contractDetails?.map((item, i) => (
        <Link
          href={`/dashboard/${item.deployedAddress}`}
          key={i}
          className="flex gap-4 items-center text-[14px] font-semibold cursor-pointer"
        >
          <div>
            <Image
              className="py-2 px-3 rounded-lg shadow-md bg-white my-2"
              src={'creata.svg'}
              height={48}
              width={48}
              alt="Creata logo"
            />
          </div>
          <div>
            <div>{item?.name}</div>
            <div className="text-blue">{item?.symbol} </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default TokensList;
