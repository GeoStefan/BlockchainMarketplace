import React from 'react';
import { verifyAdmin } from '../../components/ethereum/ethreum';


class InitializePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAdmin: false,
            charge: "",
            time: "",
            type: "",
            name: "",
            category: "",
            amount: "",
            address: ""
        }

        this.handleCharge = this.handleCharge.bind(this);
    }

    async componentDidMount() {
        let isAdmin = await verifyAdmin();
        this.setState({ isAdmin });
    }

    handleCharge(event) {
        this.setState({ charge: event.target.value });
    }

    render() {
        console.log("Render initialize");
        return (
            <React.Fragment>
                {
                    this.state.isAdmin ?
                        (
                            <div>
                                <div>InitializePage</div>
                                <label htmlFor="charge">Charge</label>
                                <input type="number" id="charge" onChange={this.handleCharge}></input>
                            </div>
                        ) : <div>You have no admin rights</div>
                }
            </React.Fragment>
        )
    }
}

export default InitializePage;