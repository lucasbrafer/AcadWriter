import React, { useEffect, useState } from 'react';

const TextEditor = () => {
  const [state, setstate] = useState('meu inicio')

  useEffect(() => {
    alert('O STATE MUDOU CRLHHHH!')
  }, [state])

  const changeName = () => {
    setstate('EU MUDEI!')
  }

  return (
    <div>
      <h1>{state}</h1>
      <button onClick={changeName}>clickar</button>
    </div>
  );
}

export default TextEditor;
