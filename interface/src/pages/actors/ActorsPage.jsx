import React, { useState, useEffect } from 'react';
import { getActors } from '../../components/ethereum/ethreum';
import './actors.css';

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
        <div className="actors__list">
            <div>
                <p className="title">Freelancers</p>
                <div className="freelancers_list">{freelancers.map(f => 
                    <div className="freelancers">
                        <p className="section__dark">Name</p>
                        <p>{f.name}</p>
                        <p className="section__dark">Address</p>
                        <p>{f.actorAddress}</p>
                        <p className="section__dark">Charge</p>
                           <p>{f.charge}$</p>
                    </div>
                )}</div>
            </div>
            <div>
                <p className="title">Evaluators</p>
                <div className="evaluators_list">{evaluators.map(f => 
                    <div className="evaluators">
                        <p className="section__eval--dark">Name</p>
                        <p>{f.name}</p>
                        <p className="section__eval--dark">Address</p>
                        <p>{f.actorAddress}</p>
                        <p className="section__eval--dark">Charge</p>
                        <p>{f.charge}$</p>
                    </div>
                )}</div>
            </div>
        </div>

    )
}

export default ActorsPage;