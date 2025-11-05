import React, { Component } from 'react';


export default class example extends Component {
    state = {
        name: "KL UNIVERSITY",
        age: 40,
        branch: "cs&it",
        render() {
            return (
                <div>{this.state.name}</div>
            );
        }
    };
}
