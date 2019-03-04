import React, { Component } from 'react';

class IconTag extends Component {

    // ==== React Lifecycle Functions ====

    // =============== JSX ===============

    render() {
        let altTitle = this.props.tagged ? "Untag (Unfollow)" : "Tag (Follow)";

        return (
            <img className="icon icon-tag" src={this.props.tagged ? "untag.svg" : "tag.svg"} alt={altTitle} title={altTitle} onClick={this.props.onClick} />
        );
    }
}

export default IconTag;
