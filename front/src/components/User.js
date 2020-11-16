import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import VacationCard from './VacationCard';

const apiUrl = 'http://localhost:3000/api/';

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            vacations: []
        };
    }

    // ============= Helper Functions =============

    checkTagged(vacationID) {
        let rawSession = localStorage.getItem('session');
        let session = JSON.parse(rawSession);
        let tagged = Boolean(session.follows.includes(vacationID));
        return tagged;
    }

    // ============== AJAX Functions ==============

    handleErrors(response) {
        if (!response.ok) {
            if (response.status === 400) {
                return response.json().then(data => { throw Error(data.sqlMessage) });
            }
            throw Error(response.statusText);
        }
        return response;
    }

    getAllVacations() {
        return fetch(apiUrl + 'vacations/')
            .then(response => this.handleErrors(response))
            .then(response => response.json())
            .then(data => this.setState({ vacations: data }))
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }
    toggleFollow(vacationID) {
        let session = JSON.parse(localStorage.getItem('session'));
        let isFollowing = session.follows.indexOf(vacationID);
        return fetch(apiUrl + 'vacations/' + vacationID + '/' + (isFollowing === -1 ? '' : 'un') + 'follow', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => this.handleErrors(response))
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (isFollowing === -1) {
                    session.follows.push(vacationID);
                } else {
                    session.follows.splice(isFollowing, 1);
                }
                localStorage.setItem('session', JSON.stringify(session));

                fetch(apiUrl + 'users/' + session.userId, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Follows: JSON.stringify(session.follows).substring(1, JSON.stringify(session.follows).length - 1) })
                }).then(response => this.handleErrors(response))
                    .then(response => response.json())
                this.alertSuccess(data.info);
                return this.getAllVacations();
            }).catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    alertSuccess(info) {
        return alert(info);
    }

    // ==== React Lifecycle Functions ====

    componentDidMount() {
        this.getAllVacations();
    }

    // =============== JSX ===============

    render() {

        return (
            <div>
                {this.state.vacations.map(vacation =>
                    <VacationCard key={'vac' + vacation.VacationID} vacation={vacation} toggleFollow={this.toggleFollow.bind(this, vacation.VacationID)} tagged={this.checkTagged.bind(this, vacation.VacationID)()} />
                )}
            </div>
        );
    }
}

export default User;
