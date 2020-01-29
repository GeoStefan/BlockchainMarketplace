
import React, { useState, useEffect } from 'react';
import Popup from "reactjs-popup";
import { approve, getTask, modifyTask, getTasksNumber } from '../../components/ethereum/ethreum';
import Modal from 'react-modal';
import '../tasks/tasks.css';

const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            taskArray: [],
            domain: '',
            description: '',
            rewardFreelancer: '',
            rewardEvaluator: '',
            timeToResolve: '',
            timeToEvaluate: '',
            loading: false,
            taskId: 0,
        }

        this.getStatus = this.getStatus.bind(this);
        this.openModal = this.openModal.bind(this);
        // this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.validateApprove = this.validateApprove.bind(this);
        this.setTaskArray = this.setTaskArray.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.approveAmount = this.approveAmount.bind(this);
        this.modifyTask = this.modifyTask.bind(this);
    }

    setTaskArray(currentComponent, array) {
        currentComponent.setState({
                taskArray: array,
            })
    }

    async fetchData() {
        let n = await getTasksNumber();
        let array = [];
        for (let i = 0; i < n; i += 1) {
            let arrayItem = await getTask(i);
            array.push(arrayItem);
        }
        this.setState({
            taskArray: array,
        })
    }

    componentDidMount() {
        this.fetchData();
    }

    getStatus(status) {
        if (status === '0') {
            return 'Created';
        } else if (status === '1') {
            return 'Edited';
        }
        return 'Canceled';
    }
    
    openModal() {
        this.setState({modalIsOpen: true});
    }
    
    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }
    
    closeModal() {
        this.setState({modalIsOpen: false});
    }


    validateInput() {
        return this.state.rewardFreelancer > 0 && 
            this.state.rewardEvaluator && 
            this.state.rewardEvaluator + this.state.rewardFreelancer <= this.state.balance && 
            this.state.timeToResolve > 0 &&
            this.state.timeToEvaluate > 0 && 
            this.state.description != 0;
    }

    validateApprove() {
        return parseInt(this.state.rewardFreelancer) > 0 && parseInt(this.state.rewardEvaluator) > 0;
    }


    async modifyTask(currentTaskId) {
        this.setState({
            loading: true,
        })
        let result = await modifyTask(
            0, 
            this.state.rewardFreelancer, 
            this.state.rewardEvaluator, 
            this.state.timeToResolve, 
            this.state.timeToEvaluate, 
            this.state.domain, 
            this.state.description
            );
        this.setState({
            loading: false,
            txHash: result.hash,
            taskId: result.id,
        })
    }

    async approveAmount() {
        this.setState({
            loading: true,
        })
        let result = await approve(parseInt(this.state.rewardFreelancer) + parseInt(this.state.rewardEvaluator));
        this.setState({
            loading: false,
        })
    }


    render() {
        return (
            <React.Fragment>
                <p>Below is a list of all of the available tasks:</p>
                {this.state.taskArray !== [] && this.state.taskArray.map(task => 
                    <div className="tasks">
                        <div className="evaluators">
                            <p className="section__eval--dark">Domain: {task.domain}</p>
                            <p className="section__eval">Freelancer Reward is {task.rewardFreelancer}</p>
                            <p className="section__eval--dark">Evaluator Reward is {task.rewardEvaluator}</p>
                            <p className="section__eval">Time to Resolve is {task.timeToResolve}</p>
                            <p className="section__eval--dark">Time to Evaluate is {task.timeToEvaluate}</p>
                            <p className="section__eval">{task.description}</p>
                            <p className="section__eval--dark">Status is: {this.getStatus(task.status)}</p>
                            <p className="section__eval">
                                <button onClick={this.openModal}>Edit Task</button>
                                <Modal
                                    isOpen={this.state.modalIsOpen}
                                    // onAfterOpen={this.afterOpenModal}
                                    onRequestClose={this.closeModal}
                                    style={customStyles}
                                    contentLabel="Edit Modal"
                                >
                                    <div className="flexer">
                                        <main>
                                        <section className="flex-container">
                                            <div className="item">
                                                <label htmlFor="category">Domain</label>
                                                <select value={this.state.domain} id="category" onChange={event => this.setState({domain: event.target.value})}>
                                                    <option value="Math">Math</option>
                                                    <option value="Biology">Biology</option>
                                                    <option value="Legally">Legally</option>
                                                </select>
                                            </div>
                                            <div className="item">
                                                <label htmlFor="name">Description</label>
                                                <input type="text" id="name" onChange={event => this.setState({description: event.target.value})} />
                                            </div>
                                            <div className="item omrs-input-group">
                                                <label htmlFor="rewardFreelancer" className="omrs-input-label">Reward Freelancer</label>
                                                <input type="number" id="rewardFreelancer" onChange={event => this.setState({rewardFreelancer: parseInt(event.target.value)})} />
                                            </div>
                                            <div className="item omrs-input-group">
                                                <label htmlFor="rewardEvaluator" className="omrs-input-label">Reward Evaluator</label>
                                                <input type="number" id="rewardEvaluator" onChange={event => this.setState({rewardEvaluator: parseInt(event.target.value)})} />
                                            </div>
                                            <div className="item omrs-input-group">
                                                <label htmlFor="timeToResolve" className="omrs-input-label">Time to resolve</label>
                                                <input type="number" id="timeToResolve" onChange={event => this.setState({timeToResolve: parseInt(event.target.value)})} />
                                            </div>
                                            <div className="item omrs-input-group">
                                                <label htmlFor="timeToEvaluate" className="omrs-input-label">Time to evaluate</label>
                                                <input type="number" id="timeToEvaluate" onChange={event => this.setState({timeToEvaluate: parseInt(event.target.value)})} />
                                            </div>
                                            <div>Before creating a new task you need to approve contract to transfer your funds</div>
                                            <div>Amount = {this.state.rewardFreelancer + this.state.rewardEvaluator}</div>
                                            <button onClick={this.approveAmount} disabled={!this.validateApprove()}>Approve</button>
                                            <button onClick={() => this.modifyTask(this.state.taskArray.indexOf(task))}>Modify task</button>
                                            {this.state.loading ? <div id="loader"></div> : null}
                                            {this.state.txHash !== "" ? (<div>Transaction hash: {this.state.txHash}<br /> User id: {this.state.taskId}</div>) : null}
                                        </section>
                                    </main>
                                    </div>
                                </Modal>
                            </p>
                        </div>
                    </div>)}
            </React.Fragment>
        )
    }
}

export default TasksList;
