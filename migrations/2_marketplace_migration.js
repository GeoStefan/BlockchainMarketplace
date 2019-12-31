const StandardToken = artifacts.require("StandardToken");
const Marketplace = artifacts.require("Marketplace");

module.exports = function (deployer) {
    deployer.deploy(StandardToken, 1000, "LEI", 2, "LEI")
        .then(() => deployer.deploy(Marketplace))
        .then(() => Marketplace.deployed())
        .then(marketplace => marketplace.setTokenContract(StandardToken.address));
};
