import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { verifyAdmin } from '../ethereum/ethreum';
import './Navigation.css';


const Navigation = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const getAdmin = async () => {
            let admin = await verifyAdmin();
            setIsAdmin(admin);
        }
        getAdmin();
    }, []);

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
            <li>
                <NavLink to="/marketplace/tasks/create" activeClassName="active">
                    Create Task
                     </NavLink>
            </li>
            <li>
                <NavLink to="/marketplace/tasks/taskList" activeClassName="active">
                    Tasks List
                     </NavLink>
            </li>
            {isAdmin ? (<li>
                <NavLink to="/marketplace/initialize" activeClassName="active">
                    Initialize
                     </NavLink>
            </li>) : null}
        </ul>
    )
}

export default Navigation;