import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


const apiUrl = 'http://localhost:3000/api/users/';

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      UserID: 0,
      LastName: '',
      FirstName: '',
      UserName: '',
      Password: '',
      IsAdmin: 0,
      Follows: []
    };
  }

  handleErrors(response) {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => { throw Error(data.sqlMessage) });
      }
      throw Error(response.statusText);
    }
    return response;
  }

  handleChange(state, e) {
    this.setState({ [state]: e.target.value });
  }

  registerUser(e) {
    e.preventDefault();
    let user = Object.assign({}, this.state);
    user.UserID = null;
    user.Follows = JSON.stringify(user.Follows).substring(1, JSON.stringify(user.Follows).length - 1);
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    }).then(response => this.handleErrors(response))
      .then(response => response.json())
      .then((data) => {
        console.log(data)
        this.alertSuccess(data.info);
        this.setState({ UserID: data.newRecordId })
        return this.props.emitLogin(this.state.UserID, this.state.IsAdmin, JSON.parse('[' + this.state.Follows + ']'));
      }).catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  alertSuccess(info) {
    return alert(info);
  }

  // ==== React Lifecycle Functions ====


  // =============== JSX ===============

  render() {

    return (
      <div className="col-sm-6">
        <Form onSubmit={this.registerUser.bind(this)}>

          <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input value={this.state.FirstName} onChange={this.handleChange.bind(this, 'FirstName')} type="text" name="firstName" id="firstName" />
          </FormGroup>

          <FormGroup>
            <Label for="lastName">Last Name</Label>
            <Input value={this.state.LastName} onChange={this.handleChange.bind(this, 'LastName')} type="text" name="lastName" id="lastName" />
          </FormGroup>

          <FormGroup>
            <Label for="userName">Username</Label>
            <Input required value={this.state.UserName} onChange={this.handleChange.bind(this, 'UserName')} type="text" name="userName" id="userName" />
          </FormGroup>

          <FormGroup>
            <Label for="password">Password</Label>
            <Input required value={this.state.Password} onChange={this.handleChange.bind(this, 'Password')} type="password" name="password" id="password" />
          </FormGroup>

          <Button color="primary" type="submit">Register</Button>

        </Form>
      </div>
    );
  }
}

export default Register;
