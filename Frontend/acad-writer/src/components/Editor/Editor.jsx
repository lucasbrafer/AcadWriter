import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../EditorToolBar/EditorToolbar";
import "./Editor.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import { fetchResourses } from '../../service/index'
import { debounceEvent } from '../../utils/index'

export const Editor = () => {
  const [listSugestions, setListSugestions] = React.useState([])
  const [state, setState] = React.useState(null)

  const fetchData = () => {
    fetchResourses()
  }

  const handleSugestion = (val) => {
    val = debounceEvent(fetchResourses, 2000)
  }

  const handleChange = (value) => {
    const val = value;
    setState(val);
  };

  return (
    <div>
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={state}
        onChange={(val) => handleChange(val)}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
       <div className="ql-editor border-toolbox" dangerouslySetInnerHTML={{ __html: state }} />
    </div>
  );
};

export default Editor;
