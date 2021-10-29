import React, { useState, useRef } from "react";
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
  const [htmlString, setHtmlString] = useState("");
  const [state, setState] = useState(null);

  const [openMenu, setOpenMenu] = useState("closed");
  const buttonRef = useRef(null);

  const handleChange = (value) => {
    debouncedFunction();
    setState(value);
    setHtmlString(value);
  };

  const fetchData = async () => {
    const response = await fetchResourses();
    setListSugestions(response);
    setOpenMenu("open");
  };

  const [debouncedFunction] = useDebounce(fetchData, 1000);

  return (
    <div>
      <EditorToolbar />
      <div style={{ display: openMenu === "closed" ? "block" : "none" }}>
        <ReactQuill
          theme="snow"
          value={state}
          onChange={(val) => handleChange(val)}
          placeholder={"Write something awesome..."}
          modules={modules}
          formats={formats}
        />
      </div>

      <div
        class="row border-toolbox"
        style={{ display: openMenu === "open" ? "flex" : "none" }}
      >
        <div
          className="ql-editor font"
          dangerouslySetInnerHTML={{ __html: state }}
        ></div>

        <button ref={buttonRef} onClick={() => setOpenMenu("open")}></button>
        <ControlledMenu
          state={openMenu}
          anchorRef={buttonRef}
          onMouseLeave={() => setOpenMenu("closed")}
          onClose={() => setOpenMenu("closed")}
          key={"right"}
          direction={"right"}
          align={"start"}
          position={"anchor"}
          viewScroll={"auto"}
          arrow={"arrow"}
          offsetX={12}
          offsetY={12}
        >
          {listSugestions.map((item) => (
            <MenuItem key={item}>{item}</MenuItem>
          ))}
        </ControlledMenu>
      </div>
    </div>
  );
};

export default Editor;
