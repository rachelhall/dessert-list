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
        this.subscribe(`${user.uid}/items`);
      }
    })
  }
  
  subscribe = (ref) => {
    const itemsRef = firebase.database().ref(ref);
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          avatar: items[item].avatar
        });
      }
      console.log('new item updated', { newState });
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
    const itemsRef = firebase.database().ref(`${this.state.user.uid}/items`);
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email,
      avatar: this.state.user.photoURL || null
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    })
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`${this.state.user.uid}/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <div className="auth-container">
        {this.state.user ?
        <button className="auth" onClick={this.logout}>Logout</button>                
        :
        <button className="auth" onClick={this.login}>Log In</button>              
        }
        </div>
         
  <header>
    <div className="wrapper">
      <h1>The List</h1>
     
    </div>
  </header>

  
  {this.state.user ? 
    <div>
      <div className='user-profile'>
        <img src={this.state.user.photoURL} />
      </div>
      <section className='add-item'>
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            name="currentItem" 
            placeholder="What are you thinking?" 
            onChange={this.handleChange} 
            value={this.state.currentItem} 
          />
        </form>
        </section>
        <div className='container'>
      <section className='display-item'>
        <div className="wrapper">
          <ul>
          <FlipMove duration={250} easing="ease-out">
            {this.state.items.map((item) => {
              return (
                <li key={item.id}>
                  <div className="item-container">
                  <h3>{item.title}</h3>
                  {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                      <button onClick={() => this.removeItem(item.id)}>remove</button> : null}

                  </div>
                  
                  <div className="contributor">
                    { item.avatar && <img className="who-says" src={item.avatar} /> }
                  </div>
                  
            </li>
          )
        })}
        </FlipMove>
      </ul>
    </div>
  </section>

</div>
    </div>
    :
    <div className='wrapper'>
      <p>You must be logged in to see the fun!</p>
    </div>
  }
  
</div>


    )}
}
  
export default App;
