import Web3 from 'web3';
import marketplaceAbi from './marketplace';
import tokenAbi from './token';

export const marketplaceAddress = "0x7957D8146165c89B4Eb4c6C6f4a45a0A06B6da49";
export const tokenAddress = "0x7Ca1ef0974afBbe02c36173bfcEC86bDa5743Bba";

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

export const verifyManager = async () => {
    let address = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let manager = await contract.methods.isManager(address).call();
    return manager;
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
        if (actor.actorType == "0") {
            freelancers.push(actor);
        } else {
            evaluators.push(actor);
        }
    }
    return { freelancers: freelancers, evaluators: evaluators };
}

export const createTask = async (rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description) => {
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    console.log(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description);
    let result = await contract.methods.createTask(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description).send({
        from: userAddress
    });
    return { hash: result.transactionHash, id: result.events.TaskCreated.returnValues.taskId };
}

export const approve = async (value) => {
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(tokenAbi, tokenAddress);
    let result = contract.methods.approve(marketplaceAddress, value).send({
        from: userAddress
    });
    return result.transactionHash;
}

export const getTask = async (taskId) => {
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let result = await contract.methods.tasks(taskId).call();
    return result;
}

export const getTasksNumber = async () => {
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let result = await contract.methods.getTasksNumber().call();
    return result;
}