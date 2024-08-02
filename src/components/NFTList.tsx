"use client"

import React, { useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NFTList = ({ contractDetails }) => {
   const router = useRouter();
 
  return (
    <>
      {contractDetails?.map((item, i) => (
        <div
          onClick={() =>
            router.push(
              `/dashboard/nftDetails?address=${item.deployedAddress}&tokenId=${item.tokenId}`
            )
          }
          key={i}
          className="flex gap-4 items-center text-[14px] font-semibold cursor-pointer relative"
        >
          <div>
            <Image
              className="py-2 px-3 rounded-lg shadow-md bg-white my-2"
              src={item.pinataImage}
              height={48}
              width={48}
              alt="Creata logo"
            />
          </div>
          <div>
            <div>{item?.name}</div>
            <div className="text-blue">{item?.symbol} </div>
          </div>
          {!item.owner && <div className="absolute font-normal py-1 px-2 right-0 bg-blue text-white rounded-md text-[12px]     ">Previously Owned </div>}
        </div>
      ))}
    </>
  );
};

export default NFTList;
