import React from "react";

import "./HomePage.css";

import EditorImage from "../../assets/editor.jpg";

function HomePage({ nextPage }) {
  return (
    <div id="HomePage">
      <div className="card">
        <div>
          <h1>AcadWriter!</h1>
          <h2>Improve your academic writing with real time sugestions</h2>
          <span>
            This editor helps you to Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Quisque eget mauris sollicitudin nisi posuere
            dignissim et quis mauris.
          </span>
        </div>
        <button onClick={() => nextPage()}> Start to Using </button>
      </div>
      <div>
        <img src={EditorImage} alt="editor-img"></img>
      </div>
    </div>
  );
}

export default HomePage;
