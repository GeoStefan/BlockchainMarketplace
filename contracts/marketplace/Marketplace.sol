pragma solidity ^0.5.8;

import './Actor.sol';
import '../token/ERC20.sol';
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

    enum TaskStatus { Created, Opened, Applied, Assigned, Resolved, Accepted, Rejected, Canceled }

    event TaskCreated(uint rewardFreelancer,
        uint rewardEvaluator,
        uint timeToResolve,
        uint timeToEvaluate,
        string domain,
        string description,
        TaskStatus status);
    event TaskCanceled(uint taskId);
    event EvaluatorAssignedToTask(uint evaluatorId, address evaluator, uint taskId);

    mapping(uint => User) taskToManager;

    mapping(uint => User) taskToFreelancer;

    mapping(address => uint[]) freelancerTasks;

    mapping(uint => uint[]) taskToUsers;

    mapping(address => uint[]) evaluatorTasks;

    ERC20 tokenContract;

    function createActor(uint _charge, uint _time, ActorType _actorType, string calldata _name, string calldata _category, uint _amount,
     address _actorAddress) external onlyOwner returns(uint) {
        uint index = _addActor(_charge, _time, _actorType, _name, _category);
        usersToAddress[index] = _actorAddress;
        tokenContract.transfer(_actorAddress, _amount);
        return index;
    }

    function setTokenContract(address _tokenContract) public onlyOwner {
        require(_tokenContract != address(0), "Token contract address is 0x");

        tokenContract = ERC20(_tokenContract);
    }

    function createTask(uint rewardFreelancer,
        uint rewardEvaluator,
        uint timeToResolve,
        uint timeToEvaluate,
        string calldata domain,
        string calldata description
        ) external onlyOwner returns (uint index) {
            require(rewardFreelancer > 0, "rewardFreelancer is invalid");
            require(rewardEvaluator > 0, "rewardEvaluator is invalid");
            require(timeToResolve > 0, "timeToResolve is invalid");
            require(timeToEvaluate > 0, "timeToEvaluate is invalid");
            // can overflow
            require(rewardFreelancer + rewardEvaluator <= tokenContract.balanceOf(msg.sender), "Insuficient founds");

            tokenContract.transferFrom(msg.sender, address(this), rewardFreelancer + rewardEvaluator);

            emit TaskCreated(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description, TaskStatus.Created);
            Task memory task = Task(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description, TaskStatus.Created);
            index = tasks.push(task);
        }

    function addEvaluatorForTask(uint taskId, uint evaluatorId) external onlyOwner {
        require(taskId < tasks.length, "Invalid task id");
        require(evaluatorId < users.length, "Invalid user id");
        User memory user = users[evaluatorId];
        require(user.actorType == ActorType.Evaluator, "User is not an evaluator");

        emit EvaluatorAssignedToTask(evaluatorId, usersToAddress[evaluatorId], taskId);
        taskToUsers[taskId].push(evaluatorId);
    }

    function cancelTask(uint taskId) external onlyOwner {
        require(taskId < tasks.length, "Invalid task id");
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Created || task.status == TaskStatus.Applied || task.status == TaskStatus.Opened,
         "Task cannot be canceled because of status");

        emit TaskCanceled(taskId);
        tasks[taskId].status = TaskStatus.Canceled;
        tokenContract.transferFrom(address(this), msg.sender, tasks[taskId].rewardFreelancer + tasks[taskId].rewardEvaluator);
        for(uint i = 0;i < taskToUsers[taskId].length; i++) {
            if(users[taskToUsers[taskId][i]].actorType == ActorType.Freelancer) {
                tokenContract.transferFrom(address(this), usersToAddress[taskToUsers[taskId][i]], tasks[taskId].rewardEvaluator);
            }
        }
    }

}