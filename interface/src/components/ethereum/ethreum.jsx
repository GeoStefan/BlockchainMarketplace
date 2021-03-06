import Web3 from 'web3';
import marketplaceAbi from './marketplace';
import tokenAbi from './token';

export const marketplaceAddress = "0xcf84dBc04480Aba4478D20AC5522Cb115a80F544";
export const tokenAddress = "0xc20C94c0A70FA8CCD39de7A3A36ec1B72bf96d94";

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
        actor.id = i;
        console.log(actor);
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

export const modifyTask = async (taskId, rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description) => {
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    console.log(taskId, rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description);
    let result = await contract.methods.modifyTask(taskId, rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description).send({
            from: userAddress
        });
    return { hash: result.transactionHash };
}

export const cancelTask = async (taskId) => {
    let userAddress = await getAccountAddress();
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let result = await contract.methods.cancelTask(taskId).send({
            from: userAddress
        });
    return { hash: result.transactionHash };
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

export const addEvaluatorForTask = async (taskId, evaluatorId) => {
    console.log(taskId, evaluatorId);
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let userAddress = await getAccountAddress();
    await contract.methods.addEvaluatorForTask(taskId, evaluatorId).send({
        from: userAddress
    });
}

export const acceptTaskToEvaluate = async (taskId) => {
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let userAddress = await getAccountAddress();
    await contract.methods.acceptTaskToEvaluate(taskId).send({
        from: userAddress
    });
}

export const getUsersForTask = async (taskId) => {
    let web3 = await getWeb3Instance();
    const contract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
    let freelancers = [], evaluators = [];
    let length = await contract.methods.getUsersNumberForCreatedTask(taskId).call();
    for (let i = 0; i < length; i++) {
        let userId = await contract.methods.getUsersForCreatedTask(taskId, i);
        let user = await getActor(userId);
        if (user.actorType == "0")
            freelancers.push(user);
        else evaluators.push(user);
    }
    return { freelancers: freelancers, evaluators: evaluators };
}