import React, {useEffect, useState, useRef} from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../EditorToolBar/EditorToolbar";
import "./Editor.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import { fetchResourses } from '../../service/index'
import useDebounce from "../../utils/debounce";

export const Editor = () => {
  const [listSugestions, setListSugestions] = useState([])
  const [state, setState] = useState(null)

  const fetchData = async () => {
    const response = await fetchResourses().response
    setListSugestions(response)
  }

  const [debouncedFunction] = useDebounce(fetchData, 1000);
  
  const handleChange = (value) => {
    debouncedFunction()
    setState(value);
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
