import Editor from "./components/Editor/Editor";

import "./App.css";

function App() {
  return (
    <div className="app">
      <h1 className="app-title"> AcadWriter! </h1>
      <div className="container-editor">
        <Editor />
      </div>
    </div>
  );
}

export default App;
