import React from "react";

import Editor from "../../components/Editor/Editor";

import "./EditorPage.css";

function EditorPage() {
  return (
    <div id="editorPage">
      <h1 className="app-title"> AcadWriter! </h1>
      <div className="container-editor">
        <Editor />
      </div>
    </div>
  );
}

export default EditorPage;
