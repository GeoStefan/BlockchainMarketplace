
import React, { useState, useEffect } from 'react';
import { getTask, createTask, getTasksNumber } from '../../components/ethereum/ethreum';
import '../tasks/tasks.css';

const TasksList = (props) => {
    const [taskArray, setTaskArray] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let n = await getTasksNumber();
            let array = [];
            for (let i = 0; i < n; i += 1) {
                let arrayItem = await getTask(i);
                console.log(arrayItem);
                array.push(arrayItem);
            }
            console.log(array);
            setTaskArray(array);
        }
        fetchData();
    }, []);

    function getStatus(status) {
        if (status === '0') {
            return 'Created';
        } else if (status === '1') {
            return 'Edited';
        }
        return 'Canceled';
    }

    return (
        <React.Fragment>
            <p>Below is a list of all of the available tasks:</p>
            {taskArray && taskArray.map(task => 
                <div className="tasks">
                    <div className="evaluators">
                        <p className="section__eval--dark">Domain: {task.domain}</p>
                        <p className="section__eval">Freelancer Reward is {task.rewardFreelancer}</p>
                        <p className="section__eval--dark">Evaluator Reward is {task.rewardEvaluator}</p>
                        <p className="section__eval">Time to Resolve is {task.timeToResolve}</p>
                        <p className="section__eval--dark">Time to Evaluate is {task.timeToEvaluate}</p>
                        <p className="section__eval">{task.description}</p>
                        <p className="section__eval--dark">Status is {getStatus(task.status)}</p>
                    </div>
                </div>)}
        </React.Fragment>
    )
}

export default TasksList;
