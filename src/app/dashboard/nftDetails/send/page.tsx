"use client";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Error from "@/components/Error";
import Loader from "@/components/Loader"; 
import { tokenURIABI } from "@/utils/nftABI";
import { checkOwnerOfToken, estimatedFee, transferNFT, web3 } from "@/utils/walletUtilities";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react"; 


const privateKey = `0x${localStorage.getItem("privateKey")}`;
const address = localStorage.getItem("address");
const password = localStorage.getItem("password");

const page = () => {
  const [loading, setLoading] = useState(false);
  const [estimateFee, SetEstimateFee] = useState(0);
  console.log("estimateFee", estimateFee);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenAddress = searchParams.get("tokenAddress");
  const tokenId = searchParams.get("tokenId");

  const handleEstimateTotalFee= async(e)=>{
    setError('')
    SetEstimateFee(0)
    console.log('handleEstimateTotalFee ',e.target.value)
    // check reciever address is correct 
    const valid = web3.utils.isAddress(e.target.value);
    if(!valid) {
      setError("Invalid reciever address");
      setLoading(false);
      return;
    }
  // estimate function to calculate gas fee 
    const res = await estimatedFee(
      address,
      e.target.value,
      tokenAddress,
      tokenId,
      tokenURIABI
    ); 
    SetEstimateFee(res)
  }


  const handleForm = async (event) => {
    setError("")
    setLoading(true)
    event.preventDefault();
    const sendTo = event.target.sendTo.value;
    const enteredPassword = event.target.password.value; 
    if(password !== enteredPassword) 
    { 
        setError("Wrong password")
        setLoading(false);setLoading(false);
        return;
    }
    const isValidAddress = web3.utils.isAddress(sendTo);
    if (!isValidAddress) {
      setError("Invalid reciever address");
      setLoading(false);
      return;
    }
    
     const response = await transferNFT(
        privateKey,
        address,
        sendTo,
        tokenAddress,
        tokenId,
        tokenURIABI
      );
     setLoading(false);

     if(response.ok){
       router.push("/dashboard/transactionSuccessfull");
     }
     else{
       setError(response.message)
     }

  }

  return (
    <div className="container relative ">
      <div className="flex  justify-between rounded-t-md items-center  m-auto p-4 bg-slate-50">
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
      <div className=" relative bg-slate-50">
        <BackButton link={"/dashboard"}>Back</BackButton>

        <div className=" py-24 ">
          <form
            onSubmit={handleForm}
            className="flex flex-col items-center gap-4 "
          >
            <span className="font-semibold text-[17px]">Send to</span>
            <input
              name="sendTo"
              id="sendTo"
              className="w-[75%] bg-white  border py-2 px-4 rounded-lg outline-none"
              type="text"
              placeholder="Enter public address (0x) or Ens name"
              onChange={handleEstimateTotalFee}
            />
            <input
              name="password"
              id="password"
              className="w-[75%] bg-white  border py-2 px-4 rounded-lg outline-none"
              type="password"
              placeholder="Enter your password"
            />

          <div className="text-blue rounded-lg py-2 px-4 bg-white">Estimated Fee : {estimateFee.total} ETH </div>

            <div>{error && <Error>{error}</Error>}</div>
            <Button>Send</Button>
          </form>
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default page;
