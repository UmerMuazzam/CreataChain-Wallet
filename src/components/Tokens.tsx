"use client";

import { abi } from "@/utils/abi";
import { getTokenDetails, myContract, web3 } from "@/utils/walletUtilities";
import React, { useEffect, useState } from "react";
import Error from "./Error";
import TokensList from "./TokensList";
import Link from "next/link";
import Loader from "./Loader";
import History from "./History";


const Tokens = () => {
  const address = localStorage.getItem("address");
  const [contractDetails, setContractDetails] = useState("");
  const transactionHistory =
    JSON.parse(localStorage.getItem("tokenTxHistory")) || [];

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showInputField, setShowInputField] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");

  // to show the input field
  const handleShowInputToken = () => {
    setShowInputField(true);
  };

  // add the token to the list of tokens
  const handleTokenAddress = async () => {
    setLoading(true);
    setError("");

    if (tokenAddress.length == 0) {
      setError("Token address cannot be empty");
      setLoading(false);
      return;
    }

    const res = await getTokenDetails(abi, tokenAddress, address);
    if (res.error) {
      setError("Token address is not valid");
      setLoading(false);
      return;
    }
    setTokenAddress("");
    try {
      await myContract(tokenAddress);
      setTimeout(() => {
        myTokenGetDetails();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log("some thing went wrong", error);
    }
  };

  async function myTokenGetDetails() {
    try {
      let tokensAddress = JSON.parse(localStorage.getItem("tokensAddress"));
      tokensAddress = tokensAddress[address];

      const response = tokensAddress.map((element) =>
        getTokenDetails(abi, element.deployedAddress, address)
      );
      const promise = await Promise.all(response);

      setContractDetails(promise);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    myTokenGetDetails();
  }, [address]);

  return (
    <div className="my-6">
      <div
        className="text-blue font-semibold text-[14px] text-right mt-[-16px] cursor-pointer"
        onClick={handleShowInputToken}
      >
        Import Tokens
      </div>

      {showInputField && (
        <div className="flex justify-end flex-col gap-2  mt-4">
          <input
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            type="text"
            className=" px-3 py-2 bg-white w-[100%] rounded-lg placeholder:text-blue-950 outline-none "
          />
          <button
            className=" bg-blue text-[16px] font-normal text-white w-[240px] mx-auto mt-4 mb-4  h-[40px] rounded-lg shadow-lg  hover:animate-pulse"
            onClick={handleTokenAddress}
          >
            Next
          </button>
          {error && <Error>{error}</Error>}
        </div>
      )}

      {contractDetails ? (
        <TokensList contractDetails={contractDetails} />
      ) : (
        <div className="text-xl text-blue mt-4 w-full"> Loading ...</div>
      )}

      <History
        value="Transaction Hash"
        transactionHistory={transactionHistory}
      />

      {loading && <Loader />}
    </div>
  );
};

export default Tokens;
