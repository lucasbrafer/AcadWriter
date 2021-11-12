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
        setAnchorPoint({ x: AxisX + 8, y: AxisY });
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
      <div style={{ display: openMenu === "open" ? "none" : "" }}>
        <ReactQuill
          theme="snow"
          value={state}
          onChange={(val) => handleChange(val)}
          placeholder={""}
          modules={modules}
          formats={formats}
        />
      </div>

      <div
        className="border-toolbox"
        style={{ display: openMenu === "open" ? "" : "none" }}
      >
        <div
          id="static-html-editor"
          className="ql-editor font"
          ref={divStaticRef}
        ></div>
      </div>

      <ControlledMenu
        anchorPoint={anchorPoint}
        state={openMenu}
        onMouseLeave={() => setOpenMenu("closed")}
        onClose={() => setOpenMenu("closed")}
        key={"right"}
        direction={"right"}
        align={"center"}
        arrow={false}
      >
        {listSugestions.map((item) => (
          <MenuItem key={item}>{item}</MenuItem>
        ))}
      </ControlledMenu>
    </div>
  );
};

export default Editor;
