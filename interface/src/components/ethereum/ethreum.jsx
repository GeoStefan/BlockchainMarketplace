import Web3 from 'web3';
import marketplaceAbi from './marketplace';
import tokenAbi from './token';

export const marketplaceAddress = "0x3F8260B20E0Cd02a0B60aBFeFf8B3C4C0e37c1FB";
export const tokenAddress = "0x0E2D44F1Dd38f658f36154d3955CAd8f52e8309a";

export const getWeb3Instance = async () => {
    let web3Provider;
    if ('ethereum' in window) {
        console.log('web3 Provider present');
        web3Provider = window['ethereum'];
        await web3Provider.enable();
    }
    else {
        console.log('no web3 Provider');
        web3Provider = new Web3.providers.HttpProvider(`http://localhost:7545`);
    }
    return new Web3(web3Provider);
}

export const getAccountAddress = async () => {
    let web3 = await getWeb3Instance();
    let res = await web3.eth.getAccounts();
    return res[0];
}

// export const createIdentity = async (userAddress, ipfsHash, identityProviderAddress) => {
//     let web3 = await getWeb3Instance();
//     const contract = new web3.eth.Contract(userIdentityAbi, marketplaceAddress);
//     let result = await contract.methods.addIdentity(ipfsHash, identityProviderAddress).send({
//       from: userAddress
//     });
//     return result.transactionHash;
//   }

export const verifyAdmin = async () => {
    let address = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let admin = await contract.methods.owner().call();
    console.log(address + " " + admin);
    console.log(address === admin);
    return address === admin;
}