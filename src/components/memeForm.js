import React from "react";
import DropzoneComponent from "react-dropzone-component";
import request from "superagent";
import { navigate } from "hookrouter";

import "../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../node_modules/dropzone/dist/min/dropzone.min.css";

const MemeForm = () => {
  const [input, setInput] = React.useState("");
  const [favorite, setFavorite] = React.useState(false);
  const [image, setImage] = React.useState("");
  const imageRef = React.useRef(null);

  const componentConfig = () => {
    return {
      iconFiletypes: [".jpg", ".png"],
      showFiletypeIcon: true,
      postUrl: "https://httpbin.org/post"
    };
  };

  const djsConfig = () => {
    return {
      addRemoveLinks: true,
      maxFiles: 1
    };
  };

  const handleDrop = () => {
    return {
      addedfile: file => {
        let upload = request
          .post("https://api.cloudinary.com/v1_1/dwjtgeqt3/image/upload")
          .field("upload_preset", "meme-images")
          .field("file", file);

        upload.end((err, response) => {
          if (err) {
            console.log("Cloudinary error", err);
          }
          if (response.body.secure_url !== "") {
            setImage(response.body.secure_url);
          }
        });
      }
    };
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:5000/add-meme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        text: input,
        image: image,
        favorite: favorite
      })
    })
      .then(result => result.json())
      .then(setInput(""))
      .then(setImage(""))
      .then(setFavorite(false))
      .then(imageRef.current.dropzone.removeAllFiles())
      .then(navigate("/"))
      .catch(err => console.log("form submit", err));
  };

  return (
    <div className="memeform">
      <h1>Add a Meme, plz</h1>
      <form onSubmit={handleSubmit}>
        <DropzoneComponent
          ref={imageRef}
          config={componentConfig()}
          djsConfig={djsConfig()}
          eventHandlers={handleDrop()}
        >
          Drop Your Meme
        </DropzoneComponent>

        <input
          type="text"
          placeholder="Caption"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div>
          <input
            type="checkbox"
            checked={favorite}
            onChange={() => setFavorite(!favorite)}
          />
          <span>Favorite?</span>
        </div>
        <button type="submit">Post Meme</button>
      </form>
    </div>
  );
};

export default MemeForm;
