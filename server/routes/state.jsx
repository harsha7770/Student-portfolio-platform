import React, { Component } from 'react'

export default class Stateexample extends Component {
 state ={
    name:"KL UNIVERSITY",
    age:18,
    branch:"cse"
 }
    render() {
    return (
      <div>{this.state.name}</div>
    )
  }
}


