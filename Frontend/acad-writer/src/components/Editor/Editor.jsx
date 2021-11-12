import React, { useState, useRef, useEffect } from "react";
import { renderToString } from "react-dom/server";
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
  const [state, setState] = useState(null);
  const [staticHTML, setStaticHTML] = useState("");
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const [openMenu, setOpenMenu] = useState("closed");
  const buttonRef = useRef(null);
  const divStaticRef = useRef(null);

  const handleChange = (value) => {
    debouncedFunction();
    setState(value);
  };

  useEffect(() => {
    const element = document.getElementById("static-html-editor");
    console.log(element.innerHTML);

    if (state && state[1] === "p") {
      let newStr = state.slice(0, -4);
      console.log(newStr);
      element.innerHTML = newStr + '<span id="control-position"></span></p>';
    }

    const button = document.getElementById("control-position");

    if (button) {
      const offsets = button.getBoundingClientRect();
      const AxisX = offsets.left;
      const AxisY = offsets.top;
      setAnchorPoint({ x: AxisX + 8, y: AxisY });
    }
  }, [state]);

  const fetchData = async () => {
    const response = await fetchResourses();
    setListSugestions(response);
    setOpenMenu("open");
  };

  const [debouncedFunction] = useDebounce(fetchData, 100);

  return (
    <div>
      <EditorToolbar />
      <div>
        <ReactQuill
          theme="snow"
          value={state}
          onChange={(val) => handleChange(val)}
          placeholder={"Write something awesome..."}
          modules={modules}
          formats={formats}
        />
      </div>

      <div className="border-toolbox">
        <div
          id="static-html-editor"
          className="ql-editor font"
          ref={divStaticRef}
        ></div>
      </div>

      {/* <button ref={buttonRef} onClick={() => setOpenMenu("open")}>
          BTN
        </button> */}
      {/* style={{ display: openMenu === "open" ? "flex" : "none" }} */}

      <ControlledMenu
        anchorPoint={anchorPoint}
        state={openMenu}
        onMouseLeave={() => setOpenMenu("closed")}
        onClose={() => setOpenMenu("closed")}
        key={"right"}
        direction={"right"}
        align={"start"}
        position={"anchor"}
        viewScroll={"auto"}
      >
        {listSugestions.map((item) => (
          <MenuItem key={item}>{item}</MenuItem>
        ))}
      </ControlledMenu>
    </div>
  );
};

export default Editor;
