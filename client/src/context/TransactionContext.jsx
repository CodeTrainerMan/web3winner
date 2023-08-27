import React, { useEffect, useState } from "react";
import { MerkleTree } from 'merkletreejs';
// import ethers from "ethers";
import { BrowserProvider,parseEther,Contract } from "ethers";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = async () => {
  // const provider = new ethers.providers.Web3Provider(ethereum);
  // ethers.BrowserProvider
  // const provider = new ethers.BrowserProvider(window.ethereum);
  // const signer =  provider.getSigner();
  let signer = null;

  let provider;
    if (window.ethereum == null) {

      
      console.log("MetaMask not installed; using read-only defaults")
      provider = ethers.getDefaultProvider()

    } else {

      
      provider = new ethers.BrowserProvider(window.ethereum)

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();
    }
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(parseInt(transaction.timestamp) * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount) / (10 ** 18)
        }));
        const whitelist = [
          {address:"0xfc3921042358aC9a4092C4506bD20C6d9744DA47",quantity: 981},
          {address:"0x5d46Cc7813E97AC4379df8c1Fe30B8c875754aa0",quantity: 711},
          {address:"0x9F7827F2EeD4E608d22057e03d6aAe593F0e47ae",quantity: 9},
          {address:"0xA76f2B935C04Ab0D1c2EB16a4A7f410C656Cf645",quantity: 1},
          {address:"0x5484B2df5674e2E3F9954C3972774fd2bF0A5326",quantity: 170},
          {address:"0x03a6dfE7c7AA062F23B56657313571cD1CD4aDf9",quantity: 1057},
          ];
        const levav =  whitelist.map((x)=>ethers.solidityPackedKeccak256(
          ["address","uint256"],[x.address,x.quantity]
          ));
          console.log("--------------levavs--------------------")
        console.log(levav);
        
          // const { MerkleTree } = require('merkletreejs') ;
        const merkletree = new MerkleTree(levav, ethers.keccak256, {sort:true});
        const proofs = levav.map(levav=>merkletree.getHexProof(levav));
        console.log("--------------proofs--------------------")
        console.log(proofs);
        const root = merkletree.getHexRoot();
        console.log("--------------root--------------------")
        console.log(root);
        const left =  ethers.solidityPackedKeccak256(
          ["address","uint256"],["0xA76f2B935C04Ab0D1c2EB16a4A7f410C656Cf645",1]
          );
        console.log("--------------left--------------------")
        console.log(left);
        const proof = merkletree.getHexProof(left);
        console.log("--------------proof--------------------")
        console.log(proof);
        console.log("--------------merkletree.toString()--------------------")
        console.log(merkletree.toString());
        console.log(merkletree.verify(proof,left,root));
        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        const parsedAmount = parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: ethers.toBeHex(21000),
            gasPrice: ethers.toBeHex(1000000000),
            value: ethers.toBeHex(parsedAmount),
            
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, ethers.toBeHex(parsedAmount) , message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(parseInt(transactionsCount));
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
