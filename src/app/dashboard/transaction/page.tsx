"use client";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Logo from "@/components/Logo";
import { decryptMnemonics, transferEther } from "@/utils/walletUtilities";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const privateKey = localStorage.getItem("privateKey");

const page = () => {
  const [sendTo, setSendTo] = useState(false);
  const [amount, setAmount] = useState(0);
  const searchParams = useSearchParams();
  const [balance] = useState(searchParams.get("ballance")); 

  const router = useRouter();
  const [checkPass, setCheckPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const mnemonics = localStorage.getItem("mnemonics");

  const handleSubmit = async (formData) => {
    const myAdd = localStorage.getItem("address");
    const recieverAdd = formData.get("address");
    const password = formData.get("password");
    const am = Number(formData.get("amount"));
    setAmount(am); 
    if (am > balance) return;
    if (password.length < 8)
      return alert("Password must be at least of 8 characters");
    try {
      // calling decryption function
      const res = await decryptMnemonics(password, mnemonics);

      if (!res.ok) {
        setCheckPass(true);
        return;
      }

      // calling transfer ether function
      const transfer = await transferEther(
        myAdd,
        recieverAdd,
        formData.get("amount"),
        privateKey
      );

      if (!transfer.ok) {
        setSendTo(transfer.message);
        return;
      }
      setLoading(true);
      setTimeout(() => {
        router.push("/dashboard/transactionSuccessfull");
      }, 1000);
    } catch (error) {
      console.log(error, "something went wrong");
      setCheckPass(true);
    }
  };

  return (
    <div className="container relative text-center">
      <BackButton link="/dashboard" />
      <div>
        <Logo />
        <h3 className="text-[18px] font-semibold my-8">
          Send your transaction to the Ethereum blockchain
        </h3>
        <form
          action={handleSubmit}
          className="flex flex-col bg-slate-50 py-4 justify-center items-center rounded-md"
        >
          <span className="flex w-[100%] pt-8 px-8 gap-4   items-center">
            <span className="font-bold w-20">Password</span>
            <input
              className="p-3 bg-white w-[90%] rounded-md outline-none"
              type="password"
              placeholder="Please Enter password"
              id="password"
              name="password"
              required
            />
          </span>
          {checkPass && (
            <div className="w-[90%] pt-8  pl-24 ">
              <Error>Please provide valid password</Error>
            </div>
          )}
          <span className="flex w-[100%] pt-8 px-8 gap-4  first-letter: items-center">
            <span className="font-bold w-20">Address</span>
            <input
              className="p-3   bg-white w-[90%] rounded-md outline-none"
              type="text"
              placeholder="Please Enter reciever address"
              id="address"
              name="address"
              required
            />
          </span>

          {sendTo && (
            <div className="w-[90%] pt-8  pl-24 ">
              {" "}
              <Error>{sendTo}</Error>
            </div>
          )}

          <span className="flex w-[100%] p-8  gap-4   items-center">
            {" "}
            <span className="font-bold w-20">Amount</span>
            <input
              className="p-3   bg-white w-[90%] rounded-md outline-none"
              type="number"
              placeholder="Please Enter amount to send"
              id="amount"
              name="amount"
            />
          </span>
          {amount >= balance && (
            <div className="w-[90%] pb-8  pl-24 ">
              <Error>Not enough ETH to send</Error>
            </div>
          )}
          <Button>Send</Button>
        </form>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default page;
