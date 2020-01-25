import React, { useEffect, useState } from 'react';
import { createUser, createManager, verifyAdmin, getTokensBalance } from '../../components/ethereum/ethreum';
import './InitializePage.css';


const InitializePage = (props) => {
    const userTypes = { Freeelancer: 0, Evaluator: 1, Manager: 2 };
    const [isAdmin, setIsAdmin] = useState(false);
    const [charge, setCharge] = useState(0);
    const [type, setType] = useState(userTypes.Freeelancer);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Math");
    const [amount, setAmount] = useState(0);
    const [address, setAddress] = useState("");
    const [txHash, setTxHash] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        async function fetchData() {
            let isAdmin = await verifyAdmin();
            setIsAdmin(isAdmin);
            let b = await getTokensBalance();
            setBalance(b);
        }
        fetchData();

        window.ethereum.on('accountsChanged', function (accounts) {
            verifyAdmin().then(admin => setIsAdmin(admin));
        });
    }, []);

    const addActor = async () => {
        setLoading(true);
        let result;
        if (type == userTypes.Manager)
            result = await createManager(name, amount, address);
        else
            result = await createUser(charge, type, name, category, amount, address);
        setLoading(false);
        setTxHash(result.hash);
        setUserId(result.id);
    }

    const validateInput = () => {
        return (type == userTypes.Manager || charge !== 0) && name !== "" && address !== "";
    }

    return (
        <React.Fragment>
            {
                isAdmin ? (
                    <section className="flex-container">
                        <h2>Create new actor</h2>
                        <div className="item">
                            <label htmlFor="type">Type</label>
                            <select value={type} id="type" onChange={event => setType(parseInt(event.target.value))}>
                                <option value={userTypes.Freeelancer}>Freeelancer</option>
                                <option value={userTypes.Evaluator}>Evaluator</option>
                                <option value={userTypes.Manager}>Manager</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" onChange={event => setName(event.target.value)} />
                        </div>
                        <div className="item omrs-input-group">
                            <label htmlFor="charge" className="omrs-input-label">Charge per hour</label>
                            <input type="number" id="charge" onChange={event => setCharge(parseInt(event.target.value))} disabled={type == userTypes.Manager} />
                        </div>
                        <div className="item">
                            <label htmlFor="category">Category</label>
                            <select value={category} id="category" onChange={event => setCategory(event.target.value)} disabled={type == userTypes.Manager}>
                                <option value="Math">Math</option>
                                <option value="Biology">Biology</option>
                                <option value="Legally">Legally</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="amount">Amount to transfer({balance} available)</label>
                            <input type="number" id="amount" onChange={event => setAmount(parseInt(event.target.value))} />
                        </div>
                        <div className="item">
                            <label htmlFor="address">Ethereum address</label>
                            <input type="text" id="address" onChange={event => setAddress(event.target.value)} />
                        </div>
                        <button onClick={addActor} disabled={!validateInput()}>Create actor</button>
                        {loading ? <div id="loader"></div> : null}
                        {txHash !== "" ? (<div>Transaction hash: {txHash}<br /> User id: {userId}</div>) : null}
                    </section>
                ) :
                    <div>You have no admin rights</div>
            }
        </React.Fragment>
    )
}

export default InitializePage;