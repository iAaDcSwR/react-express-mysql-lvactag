import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VacationCard from './VacationCard';
import Moment from 'moment';

const apiUrl = 'http://localhost:3000/api/vacations/';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            vacations: [],
            form: {
                VacationID: 0,
                Description: '',
                Destination: '',
                Picture: '',
                StartDate: new Date(),
                EndDate: new Date(),
                Price: 0,
                Followers: 0
            },
            addFormModal: false,
            updateFormModal: false,
            deleteFormModal: false
        };

        this.toggleAddForm = this.toggleAddForm.bind(this);
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
        this.toggleDeleteForm = this.toggleDeleteForm.bind(this);
    }

    // ============= Helper Functions =============

    toggleAddForm(boo) {
        let newState = { addFormModal: !this.state.addFormModal };
        if (boo !== null) {
            newState['form'] = {
                VacationID: null,
                Description: '',
                Destination: '',
                Picture: '',
                StartDate: new Date(),
                EndDate: new Date(),
                Price: 0,
                Followers: 0
            };
        }
        this.setState(newState);
    }

    toggleUpdateForm(vacation) {
        let newState = { updateFormModal: !this.state.updateFormModal };
        if (vacation) {
            newState['form'] = Object.assign({}, vacation);
            newState.form.StartDate = new Date(newState.form.StartDate);
            newState.form.EndDate = new Date(newState.form.EndDate);
        }
        this.setState(newState);
    }

    toggleDeleteForm(vacationID) {
        let newState = { deleteFormModal: !this.state.deleteFormModal };
        if (vacationID) {
            newState['form'] = Object.assign({}, this.state.form);
            newState.form.VacationID = vacationID;
        }
        this.setState(newState);
    }

    handleChange(state, e) {
        this.setFormState(state, e.target.value);
    }

    setFormState(state, value) {
        let newState = Object.assign({}, this.state.form);
        newState[state] = value;
        this.setState({ form: newState });
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
        return fetch(apiUrl)
            .then(response => this.handleErrors(response))
            .then(response => response.json())
            .then(data => this.setState({ vacations: data }))
            .catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    updateVacation(e) {
        e.preventDefault();
        let vacation = Object.assign({}, this.state.form);
        vacation.StartDate = Moment(vacation.StartDate).format('YYYY-MM-DD hh:mm');
        vacation.EndDate = Moment(vacation.EndDate).format('YYYY-MM-DD hh:mm');
        return fetch(apiUrl + vacation.VacationID, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vacation)
        }).then(response => this.handleErrors(response))
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                this.alertSuccess(data.info);
                return this.getAllVacations();
            }).catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    deleteVacation() {
        return fetch(apiUrl + this.state.form.VacationID, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => this.handleErrors(response))
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                this.alertSuccess(data.info);
                this.toggleDeleteForm();
                return this.getAllVacations();
            }).catch((error) => {
                console.log(error);
                alert(error);
            });
    }

    addVacation(e) {
        e.preventDefault();
        let vacation = Object.assign({}, this.state.form);
        vacation.VacationID = null;
        vacation.StartDate = Moment(vacation.StartDate).format('YYYY-MM-DD hh:mm');
        vacation.EndDate = Moment(vacation.EndDate).format('YYYY-MM-DD hh:mm');
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vacation)
        }).then(response => this.handleErrors(response))
            .then(response => response.json())
            .then((data) => {
                console.log(data)
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
                <div className="m-2">
                    <Button color="primary" onClick={this.toggleAddForm}>Add Vacation</Button>
                </div>
                <div className="vacation-ctr">
                    {this.state.vacations.map(vacation =>
                        <VacationCard admin key={'vac' + vacation.VacationID} vacation={vacation} toggleUpdateForm={this.toggleUpdateForm} toggleDeleteForm={this.toggleDeleteForm} />
                    )}
                </div>
                <Modal style={{color: 'black'}}  centered isOpen={this.state.updateFormModal} toggle={this.toggleUpdateForm} className={this.props.className}>
                    <ModalHeader toggle={() => this.toggleUpdateForm(null)}>Edit Vacation</ModalHeader>
                    <Form onSubmit={this.updateVacation.bind(this)}>
                        <ModalBody>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input value={this.state.form.Description} onChange={this.handleChange.bind(this, 'Description')} type="text" name="description" id="description" placeholder="Vacation description..." />
                            </FormGroup>

                            <FormGroup>
                                <Label for="destination">Destination</Label>
                                <Input required value={this.state.form.Destination} onChange={this.handleChange.bind(this, 'Destination')} type="text" name="destination" id="destination" placeholder="Vacation destination..." />
                            </FormGroup>

                            <FormGroup>
                                <Label for="picture">Picture</Label>
                                <Input value={this.state.form.Picture} onChange={this.handleChange.bind(this, 'Picture')} type="text" name="picture" id="picture" placeholder="Vacation picture URL..." />
                            </FormGroup>

                            <FormGroup>
                                <Label for="startDate">Start Date</Label>{' '}
                                <DatePicker required
                                    name="startDate"
                                    id="startDate"
                                    selected={this.state.form.StartDate}
                                    onChange={this.setFormState.bind(this, 'StartDate')}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="endDate">End Date</Label>{' '}
                                <DatePicker required
                                    name="endDate"
                                    id="endDate"
                                    selected={this.state.form.EndDate}
                                    onChange={this.setFormState.bind(this, 'EndDate')}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="price">Price</Label>
                                <Input required value={this.state.form.Price} onChange={this.handleChange.bind(this, 'Price')} type="number" step="0.01" min="0" max="999.99" name="price" id="price" placeholder="Vacation price..." />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Change</Button>{' '}
                            <Button color="secondary" onClick={() => this.toggleUpdateForm(null)}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <Modal style={{color: 'black'}}  centered isOpen={this.state.addFormModal} toggle={this.toggleAddForm} className={this.props.className}>
                    <ModalHeader toggle={() => this.toggleAddForm(null)}>Add Vacation</ModalHeader>
                    <Form onSubmit={this.addVacation.bind(this)}>
                        <ModalBody>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input value={this.state.form.Description} onChange={this.handleChange.bind(this, 'Description')} type="text" name="description" id="description" placeholder="Vacation description..." />
                            </FormGroup>

                            <FormGroup>
                                <Label for="destination">Destination</Label>
                                <Input required value={this.state.form.Destination} onChange={this.handleChange.bind(this, 'Destination')} type="text" name="destination" id="destination" placeholder="Vacation destination..." />
                            </FormGroup>

                            <FormGroup>
                                <Label for="picture">Picture</Label>
                                <Input value={this.state.form.Picture} onChange={this.handleChange.bind(this, 'Picture')} type="text" name="picture" id="picture" placeholder="Vacation picture URL..." />
                            </FormGroup>

                            <FormGroup>
                                <Label for="startDate">Start Date</Label>{' '}
                                <DatePicker required
                                    name="startDate"
                                    id="startDate"
                                    selected={this.state.form.StartDate}
                                    onChange={this.setFormState.bind(this, 'StartDate')}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="endDate">End Date</Label>{' '}
                                <DatePicker required
                                    name="endDate"
                                    id="endDate"
                                    selected={this.state.form.EndDate}
                                    onChange={this.setFormState.bind(this, 'EndDate')}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="price">Price</Label>
                                <Input required value={this.state.form.Price} onChange={this.handleChange.bind(this, 'Price')} type="number" step="0.01" min="0" max="999.99" name="price" id="price" placeholder="Vacation price..." />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Add</Button>{' '}
                            <Button color="secondary" onClick={() => this.toggleAddForm(null)}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <Modal style={{color: 'black'}}  centered isOpen={this.state.deleteFormModal} toggle={this.toggleDeleteForm} className={this.props.className}>
                    <ModalHeader toggle={() => this.toggleDeleteForm(null)}>Delete Vacation</ModalHeader>
                    <ModalBody>
                        Are you sure you want to remove this vacation from the database?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteVacation.bind(this)}>Yes</Button>{' '}
                        <Button color="secondary" onClick={() => this.toggleDeleteForm(null)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Admin;
