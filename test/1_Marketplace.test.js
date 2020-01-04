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

        let result = await this.marketplace.createActor(charge, type, name, category, userTokens, userAddress, { from: accounts[0] });
        let actor = await this.marketplace.getActor(result.receipt.logs[0].args.userId.toNumber());
        let actorBalance = await this.standardToken.balanceOf(userAddress);


        assert.equal(actor.charge.toNumber(), charge, "Charge wasn't correct");
        assert.equal(actor.actorType.toNumber(), type, "type wasn't correct");
        assert.equal(actor.name, name, "name wasn't correct");
        assert.equal(actor.category, category, "category wasn't correct");
        assert.equal(actorBalance, userTokens, "balance wasn't correct");
        assert.equal(actor.actorAddress, userAddress, "Address wasn't correct");
    })
})