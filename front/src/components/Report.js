import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';


const apiUrl = 'http://localhost:3000/api/vacations/report';

class Report extends Component {

  constructor(props) {
    super(props);
    this.state = {
        labels: [],
        datasets: [
          {
            label: 'Vacations by Followers',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
          }
        ]
    }
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

  getData() {
    return fetch(apiUrl)
      .then(response => this.handleErrors(response))
      .then(response => response.json())
      .then(data => {
        let myData = {
          labels: [],
          datasets: [
            {
              label: 'Followers per Vacation',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: []
              
            }
          ]
        };
        data.forEach(vacation => {
          myData.datasets[0].data.push(vacation.Followers);
          myData.labels.push(vacation.VacationID + ' (' + vacation.Destination + ')');
        });
        return this.setState(myData);
      })
      .catch((error) => {
        console.log(error);
        return alert(error);
      });
  }

  // ==== React Lifecycle Functions ====

  componentDidMount() {
    return this.getData();
  }

  // =============== JSX ===============

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Bar
          width={256}
          height={256}
          data={this.state}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }

}

export default Report;
