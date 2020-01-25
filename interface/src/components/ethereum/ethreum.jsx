import Web3 from 'web3';
import marketplaceAbi from './marketplace';
import tokenAbi from './token';

export const marketplaceAddress = "0x8BcE9045499AF6F44b12CcB79beeb1Fa53321019";
export const tokenAddress = "0x76B186c02F7754939705ff352643ccBFf55540fA";

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
    console.log(address, admin);
    return address === admin;
}

export const createUser = async (charge, type, name, category, amount, address) => {
    console.log(charge, type, name, category, amount, address);
    console.log(typeof type);
    console.log(typeof charge);
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let result = await contract.methods.createUser(charge, type, name, category, amount, address).send({
        from: userAddress
    });
    return { hash: result.transactionHash, id: result.events.ActorCreated.returnValues.userId };
}

export const createManager = async (name, amount, address) => {
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let result = await contract.methods.createManager(name, address, amount).send({
        from: userAddress
    });
    return { hash: result.transactionHash, id: result.events.ManagerCreated.returnValues.userId };
}

export const getTokensBalance = async () => {
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(tokenAbi, tokenAddress);
    let result = await contract.methods.balanceOf(userAddress).call();
    return result;
}

export const getActor = async (id) => {
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let result = await contract.methods.getActor(id).call();
    console.log(result);
    return result;
}

export const getActors = async () => {
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    const length = await contract.methods.getActorsNumber().call();
    console.log(length);
    let freelancers = [], evaluators = [];
    for (let i = 0; i < length; i++) {
        let actor = await getActor(i);
        if (actor.actorType == "1") {
            freelancers.push(actor);
        } else {
            evaluators.push(actor);
        }
    }
    return { freelancers: freelancers, evaluators: evaluators };
}