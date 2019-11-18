import React, { Component } from "react";
import firebase from "firebase";

export default class ImageUploader extends Component {
  state = {
    selectedFile: null,
    imageURL: null
  };

  fileChangedHandler = event => {
    const file = event.target.files[0];
    this.setState({ selectedFile: event.target.files[0] });
    const storageRef = firebase.storage().ref("images/" + file.name);

    const task = storageRef.put(file).then(() => {
      const url = storageRef.getDownloadURL().then(url => {
        console.log("file url from firebase", { url });
          this.props.onUpload(url);
      });
    });
  };

  render() {
    return (
      <div>
        <input className="uploader" type="file" onChange={this.fileChangedHandler} />
      </div>
    );
  }
}
