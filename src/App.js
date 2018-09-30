import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';
import './App.css';


const particlesOption = {
  particles: {
    number: {
      value: 130,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    // password: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        // password: '',
        entries: 0,
        joined: '',
      }
    }
  }

  // componentDidMount() {
  //   fetch('http://localhost:3001')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // const image = document.getElementById('inputimage');
    // const width = Number(image.width);
    // const height = Number(image.height);
    // console.log(width, height);
    this.setState({box: data.outputs[0].data});
    // data.outputs[0].data.regions.map((region) => console.log(region.region_info.bounding_box));
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('http://localhost:3001/imageUrl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then((response) => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then (response => response.json())
          .then (count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch (console.log)
        }
        this.calculateFaceLocation(response);
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signin' || route === 'register') {
      this.setState(initialState);
    }
    else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  renderRoute(route) {
    switch(route){
      case 'signin':
        return <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>;
      case 'register':
        return <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>;
      default:
        return (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
          </div>
        )
    }
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOption}
            />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        { this.renderRoute(this.state.route) }
      </div>
    );
  }
}

export default App;
