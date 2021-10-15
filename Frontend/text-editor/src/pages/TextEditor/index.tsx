import React, { useEffect, useState } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
}

const TextEditor = () => {
  const [content, setContent] = useState('')

  const handleSetContent = (val: string) => {
    console.log(content)
    setContent(val)
  }

  return (
    <div>
      <ReactQuill theme="snow" value={content} formats={formats} modules={modules} onChange={(val) => handleSetContent(val)} />
    </div>
  );
}

export default TextEditor;
