import React, { useState } from "react";

import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";

import "./App.css";

function App() {
  const [homePage, setHomePage] = useState(true);
  return (
    <div>
      {homePage ? (
        <HomePage nextPage={() => setHomePage(false)} />
      ) : (
        <EditorPage />
      )}
    </div>
  );
}

export default App;
