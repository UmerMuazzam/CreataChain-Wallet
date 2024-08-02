"use client";

import BackButton from "@/components/BackButton";
import { checkOwnerOfToken, getNftDetails } from "@/utils/walletUtilities";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const address = localStorage.getItem("address");
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deployedAddress = searchParams.get("address");
  const tokenId = searchParams.get("tokenId");
  const [data, setData] = useState({});
  const [checkOwner, setCheckOwner] = useState(true);
  
 
  async function getData() {
    const data = await getNftDetails(deployedAddress, tokenId, address);
    console.log("data", data);
    setCheckOwner(data.owner)
    setData(data);
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container relative ">
      <div className="flex shadow-lg  justify-between rounded-t-md items-center  m-auto p-4 bg-slate-50">
        <Link href="/">
          <Image src="/creata.svg" height={34} width={34} alt="Creata logo" />
        </Link>
        <span className="py-2 px-4   font-semibold bg-white rounded">
          Zenith Chain
        </span>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton>
              <Image
                className="w-9 h-9 shadow-md cursor-pointer rounded-xl p-2 bg-white"
                src="/account.svg"
                width={10}
                height={10}
                alt="Creata logo"
              />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <form>
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </form>
            </div>
          </MenuItems>
        </Menu>
      </div>
      <div className=" mx-auto h-[2px]  bg-white"></div>

      <div className=" pb-6 relative bg-slate-50 shadow-lg rounded-b-lg">
        <BackButton link={"/dashboard"}>Back</BackButton>

        <div className=" text-[14px] pt-2 px-4">
          <b>Token Address :</b> {data?.deployedAddress}{" "}
        </div>

        {!checkOwner? (
          <div className="text-xl  uppercase text-center mt-4 bg-blue text-white">
            You previously owned
          </div>
        ) : ""}

        {data.pinataImage ? (
          <Image
            className="mt-12 mx-auto rounded-lg"
            src={data.pinataImage}
            height={200}
            width={200}
            alt="your nft"
          />
        ) : (
          <div className="text-xl text-blue text-center py-32 font-semibold">
            Loading your NFT...
          </div>
        )}
        <div className="ml-[184px] mt-2 text-[17px] font-bold text-gray-500">
          {" "}
          id # {data?.tokenId}
        </div>

        <div className="flex flex-col pt-6 items-center gap-4">
          <div className="text-xl font-semibold">
            {" "}
            {data?.name} {data?.symbol}
          </div>

          {data.owner ? (
            <div className="text-center">
              <Image
                onClick={() =>
                  router.push(
                    `/dashboard/nftDetails/send?tokenAddress=${deployedAddress}&tokenId=${tokenId}`
                  )
                }
                className="bg-blue rounded-full p-3 shadow-xl cursor-pointer  "
                src="/send.svg"
                alt="Send"
                height={64}
                width={64}
              />
              <span className="font-semibold text-[14px]">Send</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
