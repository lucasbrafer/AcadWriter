import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import EditorToolbar, {
  modules,
  formats,
} from "../EditorToolBar/EditorToolbar";
import "./Editor.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import { fetchResourses } from "../../service/index";
import useDebounce from "../../utils/debounce";

import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export const Editor = () => {
  const [listSugestions, setListSugestions] = useState([]);
  const [state, setState] = useState("");
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const [openMenu, setOpenMenu] = useState("closed");
  const divStaticRef = useRef(null);

  const handleChange = (value) => {
    debouncedFunction();
    setState(value);
  };

  const fetchData = async () => {
    const response = await fetchResourses();
    setListSugestions(response);
    setOpenMenu("open");
  };

  const [debouncedFunction] = useDebounce(fetchData, 3000);

  function closeMenuOnType() {
    setOpenMenu("closed");
  }

  const onEditorChange = (content, delta, source, editor) => {
    debouncedFunction();
    console.log("delta", delta);
    console.log("content", content);
    console.log("source", source);
    console.log("editor", editor.getContents());
    console.log("texto", editor.getText());
    console.log("bound", editor.getBounds(0));
    console.log("selection", editor.getSelection());
    console.log(anchorPoint);
    // console.log(editor.getBounds());
    setState(content);
  };

  useEffect(() => {
    document.addEventListener("keydown", closeMenuOnType);
  }, []);

  useEffect(() => {
    const processStringStaticEditor = () => {
      const element = document.getElementById("static-html-editor");

      let inverseTag = "";
      let copyState = state;
      let index = copyState.length - 1;

      while (index >= 0 && copyState[index] !== "<") {
        inverseTag = copyState[index] + inverseTag;
        if (inverseTag) copyState = copyState.slice(0, -1);
        index -= 1;
      }
      copyState = copyState.slice(0, -1);
      inverseTag = "<" + inverseTag;

      element.innerHTML =
        copyState + '<span id="control-position"></span>' + inverseTag;
    };

    const processButonPosition = () => {
      const button = document.getElementById("control-position");

      if (button) {
        const offsets = button.getBoundingClientRect();
        const AxisX = offsets.left;
        const AxisY = offsets.top;
        setAnchorPoint({ x: AxisX + 30, y: AxisY - 5 });
      }
    };

    if (state && state.length > 0) {
      processStringStaticEditor();
      processButonPosition();
    }
  }, [state, openMenu]);

  return (
    <div>
      <EditorToolbar />
      <ReactQuill
        style={{ display: openMenu === "open" ? "none" : "" }}
        theme="snow"
        value={state}
        onChange={onEditorChange}
        placeholder={""}
        modules={modules}
        formats={formats}
      />

      <div
        className="quill"
        style={{ display: openMenu === "open" ? "" : "none" }}
      >
        <div className="ql-container ql-snow">
          <div
            id="static-html-editor"
            className="ql-editor"
            ref={divStaticRef}
          ></div>
        </div>
      </div>

      <ControlledMenu
        anchorPoint={anchorPoint}
        state={openMenu}
        onMouseLeave={() => setOpenMenu("closed")}
        onClose={() => setOpenMenu("closed")}
        arrow={true}
      >
        {listSugestions.map((item) => (
          <MenuItem key={item}>{item}</MenuItem>
        ))}
      </ControlledMenu>
    </div>
  );
};

export default Editor;
