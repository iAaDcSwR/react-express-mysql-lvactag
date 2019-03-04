import React, { Component } from 'react';
import IconTag from './IconTag'
import IconPencil from './IconPencil'
import IconX from './IconX'
import './VacationCard.css';

class VacationCard extends Component {

  // ============= Helper Functions =============

  // =============== JSX ===============

  render() {
    return (
      <div className="vacation">
        {!this.props.admin ? <IconTag key={'iconTag' + this.props.vacation.VacationID} vacation={this.props.vacation} tagged={this.props.tagged} onClick={this.props.toggleFollow} /> : [<IconX key={'iconX' + this.props.vacation.VacationID} vacation={this.props.vacation} onClick={(e) => this.props.toggleDeleteForm(this.props.vacation.VacationID, e)} />, <IconPencil key={'iconPencil' + this.props.vacation.VacationID} onClick={(e) => this.props.toggleUpdateForm(this.props.vacation, e)} />]}
        {/* Put FOLLOWERS here */}
        <h5 title={this.props.vacation.Destination}>{this.props.vacation.Destination}</h5>
        <div className="picture">
          <div className="pic-bg" style={{ 'backgroundColor': 'white', 'backgroundImage': 'url(\'' + (this.props.vacation.Picture || "defaultVacationPic.jpg") + '\')', 'backgroundSize': 'cover' }} />
          <div className="price">
            <span><sup>$</sup>{this.props.vacation.Price.toFixed(2)}</span>
          </div>
        </div>
        <div className="date">{new Date(this.props.vacation.StartDate).toLocaleDateString('fr-FR')} - {new Date(this.props.vacation.EndDate).toLocaleDateString('fr-FR')}</div>
      </div>
    );
  }
}

export default VacationCard;
