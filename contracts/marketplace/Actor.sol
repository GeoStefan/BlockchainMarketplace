pragma solidity ^0.5.8;

contract Actor {
    enum ActorType { Freelancer, Evaluator }

    struct User {
        uint charge;
        uint8 reputation;
        ActorType actorType;
        string name;
        string category;
    }

    struct Manager {
        uint8 reputation;
        address managerAddress;
        string name;
    }

    event ActorCreated(uint userId, address userAddress);
    event ManagerCreated(uint managerId, address managerAddress);

    User[] users;
    Manager[] public managers;

    // Replace this mapping with inverse one
    mapping(uint => address) usersToAddress;
    mapping(address => uint) addressToUser;

    mapping(address => uint) addressToManager;

    modifier onlyManager() {
        require(_isManager(msg.sender), "Is not manager");
        _;
    }

    function _addActor(uint _charge, ActorType _actorType, string memory _name, string memory _category) internal returns(uint) {
        User memory user = User(_charge, uint8(5), _actorType, _name, _category);
        uint index = users.push(user) - 1;
        return index;
    }

    function getActor(uint id) external view returns(uint charge, ActorType actorType, string memory name,
     string memory category, address actorAddress) {
        User storage actor = users[id];
        actorAddress = usersToAddress[id];
        return (actor.charge, actor.actorType, actor.name, actor.category, actorAddress);
    }

    function getActorsNumber() external view returns(uint) {
        return users.length;
    }

    function getManagersNumber() external view returns(uint) {
        return managers.length;
    }

    function isManager(address claimant) external view returns (bool) {
        return _isManager(claimant);
    }

    function _isManager(address claimant) internal view returns (bool) {
        uint id = addressToManager[claimant];
        return claimant == managers[id].managerAddress;
    }

}