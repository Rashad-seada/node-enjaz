const abi =  require('../utils/Enjaz.json')
const { ethers } = require("ethers");
const {Web3} = require("web3");

const contractABI = abi.abi;
const contractAddress = "0x53593143F44dB985A5E2E1f1e3e0E5C2C4f6a9fB";
const httpUrl = "https://eth-sepolia.g.alchemy.com/v2/DnY8WJnH3sdylRTV04_l-sDJdnATGgK4";
const privateKey = process.env.PRIVATE_KEY;

const getEthereumContract = () => {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(httpUrl))

        web3.eth.accounts.wallet.add(privateKey);

        const contract = new web3.eth.Contract(contractABI,contractAddress)
        return contract;
    } catch (error){
        throw new Error(error.message)
    }
  
};

module.exports = getEthereumContract;

  