"use client";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { abi } from "@/utils/abi";
import { sendToken, web3 } from "@/utils/walletUtilities";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";


const privateKey = localStorage.getItem("privateKey");
const address = localStorage.getItem("address");
const password = localStorage.getItem("password");
const page = () => {
  const router= useRouter()
  const tokenTxHistory = JSON.parse(localStorage.getItem("tokenTxHistory")) || [];
  const searchParams = useSearchParams();
  const [sendTokenAddress,setSendTokenAddress]=useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [enteredPass, setEnteredPass] = useState('');

  const name = searchParams.get("name");
  const balance = searchParams.get("balance");
  const deployedAddress = searchParams.get("deployedAddress"); 



 
  const handleSendToken = () => {
     setLoading(true);
     setError("");

    (async function (){
       if (password != enteredPass) {
         setLoading(false);
         setError("Incorrect password");
         return;
       }
       if (!web3.utils.isAddress(sendTokenAddress)) {
         setLoading(false);
         setError("Invalid reciever address");
         return;
       }
       if (balance < amount) {
         setLoading(false);
         setError("Not enough funds to send token");
         return;
       }
       try {
         const res = await sendToken(
           abi,
           address,
           `0x${privateKey}`,
           deployedAddress,
           sendTokenAddress,
           amount
         ); 
         tokenTxHistory.push(res);
         localStorage.setItem("tokenTxHistory", JSON.stringify(tokenTxHistory));
          
         router.push("transactionSuccessfull");
       } catch (error) {
         console.log(error);
       }
     })();
    
   };
  
 

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
            className="flex flex-col items-center gap-4 "
            action={handleSendToken}
          >
            <span className="font-semibold text-[17px]">Send to</span>
            <input
              value={sendTokenAddress}
              className="w-[75%] bg-white  border py-2 px-4 rounded-lg outline-none"
              type="text"
              placeholder="Enter public address (0x) or Ens name"
              onChange={(e) => setSendTokenAddress(e.target.value)}
            />
            <input
              value={enteredPass}
              className="w-[75%] bg-white  border py-2 px-4 rounded-lg outline-none"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setEnteredPass(e.target.value)}
            />
            <input
              value={amount}
              className="w-[75%] bg-white  border py-2 px-4 rounded-lg outline-none"
              type="text"
              placeholder="Enter amount to send"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
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
