import React, { useEffect, useState } from 'react';
import { approve, createTask, verifyManager, getTokensBalance } from '../../components/ethereum/ethreum';
import './CreateTaskPage.css';

const CreateTaskPage = (props) => {
    const [rewardFreelancer, setRewardFreelancer] = useState(0);
    const [rewardEvaluator, setRewardEvaluator] = useState(0);
    const [timeToResolve, setTimeToResolve] = useState(0);
    const [timeToEvaluate, setTimeToEvaluate] = useState(0);
    const [domain, setDomain] = useState("Math");
    const [description, setDescription] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [txHash, setTxHash] = useState("");
    const [taskId, setTaskId] = useState("");

    useEffect(() => {
        async function fetchData() {
            let isManager = await verifyManager();
            setIsManager(isManager);
            let b = await getTokensBalance();
            setBalance(b);
        }
        fetchData();

        window.ethereum.on('accountsChanged', function (accounts) {
            verifyManager().then(manager => setIsManager(manager));
            getTokensBalance().then(b => setBalance(b));
        });
    }, []);

    const validateInput = () => {
        return rewardFreelancer > 0 && rewardEvaluator && rewardEvaluator + rewardFreelancer <= balance && timeToResolve > 0 && timeToEvaluate > 0 && description != 0;
    }

    const validateApprove = () => {
        return parseInt(rewardFreelancer) > 0 && parseInt(rewardEvaluator) > 0;
    }

    const addTask = async () => {
        setLoading(true);
        let result = await createTask(rewardFreelancer, rewardEvaluator, timeToResolve, timeToEvaluate, domain, description);
        setLoading(false);
        setTxHash(result.hash);
        setTaskId(result.id);
    }

    const approveAmount = async () => {
        setLoading(true);
        let result = await approve(parseInt(rewardFreelancer) + parseInt(rewardEvaluator));
        setLoading(false);
    }

    return (
        <React.Fragment>
            {isManager ?
                <div className="flexer">
                    <main>
                    <section className="flex-container">
                        <h2>Create new task (balance: {balance})</h2>
                        <div className="item">
                            <label htmlFor="category">Domain</label>
                            <select value={domain} id="category" onChange={event => setDomain(event.target.value)}>
                                <option value="Math">Math</option>
                                <option value="Biology">Biology</option>
                                <option value="Legally">Legally</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="name">Description</label>
                            <input type="text" id="name" onChange={event => setDescription(event.target.value)} />
                        </div>
                        <div className="item omrs-input-group">
                            <label htmlFor="rewardFreelancer" className="omrs-input-label">Reward Freelancer</label>
                            <input type="number" id="rewardFreelancer" onChange={event => setRewardFreelancer(parseInt(event.target.value))} />
                        </div>
                        <div className="item omrs-input-group">
                            <label htmlFor="rewardEvaluator" className="omrs-input-label">Reward Evaluator</label>
                            <input type="number" id="rewardEvaluator" onChange={event => setRewardEvaluator(parseInt(event.target.value))} />
                        </div>
                        <div className="item omrs-input-group">
                            <label htmlFor="timeToResolve" className="omrs-input-label">Time to resolve</label>
                            <input type="number" id="timeToResolve" onChange={event => setTimeToResolve(parseInt(event.target.value))} />
                        </div>
                        <div className="item omrs-input-group">
                            <label htmlFor="timeToEvaluate" className="omrs-input-label">Time to evaluate</label>
                            <input type="number" id="timeToEvaluate" onChange={event => setTimeToEvaluate(parseInt(event.target.value))} />
                        </div>
                        <div>Before creating a new task you need to approve contract to transfer your funds</div>
                        <div>Amount = {rewardFreelancer + rewardEvaluator}</div>
                        <button onClick={approveAmount} disabled={!validateApprove()}>Approve</button>
                        <button onClick={addTask} disabled={!validateInput()}>Create task</button>
                        {loading ? <div id="loader"></div> : null}
                        {txHash !== "" ? (<div>Transaction hash: {txHash}<br /> User id: {taskId}</div>) : null}
                    </section>
                </main>
                </div>  : <div>You are not a manager</div>
            }
        </React.Fragment>
    )

}

export default CreateTaskPage;