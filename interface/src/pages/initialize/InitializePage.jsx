import React, { useEffect, useState } from 'react';
import { createActor, verifyAdmin } from '../../components/ethereum/ethreum';
import './InitializePage.css';


// class InitializePage extends React.Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//             isAdmin: false,
//             charge: "",
//             time: "",
//             type: "",
//             name: "",
//             category: "",
//             amount: "",
//             address: ""
//         }

//         this.handleCharge = this.handleCharge.bind(this);
//     }

//     async componentDidMount() {
//         let isAdmin = await verifyAdmin();
//         this.setState({ isAdmin });
//     }

//     handleCharge(event) {
//         this.setState({ charge: event.target.value });
//     }

//     render() {
//         console.log("Render initialize");
//         return (
//             <React.Fragment>
//                 {
//                     this.state.isAdmin ?
//                         (
//                             <div>
//                                 <div>InitializePage</div>
//                                 <label htmlFor="charge">Charge</label>
//                                 <input type="number" id="charge" onChange={this.handleCharge}></input>
//                             </div>
//                         ) : <div>You have no admin rights</div>
//                 }
//             </React.Fragment>
//         )
//     }
// }

const InitializePage = (props) => {
    const userTypes = { Freeelancer: 1, Evaluator: 2 };
    const [isAdmin, setIsAdmin] = useState(false);
    const [charge, setCharge] = useState(0);
    const [time, setTime] = useState(0);
    const [type, setType] = useState(userTypes.Freeelancer);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Math");
    const [amount, setAmount] = useState(0);
    const [address, setAddress] = useState("");
    const [txHash, setTxHash] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            let isAdmin = await verifyAdmin();
            setIsAdmin(isAdmin);
        }
        fetchData();
    }, []);

    const addActor = async () => {
        setLoading(true);
        let result = await createActor(charge, time, type, name, category, amount, address);
        setLoading(false);
        setTxHash(result.hash);
        setUserId(result.id);
    }

    const validateInput = () => {
        return charge != 0 && time > 0 && name != "" && address != "";
    }

    return (
        <React.Fragment>
            {
                isAdmin ? (
                    <div>
                        <div>InitializePage</div>
                        <div><label htmlFor="charge">Charge</label>
                            <input type="number" id="charge" onChange={event => setCharge(event.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor="time">Time</label>
                            <input type="number" id="time" onChange={event => setTime(event.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor="type">Type</label>
                            <select value={type} id="type" onChange={event => setType(event.target.value)}>
                                <option value={userTypes.Freeelancer}>Freeelancer</option>
                                <option value={userTypes.Evaluator}>Evaluator</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" onChange={event => setName(event.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor="category">Category</label>
                            <select value={category} id="category" onChange={event => setCategory(event.target.value)}>
                                <option value="Math">Math</option>
                                <option value="Biology">Biology</option>
                                <option value="Legally">Legally</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount">Amount</label>
                            <input type="number" id="amount" onChange={event => setAmount(event.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" onChange={event => setAddress(event.target.value)}></input>
                        </div>
                        <button onClick={addActor} disabled={!validateInput()}>Create actor</button>
                        {loading ? <div id="loader"></div> : null}
                        {txHash !== "" ? (<div>Transaction hash: {txHash}<br /> User id: {userId}</div>) : null}
                    </div>
                ) :
                    <div>You have no admin rights</div>
            }
        </React.Fragment>
    )
}

export default InitializePage;