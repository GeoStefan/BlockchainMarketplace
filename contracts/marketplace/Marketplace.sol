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

    Task[] public tasks;

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

    mapping(uint => address) public taskToManager;

    mapping(uint => User) taskToFreelancer;

    mapping(uint => uint) taskToEvaluator;

    mapping(address => uint[]) freelancerTasks;

    mapping(uint => uint[]) taskToUsers;

    mapping(address => uint[]) evaluatorTasks;

    ERC20 tokenContract;

    function createUser(uint _charge, ActorType _actorType, string calldata _name, string calldata _category, uint _amount,
     address _actorAddress) external onlyOwner {
        uint index = _addActor(_charge, _actorType, _name, _category);
        usersToAddress[index] = _actorAddress;
        addressToUser[_actorAddress] = index;
        emit ActorCreated(index, _actorAddress);

        tokenContract.transferFrom(msg.sender, _actorAddress, _amount);
    }

    function createManager(string calldata _name, address _managerAddress, uint _amount) external onlyOwner {
        Manager memory manager = Manager(uint8(5), _managerAddress, _name);
        uint index = managers.push(manager) - 1;
        addressToManager[_managerAddress] = index;
        emit ManagerCreated(index, _managerAddress);

        tokenContract.transferFrom(msg.sender, _managerAddress, _amount);
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
        ) external onlyManager returns (uint index) {
            _validateTaskParams(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate);
            require(rewardFreelancer + rewardEvaluator < tokenContract.balanceOf(msg.sender), "Insuficient founds");

            tokenContract.transferFrom(msg.sender, address(this), rewardFreelancer + rewardEvaluator);

            emit TaskCreated(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description, TaskStatus.Created);
            Task memory task = Task(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description, TaskStatus.Created);
            index = tasks.push(task) - 1;
            taskToManager[index] = msg.sender;
    }

    function modifyTask(uint taskId,
        uint rewardFreelancer,
        uint rewardEvaluator,
        uint timeToResolve,
        uint timeToEvaluate,
        string calldata domain,
        string calldata description) external {
            require(taskId < tasks.length, "Invalid task id");
            require(taskToManager[taskId] == msg.sender, "Sender is not the manager of task");
            _validateTaskParams(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate);
            uint newRewards = rewardFreelancer + rewardEvaluator;
            Task storage task = tasks[taskId];
            uint oldRewards = task.rewardFreelancer + task.rewardEvaluator;
            require(newRewards >= oldRewards, "Total of new rewards should be greater than total of old rewards");
            require(task.status == TaskStatus.Created || task.status == TaskStatus.Opened, "Cannot modify on current task status");

            task.rewardFreelancer = rewardFreelancer;
            task.rewardEvaluator = rewardEvaluator;
            task.timeToResolve = timeToResolve;
            task.timeToEvaluate = timeToEvaluate;
            task.domain = domain;
            task.description = description;

            if(newRewards > oldRewards) {
                tokenContract.transferFrom(msg.sender, address(this), newRewards - oldRewards);
            }
    }

    function addEvaluatorForTask(uint taskId, uint evaluatorId) external onlyManager {
        require(taskId < tasks.length, "Invalid task id");
        require(evaluatorId < users.length, "Invalid user id");
        require(taskToManager[taskId] == msg.sender, "Sender is not the manager of task");
        User memory user = users[evaluatorId];
        require(user.actorType == ActorType.Evaluator, "User is not an evaluator");

        emit EvaluatorAssignedToTask(evaluatorId, usersToAddress[evaluatorId], taskId);
        taskToUsers[taskId].push(evaluatorId);
    }

    function cancelTask(uint taskId) external onlyManager {
        require(taskId < tasks.length, "Invalid task id");
        require(taskToManager[taskId] == msg.sender, "Sender is not the manager of task");
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Created || task.status == TaskStatus.Applied || task.status == TaskStatus.Opened,
         "Task cannot be canceled because of status");

        emit TaskCanceled(taskId);
        tasks[taskId].status = TaskStatus.Canceled;
        tokenContract.transferFrom(address(this), msg.sender, tasks[taskId].rewardFreelancer + tasks[taskId].rewardEvaluator);
        for(uint i = 0; i < taskToUsers[taskId].length; i++) {
            if(users[taskToUsers[taskId][i]].actorType == ActorType.Freelancer) {
                tokenContract.transferFrom(address(this), usersToAddress[taskToUsers[taskId][i]], tasks[taskId].rewardEvaluator);
            }
        }
    }

    function acceptTaskToEvaluate(uint taskId) external {
        require(_isEvaluatorForTask(msg.sender, taskId), "Sender is not evaluator for task");
        require(tasks[taskId].status == TaskStatus.Created, "Task status is not 'created'");

        tasks[taskId].status == TaskStatus.Opened;
        taskToEvaluator[taskId] = addressToUser[msg.sender];
        evaluatorTasks[msg.sender].push(taskId);
    }

    function _isEvaluatorForTask(address claimant, uint taskId) internal view returns (bool) {
        for(uint i = 0; i < taskToUsers[taskId].length; i++) {
            if(taskToUsers[taskId][i] == addressToUser[claimant]) {
                return true;
            }
        }
        return false;
    }

    function _validateTaskParams(uint rewardFreelancer, uint rewardEvaluator, uint timeToResolve, uint timeToEvaluate)
        internal pure returns (bool) {
            require(rewardFreelancer > 0, "rewardFreelancer is invalid");
            require(rewardEvaluator > 0, "rewardEvaluator is invalid");
            require(timeToResolve > 0, "timeToResolve is invalid");
            require(timeToEvaluate > 0, "timeToEvaluate is invalid");
            require(rewardFreelancer + rewardEvaluator > rewardEvaluator, "Rewards overflow");
    }

    function getUsersForCreatedTask(uint taskId, uint index) external view returns (uint) {
        return taskToUsers[taskId][index];
    }

    function getUsersNumberForCreatedTask(uint taskId) external view returns (uint) {
        return taskToUsers[taskId].length;
    }
}