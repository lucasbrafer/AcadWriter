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
      setListSugestions(sugestions);
      setOpenMenu("open");
    }
  };

  const [debouncedFunction] = useDebounce(fetchData, 1000);

  function closeMenuOnType(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90 && openMenu === "open") {
      const editor = quillRef.current.getEditor();
      const position = editor.getSelection(true);
      editor.insertText(position, e.key);
    }
    setOpenMenu("closed");
  }

  const handleSetSugestion = (item) => {
    let text = item;
    const editor = quillRef.current.getEditor();
    console.log(editor);
    console.log("item", text);

    const position = editor.getSelection(true);

    if (editor.getText()[position - 1] !== " ") {
      text = " " + text;
    }

    editor.insertText(position, text);
  };

  const onEditorChange = (content, delta, source, editor) => {
    debouncedFunction();
    // console.log("delta", delta);
    // console.log("content", content);
    // console.log("source", source);
    // console.log("editor", editor.getContents());
    // console.log("texto", editor.getText());
    // console.log("bound", editor.getBounds(7));
    // console.log("selection", editor.getSelection());
    // console.log("text", editor.getText());
    // console.log(editor.getSelection().index);
    // console.log(editor.getSelection(true).index);
    // console.log(editor.getSelection(false).index);
    // console.log(editor.getContents(editor.getSelection().index));
    // console.log(anchorPoint);

    // console.log("texto", editor.getText());
    // console.log("text length", editor.getText().length);
    // console.log("content", content);
    // console.log("content length", content.length);
    // console.log("getSelection().index ", editor.getSelection().index - 1);

    // const textWithoutSpace = editor.getText().replaceAll(" ", "");

    // console.log(
    //   "nature text",
    //   textWithoutSpace[editor.getSelection().index - 1]
    // );

    // const position =
    //   editor.getSelection().index -
    //   1 +
    //   (content.length - textWithoutSpace.length - 3);

    // console.log("tagged text", content[position]);
    editorRef.current = editor;
    setState({ content, editor });
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
        onMouseLeave={() => setOpenMenu("closed")}
        onClose={() => setOpenMenu("closed")}
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

export default Editor;
