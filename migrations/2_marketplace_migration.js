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
            marketplace.createUser(3, 0, "Maxim", "Math", 5, "0x5EAFf4c9D6768c2F965bdB0cC55442Db22082479");
            marketplace.createUser(4, 0, "John", "Math", 6, "0x2E03170FD04dDe12af28d2926a5fb1017D8C5201");
            marketplace.createUser(2, 1, "Smith", "Math", 2, "0xe32268d7bEc6AFBFDc0719e58de3871B46b26905");
            marketplace.createUser(2, 1, "Teo", "Math", 2, "0xd4445Afd3743723Bd785a5Fc55aCB36b79e4bd88");
            marketplace.createManager("Geo", "0x466988018832FD7272Fb52A79b7631A2F5Ea6F90", 20);
        });
};
