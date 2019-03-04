import React, { Component } from 'react';
import './App.css';
import Admin from './components/Admin';
import User from './components/User';
import Register from './components/Register';
import Login from './components/Login';
import Report from './components/Report';
import { Jumbotron, ButtonGroup, Button } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      isAdmin: 0,
      follows: []
    };
  }
  emitLogin(userId, isAdmin, follows) {
    this.setState({ 'userId': userId, 'isAdmin': isAdmin, 'follows': follows });
    console.log(this.state);
    localStorage.setItem('session', JSON.stringify(this.state));
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

  createDB() {
    return fetch('http://localhost:3000/api/createdb')
      .then(response => this.handleErrors(response))
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert(data.info);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  componentDidMount() {
    if (localStorage.getItem('session')) {
      let session = JSON.parse(localStorage.getItem('session'));
      if (session['userId'] &&
        (session['isAdmin'] === 0 || session['isAdmin'] === 1) &&
        typeof session['follows'] === 'object') {
        this.setState(session);
      }
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Jumbotron color="light" style={{ lineHeight: '100px' }}>
            <img style={{ marginRight: '100px', maxWidth: '100%', maxHeight: '100px' }} src="/logo.png" />{' '}
            <ButtonGroup>
              <Link className="btn btn-primary" to="/">Home</Link>
              {!this.state.userId ? <Link className="btn btn-dark" to="/register/">Register</Link> : ''}
              {!this.state.userId ? <Link className="btn btn-secondary" to="/login/">Login</Link> : ''}
              {this.state.userId && this.state.isAdmin ? <Link className="btn btn-info" to="/report/">Report</Link> : ''}
              <Button color="warning" onClick={this.createDB.bind(this)}>Create Database</Button>
            </ButtonGroup>

          </Jumbotron>
          <Route path="/" exact component={() => {
            if (this.state.userId) {
              if (this.state.isAdmin) return <Admin />
              else return <User />
            } else return <div className="container-fluid"><p>Please <Link to="/login/">login</Link> or <Link to="/register/">register</Link>!</p></div>
          }} />
          <Route path="/register/" component={() => this.state.userId ? <div className="container-fluid"><Link to="/">Return to Home</Link></div> : <Register emitLogin={this.emitLogin.bind(this)} />} />
          <Route path="/login/" component={() => this.state.userId ? <div className="container-fluid"><Link to="/"> Return to Home</Link></div> : <Login emitLogin={this.emitLogin.bind(this)} />} />
          <Route path="/report/" component={() => this.state.userId && this.state.isAdmin ? <Report /> : <div className="container-fluid"><Link to="/"> Return to Home</Link></div>} />
        </div>
      </Router>
    );
  }
}

export default App;
