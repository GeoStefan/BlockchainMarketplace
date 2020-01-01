import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { verifyAdmin } from '../ethereum/ethreum';

class Navigation extends Component {

    state = {
        isAdmin: false,
    }

    async componentDidMount() {
        let isAdmin = await verifyAdmin();
        this.setState({ isAdmin });
    }

    render() {
        return (
            <ul>
                <li>
                    <NavLink to="/marketplace" activeClassName="active">
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/marketplace/actors" activeClassName="active">
                        Actors
                    </NavLink>
                </li>
                {this.state.isAdmin ? (<li>
                    <NavLink to="/marketplace/initialize" activeClassName="active">
                        Initialize
                    </NavLink>
                </li>) : null}
            </ul>
        )
    }
}

export default Navigation;