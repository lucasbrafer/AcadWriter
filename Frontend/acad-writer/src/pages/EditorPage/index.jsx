import Editor from "../../components/Editor/Editor";

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
