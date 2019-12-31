pragma solidity ^0.5.10;

import './Actor.sol';
import '../token/ERC20Basic.sol';
import '../lifecycle/Pausable.sol';

contract Marketplace is Actor, Pausable {

    struct Task {
        uint rewardFreelancer;
        uint rewardEvaluator;
        uint timeToResolve;
        uint timeToEvaluate;
        string domain;
        string description;
        TaskStatus status;
    }

    Task[] tasks;

    enum TaskStatus { Created, Assigned, Resolved, Accepted, Rejected }

    mapping(uint => User) taskToManager;

    mapping(uint => User) taskToFreelancer;

    mapping(address => uint[]) freelancerTasks;

    mapping(uint => User[]) taskToUsers;

    mapping(address => uint[]) evaluatorTasks;

    ERC20Basic tokenContract;

    function createActor(uint _charge, uint _time, ActorType _actorType, string calldata _name, string calldata _category, uint _amount,
     address _actorAddress) external onlyOwner returns(uint) {
        uint index = _addActor(_charge, _time, _actorType, _name, _category);
        usersToAddress[index] = _actorAddress;
        tokenContract.transfer(_actorAddress, _amount);
        return index;
    }

}