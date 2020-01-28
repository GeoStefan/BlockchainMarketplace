import React, { useEffect, useState } from 'react';
import { getTask, createTask, getTasksNumber } from '../../components/ethereum/ethreum';


const TaskPage = (props) => {
    const [task, setTask] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const { match: { params } } = props;
            let t = await getTask(params.id);
            t.status = mapTaskStatus(t.status);
            setTask(t);
            console.log(t);
            let n = await getTasksNumber();
            console.log(n);
        }
        fetchData();
    }, []);

    const mapTaskStatus = (status) => {
        switch (status) {
            case "0": return "Created";
            case "1": return "Opened";
            case "2": return "Applied";
        }
    }

    const createView = () => {
        let items = [];
        Object.keys(task).forEach(function (key) {
            if (isNaN(key)) {
                var value = task[key];
                items.push(<div>{key}:{value}</div>);
            }
        });
        return items;
    }

    return (
        <React.Fragment>
            {task != null && createView()}
        </React.Fragment>
    )
}

export default TaskPage;