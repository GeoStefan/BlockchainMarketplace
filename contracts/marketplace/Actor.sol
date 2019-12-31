pragma solidity ^0.5.10;

contract Actor {
    enum ActorType { Manager, Freelancer, Evaluator }

    struct User {
        uint charge;
        uint time;
        uint8 reputation;
        ActorType actorType;
        string name;
        string category;
    }

    User[] users;

    mapping(uint => address) usersToAddress;

    // OPTIONAL: verify actor is not duplicated
    function _addActor(uint _charge, uint _time, ActorType _actorType, string memory _name, string memory _category) internal returns(uint) {
        User memory user = User(_charge, _time, uint8(5),_actorType, _name, _category);
        uint index = users.push(user);
        return index;
    }

}