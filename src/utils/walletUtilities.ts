import * as bip39 from "bip39";
import * as bip32 from "bip32";
import { Web3 } from "web3";
import * as pbkdf2 from "pbkdf2-sha256";
import * as aes from "aes-js";
import { tokenURIABI } from "./nftABI";

// initiating web 3 wallet
export const web3 = new Web3("https://80002.rpc.thirdweb.com/");
// export const web3 = new Web3("HTTP://127.0.0.1:7545"); // ganache provider

// function to generate mnemonics
export const generateMnemonics = (password) => {
  const mNemonics = bip39.generateMnemonic();
  return mNemonics;
};

// function creating account from mnemonics
export const createAccount = async (mns) => { 
  const seed = await bip39.mnemonicToSeed(mns);
  const node = bip32.fromSeed(seed);
  const child = node.derivePath("m/44'/60'/0'/0/0");
  const privateKey = child.privateKey.toString("hex");
  localStorage.setItem("privateKey", privateKey);
  const account = await web3.eth.accounts.wallet.add(`0x${privateKey}`);
  const address = account[0].address;
  localStorage.setItem("address", address);
  const ballance = Web3.utils.fromWei(
    await web3.eth.getBalance(account[0].address),
    "ether"
  );
  return { address, ballance };
};
// mnemonics encryption
export const encryptMnemonics = async (password, mnemo) => {

  try {
    const derivedKey = await pbkdf2(
      password,
      "just a random string",
      1,
      32,
      "sha512"
    );
    const textBytes = aes.utils.utf8.toBytes(mnemo);
    const aesCtr = new aes.ModeOfOperation.ctr(derivedKey, new aes.Counter(5));
    const encryptedBytes = aesCtr.encrypt(textBytes);
    const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);

    localStorage.setItem("mnemonics", encryptedHex);
  } catch (error) {
    console.log("Error while encrypting");
  }
};

//  function to decrypt mnemonics
export const decryptMnemonics = async (password, mnemonics) => {
  try {
    const derivedKey = await pbkdf2(
      password,
      "just a random string",
      1,
      32,
      "sha512"
    );
    const encryptedBytes = aes.utils.hex.toBytes(mnemonics);
    const aesCtr = new aes.ModeOfOperation.ctr(derivedKey, new aes.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    const decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);
    const regex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!regex.test(decryptedText)) {
      throw new Error();
    }
    return { ok: true, message: "Decryption successfull" };
  } catch (error) {
    return { ok: false, message: "Invalid password" };
  }
};

// geting details of an account
export const getDetails = async () => {
  const address = localStorage.getItem("address");
  const ballance = await Web3.utils.fromWei(
    await web3.eth?.getBalance(address),
    "ether"
  );
  return { address, ballance };
};

// sending transaction to an account or address
export const transferEther = async (sendFrom, sendTo, amount, privateKey) => { 
  const transactionHistoryString =
    localStorage.getItem("transactionHistory") || [];
  const transactionHistory = JSON.parse(transactionHistoryString);
  const res = web3.utils.isAddress(sendTo);

  if (!res) {
    return { ok: false, message: "Invalid  address of reciever" }; // check if sendFrom is a valid address
  }
  try {
    const block = await web3.eth.getBlock();
    const tx = {
      from: sendFrom,
      to: sendTo,
      value: web3.utils.toWei(amount, "ether"),
      maxFeePerGas: block.baseFeePerGas * 2n,
      maxPriorityFeePerGas: 100000,
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      tx,
      privateKey
    );
    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    ); 
    const txHash = txReceipt.transactionHash;
    const transaction = await web3.eth.getTransaction(txHash); 
    const { from, to, value } = transaction;
    let txHistory = [
      ...transactionHistory,
      { from, to, value: Web3.utils.fromWei(value, "ether") },
    ];
    localStorage.setItem("transactionHistory", JSON.stringify(txHistory));

    return { ok: true, message: "Transaction successfully done" };
  } catch (error) {
    return {
      ok: false,
      message: "Transaction denied becuase of wrong address",
    };
  }
};

// get token and save it in localStorage
export const myContract = async (deployedAddress) => {
  const accountAddress = localStorage.getItem("address");

  // Fetch existing tokens from localStorage
  let tokens = JSON.parse(localStorage.getItem("tokensAddress")) || {};

  // Check if tokens already exist for the accountAddress
  if (tokens.hasOwnProperty(accountAddress)) {
    // Add the new deployedAddress to the existing array
    tokens[accountAddress].push({ deployedAddress: deployedAddress });
  } else {
    // Initialize a new array with the deployedAddress
    tokens[accountAddress] = [{ deployedAddress: deployedAddress }];
  }

  // Store updated tokens back into localStorage
  localStorage.setItem("tokensAddress", JSON.stringify(tokens));
};

// get details about token  
export const getTokenDetails = async (abi, deployedAddress, address) => {
  try {
    const myContract = new web3.eth.Contract(abi, deployedAddress);
    const name = await myContract.methods.name().call();
    const symbol = await myContract.methods.symbol().call();
    const totalSupply = web3.utils.fromWei(
      await myContract.methods.totalSupply().call(),
      "ether"
    );
    const balance = web3.utils.fromWei(
      await myContract.methods.balanceOf(address).call(),
      "ether"
    );

    return { name, symbol, totalSupply, deployedAddress, balance };
  } catch (error) {
    return { error: "Wrong Contract address" };
  }
};


// send token 
export const sendToken = async (
  abi,
  address,
  privateKey,
  deployedAddress,
  toAddress,
  amu
) => { 

  const contract = new web3.eth.Contract(abi, deployedAddress);
  let amount = web3.utils.toWei(amu, "ether");

  const transaction = contract.methods.transfer(toAddress, amount);
  const gasPrice = await web3.eth.getGasPrice();

  const gas = await transaction.estimateGas({
    from: address,
  });
  const nonce = await web3.eth.getTransactionCount(address);
  const data = transaction.encodeABI();

  const tx = {
    from: address,
    to: deployedAddress,
    data,
    gas,
    gasPrice,
    nonce,
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
 
  return { value: receipt.transactionHash, from: receipt.from, to: toAddress };
};



// ************************************IMPORT NFT TOKEN***************************************************
 
// get nft contract and save it in local storage 
export const getNFTContract = async ( deployedAddress, tokenId, address) => {

  try {
    const myContract = new web3.eth.Contract(tokenURIABI, deployedAddress);
    // checking weather he is the owner of the token
    const ownerOf = await myContract.methods.ownerOf(tokenId).call();
    
    if (ownerOf!== address) {
      return { ok: false, message: "This NFT is not yours" };
    } 

    // geting nftTokenDetails object from localStorage
    const nftTokenDetails = JSON.parse(localStorage.getItem("nftTokenDetails")) || {};

    if (!nftTokenDetails[address]) {
      nftTokenDetails[address] = [];
    }
    // check if token already imported
    if (nftTokenDetails[address].find((item) => item.deployedAddress === deployedAddress && item.tokenId === tokenId)) {
      return { ok: false, message: 'Token all ready imported' };
    }
    // pushing new token data into array 
    nftTokenDetails[address].push({ ownerOf: true, deployedAddress, tokenId });
    localStorage.setItem("nftTokenDetails", JSON.stringify(nftTokenDetails));
     
    return { ok: true,message:'Token Imported successfuly' };
  } catch (error) {
    return { ok: false, message: " Contract address or ID is incorrect" };
  }
};


// CHECK OWNER OF NFT TOKEN 
export const checkOwnerOfToken = async (address, deployedAddress, tokenId)=>{
  const myContract = new web3.eth.Contract(tokenURIABI, deployedAddress);
  const ownerOf = await myContract.methods.ownerOf(tokenId).call();
  
  if (ownerOf !== address) {
    return { ok: false, message: "This NFT is not yours" };
  }
}

// function to get nft details 

export const getNftDetails = async (deployedAddress, tokenId, address)=>{
  try {
    const myContract = new web3.eth.Contract(tokenURIABI, deployedAddress);
    const ownerOf = await myContract.methods.ownerOf(tokenId).call();
    let owner=true;
    if (ownerOf !== address) {
      owner=false
    }
    const tokenURI = await myContract.methods.tokenURI(tokenId).call();
    const response = await fetch(tokenURI);
    const jsonData = await response.json();
    const pinataImage = jsonData.image;
    const name = await myContract.methods.name().call();
    const symbol = await myContract.methods.symbol().call();
    return { ok: true, pinataImage, name, symbol, deployedAddress, tokenId, jsonData, owner }
  } catch (error) {
    return { ok: false, message: "Fetching token details failed", error}
  }
}





// function to transfer nft  

export const transferNFT = async (privateKey, address, sendTo, tokenAddress, tokenId, tokenURIABI) => {

  try {
    const contract = new web3.eth.Contract(tokenURIABI, tokenAddress);

    // variables to store transaction history 
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const date = today.toDateString()
    const nftTransactionHistory = JSON.parse(localStorage.getItem("nftTransactionHistory")) || [];
    
    // calling transaction to proceed
    const data = contract.methods.safeTransferFrom(address, sendTo, tokenId).encodeABI();
    const gasEstimate = await web3.eth.estimateGas({
      from: address,
      to: tokenAddress,
      data: data,
    }); 
    const tx = {
      from: address,
      to: tokenAddress,
      gas: gasEstimate, // Adjust gas limit as needed
      data,
      gasPrice: await web3.eth.getGasPrice()
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey); 
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)   

    // storing variables to localstorage 
    const history ={
      name,
      symbol,
      date,
      hash: receipt.transactionHash
    }
    nftTransactionHistory.push(history);
     
    localStorage.setItem("nftTransactionHistory", JSON.stringify(nftTransactionHistory))
        return { ok: true, message: "NFT successfully transferred" };
  } catch (error) {
      console.error("Error while transferring NFT:", error);
      return { ok: false, message: "Failed to transfer NFT by EVM" };
  }


};



// extimating gas fee  
export const estimatedFee = async (address, sendTo, tokenAddress, tokenId, tokenURIABI)=>{
  const contract = new web3.eth.Contract(tokenURIABI, tokenAddress);
  const data = contract.methods.safeTransferFrom(address, sendTo, tokenId).encodeABI();
  const gasEstimate = await web3.eth.estimateGas({
    from: address,
    to: tokenAddress,
    data: data,
  });
  const gasPrice = await web3.eth.getGasPrice()
  const total = Web3.utils.fromWei(gasEstimate * gasPrice, 'ether') ;
  
  return {ok:true, total, gasPrice, gasEstimate }
}


// saving nft transaction to local storage
export const saveNftTransaction=async()=>{

}