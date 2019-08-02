import React from "react";

const Meme = props => {
  return (
    <div className="meme">
      <div className="img-wrapper">
        <img className="meme-img" src={props.image} alt="funny meme" />
      </div>
      <p>{props.text}</p>

      {props.favorite ? (
        <img
          src="https://upload.wikimedia.org/wikipedia/en/e/e5/Yellow_Star.png"
          alt="star"
        />
      ) : null}
      <button onClick={() => props.deleteMeme(props.id)}>DEL</button>
    </div>
  );
};

export default Meme;
