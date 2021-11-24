import React from "react";

import Editor from "../../components/Editor/Editor";

import "./EditorPage.css";

function EditorPage() {
  return (
    <div id="editorPage">
      <div className="container-editor">
        <Editor />
      </div>
    </div>
  );
}

export default EditorPage;
