pragma solidity ^0.5.8;

contract Actor {
    enum ActorType { Manager, Freelancer, Evaluator }

    struct User {
        uint charge;
        uint8 reputation;
        ActorType actorType;
        string name;
        string category;
    }

    event ActorCreated(uint userId, address userAddress);

    User[] users;

    mapping(uint => address) usersToAddress;

    // OPTIONAL: verify actor is not duplicated
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

}