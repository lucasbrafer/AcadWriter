import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import EditorToolbar, {
  modules,
  formats,
} from "../EditorToolBar/EditorToolbar";
import "./Editor.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import useDebounce from "../../utils/debounce";

import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export const Editor = () => {
  const [listSugestions, setListSugestions] = useState([]);
  const [state, setState] = useState({ content: "", editor: undefined });
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const editorRef = useRef(undefined);
  const quillRef = useRef(undefined);

  let cancelToken = axios.CancelToken.source();

  const [openMenu, setOpenMenu] = useState("closed");
  const divStaticRef = useRef(null);

  const fetchResourses = async () => {
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }

    cancelToken = axios.CancelToken.source();

    const text = await editorRef.current.getText();

    try {
      const results = await axios.post(
        "http://127.0.0.1:5000/sugestion",
        {
          text: text,
        },
        {
          headers: { "Content-Type": "application/json" },
          cancelToken: cancelToken.token,
        }
      );
      return results.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    const sugestions = await fetchResourses();
    if (!!sugestions) {
      const editor = quillRef.current.getEditor();
      const position = editor.getSelection(true);
      if (position.index > 0) {
        setListSugestions(sugestions);
        setOpenMenu("open");
      }
    }
  };

  const [debouncedFunction] = useDebounce(fetchData, 1000);

  function closeMenuOnType(e) {
    let key = "";
    if (e.keyCode >= 65 && e.keyCode <= 90 && openMenu === "open") {
      key = e.key;
    }
    handleCloseMenu(key);
  }

  const handleSetSugestion = (item) => {
    console.log("handleSet");
    let text = item;

    const editor = quillRef.current.getEditor();
    const position = editor.getSelection(true);

    if (position && position.index > 0) {
      if (
        item[item.length - 1] !== " " &&
        item[item.length - 1].match(/[a-z]/i)
      ) {
        text = " " + text;
      }
      setTimeout(function () {
        editor.insertText(editor.getLength() - 1, text);
        handleCloseMenu();
      }, 5);
    }
  };

  const onEditorChange = (content, delta, source, editor) => {
    debouncedFunction();
    editorRef.current = editor;
    setState({ content, editor });
  };

  const handleCloseMenu = (text = "") => {
    const editor = quillRef.current.getEditor();
    const position = editor.getSelection(true);
    if (position && position.index > 0) {
      setOpenMenu("closed");
      editor.insertText(position.index, text);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", closeMenuOnType);
  }, []);

  useEffect(() => {
    const processStringStaticEditor = () => {
      const element = document.getElementById("static-html-editor");

      let inverseTag = "";
      let copyState = state.content;
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

    if (state.content && state.content.length > 0) {
      processStringStaticEditor();
      processButonPosition();
    }
  }, [state, state.content, openMenu]);

  return (
    <div>
      <EditorToolbar />
      <ReactQuill
        ref={(el) => {
          quillRef.current = el;
        }}
        style={{ display: openMenu === "open" ? "none" : "" }}
        theme="snow"
        value={state.content}
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
        onClose={() => handleCloseMenu()}
        arrow={true}
      >
        {listSugestions.map((item) => (
          <MenuItem key={item} onClick={() => handleSetSugestion(item)}>
            {item}
          </MenuItem>
        ))}
      </ControlledMenu>
    </div>
  );
};

export default React.memo(Editor);
