"use client"

import { getNFTContract, getNftDetails } from '@/utils/walletUtilities';
import React, { useEffect, useState } from 'react' 
import Error from './Error';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import NFTList from './NFTList';


const ImportNFT = () => {
  const address = localStorage.getItem("address") || "";
  let contractDetails = [];
  if (localStorage.getItem("nftTokenDetails")) {
    contractDetails = JSON.parse(localStorage.getItem("nftTokenDetails"))[
      address
    ];
  } 
  const [error,setError]=useState("")
  const [nftTokenList, setNftTokenList] = useState("");
  const [loader, setLoader] = useState(false);
  const router= useRouter()

  const handleGetNftTokenDetails = async() => {
    const getTokensDetails = contractDetails.map((item) =>
      getNftDetails(item.deployedAddress, item.tokenId, address)
    );
    const promise = await Promise.all(getTokensDetails);
    return  promise
  };

const handleForm =async(event) => {
  event.preventDefault(); 
  setLoader(true)
  const tokenAddress = event.target.tokenAddress.value;
  const tokenId = event.target.tokenId.value;

  if (!tokenAddress.length || !tokenId.length){
    setError("Please fill both fields")
    setLoader(false)
    event.target.tokenAddress.value="";
    event.target.tokenId.value = "";
    return;
  }
    const response = await getNFTContract(
      tokenAddress,
      tokenId,
      address
    );
  if(!response.ok){
    setError(response.message)
    setLoader(false)
  }
  else{
    setLoader(false);
    // router.push('/dashboard')
    setError("")
  }
  event.target.tokenAddress.value = "";
  event.target.tokenId.value = "";
};

const callAsync=async()=>{
  const res= await handleGetNftTokenDetails()
   console.log("handleGetNftTokenDetails", res)
   setNftTokenList(res) 
}

useEffect(() => {
  callAsync();
},[] );
 
    
  return (
    <div className="container relative text-center">
      <form onSubmit={handleForm}>
        <div className="flex flex-col gap-4 items-center mb-6">
          <input
            name="tokenAddress"
            id="tokenAddress"
            type="text"
            placeholder="Enter Token Address"
            className="px-3 py-2 bg-white w-[100%] rounded-lg placeholder:text-blue-950 outline-none "
          />
        </div>
        <div className="flex flex-col gap-4 items-center mb-6">
          <input
            name="tokenId"
            id="tokenId"
            type="text"
            placeholder="Enter Token ID"
            className="px-3 py-2 bg-white w-[100%] rounded-lg placeholder:text-blue-950 outline-none "
          />
        </div>
        <button
          type="submit"
          className=" bg-blue mb-6 text-[16px] font-normal text-white w-[240px]  h-[40px] rounded-lg shadow-lg  hover:animate-pulse text-center"
        >
          Import
        </button>
      </form>
      {error && (
        <div className="mb-4">
          <Error>{error}</Error>
        </div>
      )}
      {loader && (
        <div className="container left-14 relative  top-[-600px]">
          <Loader />
        </div>
      )}

      {nftTokenList? <NFTList contractDetails={nftTokenList} /> : <div className='text-xl text-blue mt-4 '> Loading ...</div> }
    </div>
  );
}

export default ImportNFT
