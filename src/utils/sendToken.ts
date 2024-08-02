import Web3 from "web3";
import { abi } from "./abi.ts";

const myPrivateKey =
  "2f909d1a5d9176106b9700aa7b148c334ed29fddd0793a150e9c01e57bdf8095"; 

const web3 = new Web3("https://80002.rpc.thirdweb.com/");

export const sendToken = async () => {
  const tokenABI = abi;
  const tokenAddress = "0x4dCFCb0ED67259883cc9a1693b5A020B67Ef35C1"; // Your deployed token contract address
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

  const fromAddress = "0x4871DbF6DFFE579cab4065B68D461619D978922f"; // Your account address
  const toAddress = "0xFbc02E60462D06f3c575780c37CE8758Ce07E8A9"; // Recipient's address
  const amount = web3.utils.toWei("2", "ether"); // Amount to send (adjust as needed)
  const privateKey = `0x${myPrivateKey}`;

  // Check balance
  try {
    const balance = await tokenContract.methods.balanceOf(fromAddress).call();
   
    if (balance < amount) {
      console.error("Insufficient token balance");
      return;
    }

    // Check MATIC balance
    const maticBalance = await web3.eth.getBalance(fromAddress); 
    // if (
    //   web3.utils
    //     .toBN(maticBalance)
    //     .lt(web3.utils.toBN(web3.utils.toWei("0.1", "ether")))
    // ) {
    //   // Example MATIC threshold
    //   console.error("Insufficient MATIC balance for gas");
    //   return;
    // }

    const nonce = await web3.eth.getTransactionCount(fromAddress, "pending");
    const txData = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(100000), // Increase the gas limit
      gasPrice: web3.utils.toHex(web3.utils.toWei("20", "gwei")), // Adjust the gas price
      to: tokenAddress,
      from: fromAddress,
      value: "0x0",
      data: tokenContract.methods.transfer(toAddress, amount).encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      txData,
      privateKey
    );
    web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .on("receipt", (receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .on("error", (error) => {
        console.error("Transaction error:", error);
      });
  } catch (error) {
    console.error("Error:", error);
  }
};
