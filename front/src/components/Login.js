import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


const apiUrl = 'http://localhost:3000/api/users/login';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      UserID: 0,
      LastName: '',
      FirstName: '',
      UserName: '',
      Password: '',
      IsAdmin: 0,
      Follows: ''
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

  loginUser(e) {
    e.preventDefault();
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UserName: this.state.UserName, Password: this.state.Password })
    }).then(response => this.handleErrors(response))
      .then(response => response.json())
      .then((data) => {
        if (data.length === 0) throw Error('There is no such username/password combination in the database.');
        this.setState(data[0]);
        return this.props.emitLogin(this.state.UserID, this.state.IsAdmin, JSON.parse('[' + this.state.Follows + ']'));
      }).catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  // ==== React Lifecycle Functions ====


  // =============== JSX ===============

  render() {

    return (
      <div className="col-sm-6">
        <Form onSubmit={this.loginUser.bind(this)}>

          <FormGroup>
            <Label for="userName">Username</Label>
            <Input required value={this.state.UserName} onChange={this.handleChange.bind(this, 'UserName')} type="text" name="userName" id="userName" />
          </FormGroup>

          <FormGroup>
            <Label for="password">Password</Label>
            <Input required value={this.state.Password} onChange={this.handleChange.bind(this, 'Password')} type="password" name="password" id="password" />
          </FormGroup>

          <Button color="primary" type="submit">Login</Button>

        </Form>
      </div>
    );
  }
}

export default Login;
