import Web3 from 'web3';
import marketplaceAbi from './marketplace';
import tokenAbi from './token';

export const marketplaceAddress = "0xfeaa12f5DEf1C6df7fc8A2174381F67d83c10F7F";
export const tokenAddress = "0xb9BD9f75BC04B426E4746300f77074286FB5c250";

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

export const verifyAdmin = async () => {
    let address = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let admin = await contract.methods.owner().call();
    return address === admin;
}

export const createActor = async (charge, time, type, name, category, amount, address) => {
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let result = await contract.methods.createActor(charge, time, type, name, category, amount, address).send({
        from: userAddress
    });
    return { hash: result.transactionHash, id: result.events.ActorCreated.returnValues.userId };
}