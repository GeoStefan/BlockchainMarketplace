import React, { useState, useEffect } from 'react';
import { getActors } from '../../components/ethereum/ethreum';

const ActorsPage = (props) => {
    let [freelancers, setFreelancers] = useState([]);
    let [evaluators, setEvaluators] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let { freelancers, evaluators } = await getActors();
            console.log(freelancers);
            setFreelancers(freelancers);
            setEvaluators(evaluators);
        }
        fetchData();

    }, []);

    return (
        <div>
            <div>ActorsPage</div>
            <div>{freelancers.map(f => <div>{f.name} {f.actorAddress} {f.charge}</div>)}</div>
        </div>

    )
}

export default ActorsPage;