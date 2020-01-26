const Marketplace = artifacts.require("./marketplace/Marketplace.sol");
const StandardToken = artifacts.require("./token/StandardToken.sol");

contract("Marketplace", function (accounts) {
    before(async () => {
        this.marketplace = await Marketplace.deployed();
        this.standardToken = await StandardToken.deployed();
    });

    it("deploys contracts correctly", async () => {
        let supply = await this.standardToken.totalSupply();
        let ownerBalance = await this.standardToken.balanceOf(accounts[0]);
        let tokensAllowedToTransfer = await this.standardToken.allowance(accounts[0], this.marketplace.address);
        let owner = await this.marketplace.owner();

        assert.equal(owner, accounts[0], "Owner is not correct");
        assert.equal(supply, 1000, "Total supply wasn't correct");
        assert.equal(ownerBalance, 1000, "Owner balance wasn't correct");
        assert.equal(tokensAllowedToTransfer, 1000, "Marketplace is not allowed to transfer owner tokens");
    })

    it("creates new user correctly", async () => {
        const charge = 2, type = 1, name = "Ion", category = "Math", userTokens = 3, userAddress = accounts[1];

        let result = await this.marketplace.createUser(charge, type, name, category, userTokens, userAddress, { from: accounts[0] });
        let actor = await this.marketplace.getActor(result.receipt.logs[0].args.userId.toNumber());
        let actorBalance = await this.standardToken.balanceOf(userAddress);


        assert.equal(actor.charge.toNumber(), charge, "Charge wasn't correct");
        assert.equal(actor.actorType.toNumber(), type, "type wasn't correct");
        assert.equal(actor.name, name, "name wasn't correct");
        assert.equal(actor.category, category, "category wasn't correct");
        assert.equal(actorBalance, userTokens, "balance wasn't correct");
        assert.equal(actor.actorAddress, userAddress, "Address wasn't correct");
    })

    it("creates new manager correctly", async () => {
        const name = "Man", userTokens = 10, userAddress = accounts[9];

        let result = await this.marketplace.createManager(name, userAddress, userTokens, { from: accounts[0] });
        let actor = await this.marketplace.managers(0);
        let actorBalance = await this.standardToken.balanceOf(userAddress);

        assert.equal(actor.name, name, "name wasn't correct");
        assert.equal(actorBalance, userTokens, "balance wasn't correct");
        assert.equal(actor.managerAddress, userAddress, "Address wasn't correct");
    })

    it("creates new task correctly", async () => {
        const rewardFreelancer = 3, rewardEvaluator = 1, timeToResolve = 24, timeToEvaluate = 5, domain = "Math", description = "Arie triunghi";

        await this.standardToken.approve(this.marketplace.address, 4, { from: accounts[9] });
        let result = await this.marketplace.createTask(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description, { from: accounts[9] });
        let task = await this.marketplace.tasks(0);
        let manager = await this.marketplace.taskToManager(0);

        assert.equal(task.rewardFreelancer, rewardFreelancer, "Reward freelancer wasn't correct");
        assert.equal(task.rewardEvaluator, rewardEvaluator, "Reward evaluator wasn't correct");
        assert.equal(task.timeToResolve, timeToResolve, "timeToResolve wasn't correct");
        assert.equal(task.timeToEvaluate, timeToEvaluate, "timeToEvaluate wasn't correct");
        assert.equal(task.domain, domain, "domain wasn't correct");
        assert.equal(task.description, description, "description wasn't correct");
        assert.equal(task.status.toNumber(), 0, "Status wasn't correct");
        assert.equal(manager, accounts[9], "Manager of task wasn't correct");
    })

    it("adds evaluator for task correctly", async () => {
        const taskId = 0, userId = 0;

        let result = await this.marketplace.addEvaluatorForTask(taskId, userId, { from: accounts[9] });
        let usersForTask = await this.marketplace.getUsersNumberForCreatedTask(taskId);
        let id = await this.marketplace.getUsersForCreatedTask(taskId, 0);

        assert.equal(usersForTask.toNumber(), 1, "Number of users for task wasn't correct");
        assert.equal(id.toNumber(), userId, "User id for task wasn't correct");
    })

    it("modifies task correctly", async () => {
        const taskId = 0, rewardFreelancer = 3, rewardEvaluator = 1, timeToResolve = 30, timeToEvaluate =7, domain = "Math", description = "Arie triunghi isoscel";

        let result = await this.marketplace.modifyTask(taskId, rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description, { from: accounts[9] });
        let task = await this.marketplace.tasks(0);
        assert.equal(task.rewardFreelancer, rewardFreelancer, "Reward freelancer wasn't correct");
        assert.equal(task.rewardEvaluator, rewardEvaluator, "Reward evaluator wasn't correct");
        assert.equal(task.timeToResolve, timeToResolve, "timeToResolve wasn't correct");
        assert.equal(task.timeToEvaluate, timeToEvaluate, "timeToEvaluate wasn't correct");
        assert.equal(task.domain, domain, "domain wasn't correct");
        assert.equal(task.description, description, "description wasn't correct");
        assert.equal(task.status.toNumber(), 0, "Status wasn't correct");
    })
})