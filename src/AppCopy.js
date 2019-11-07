import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase';
import FlipMove from "react-flip-move"

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  };

  componentDidMount() {
    auth.onAuthStateChanged((user) =>{
      if (user) {
        this.setState({ user });
      }
    })
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
  };
  login(){
    auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    })
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <header>
          <div className='wrapper'>
            <h1>The List</h1>
            {this.state.user ?
            <button onClick={this.logout}>Log Out</button>
            :
            <button onClick={this.login}>Log In</button>
          }
          </div>
        </header>
        <section className='add-item'>
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text" 
              name="currentItem" 
              placeholder="Press Enter to Add Item" 
              onChange={this.handleChange} 
              value={this.state.currentItem} 
            />
          </form>
        </section>
        <section className="display-item">
          <div className="wrapper">
            <ul>
            <FlipMove duration={250} easing="ease-out">
            {this.state.items.map((item) => {
                return (
                  <li key={item.id}>
                    <h3>{item.title}</h3>
                    <button onClick={() => this.removeItem(item.id)}>ⓧ</button>
                    { <p>{item.user}</p>}
                  </li>
                )
              })}
              </FlipMove>
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
