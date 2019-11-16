import React, { Component } from 'react';
import firebase from "firebase";
export default class ImageUploader extends Component {

    state = { 
        selectedFile: null,
        image: null
    };

    fileChangedHandler = (event) => {
        const file = event.target.files[0];
        this.setState({ selectedFile: event.target.files[0] });
        const storageRef = firebase.storage().ref('images/' + file.name);
        const task = storageRef.put(file).then((url) =>{
            this.setState({
                image: this.state.selectedFile.name
            })

        });
        
        
      }

      uploadHandler = (event) => {
        const url = this.state.selectedFile.getDownloadURL().then((url) => {
            this.setState({
                image: this.state.selectedFile.name
            });
          })
        }

      

    render() {
        return (
            <div>
                <input type="file" onChange={this.fileChangedHandler} />
                <button onClick={this.uploadfilHandler}>Upload!</button>
            </div>
        )
    }
}
