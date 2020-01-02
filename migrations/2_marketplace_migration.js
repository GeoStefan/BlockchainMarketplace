const StandardToken = artifacts.require("StandardToken");
const Marketplace = artifacts.require("Marketplace");

module.exports = function (deployer) {
    let tokenContract;
    deployer.deploy(StandardToken, 1000, "LEI", 2, "LEI")
        .then((token) => {
            tokenContract = token;
            return deployer.deploy(Marketplace);
        })
        .then(() => Marketplace.deployed())
        .then(marketplace => {
            marketplace.setTokenContract(StandardToken.address);
            tokenContract.approve(Marketplace.address, 1000);
        });
};
