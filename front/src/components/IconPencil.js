import React, { Component } from 'react';

class IconPencil extends Component {
    altTitle = 'Edit';
    // ==== React Lifecycle Functions ====

    // =============== JSX ===============

    render() {

        return (
            <img className="icon icon-pencil" src="pencil.svg" alt={this.altTitle} title={this.altTitle} onClick={this.props.onClick} />
        );
    }
}

export default IconPencil;
