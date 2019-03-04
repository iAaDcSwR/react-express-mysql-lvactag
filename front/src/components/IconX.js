import React, { Component } from 'react';

class IconX extends Component {
    altTitle = 'Delete';
    // ==== React Lifecycle Functions ====

    // =============== JSX ===============

    render() {

        return (
            <img className="icon icon-x" src="x.svg" alt={this.altTitle} title={this.altTitle} onClick={this.props.onClick} />
        );
    }
}

export default IconX;
