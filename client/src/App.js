import { useState, useCallback } from "react";
import "./styles.css";
import PDFViewer from "./components/pdfviewer";

import CodeMirror from "@uiw/react-codemirror";

import samplePDF from "./1.pdf";

function App() {
  const compileLatex = () => {
    console.log("making request to server");
    fetch("http://localhost:4000/api/latex", {
      method: "post",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      //make sure to serialize your JSON body
      body: doc,
    }).then(() => {
      fetch("http://localhost:4000/api/latex", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          console.log(responseData.data);
          setpdfurl(responseData.data);
        })
        .catch((err) => {
          console.log("fetch error" + err);
        });
    });
  };

  const [doc, setDoc] = useState("");
  const [pdfurl, setpdfurl] = useState("");

  const onChange = useCallback((value, viewUpdate) => {
    setDoc(value);
  }, []);
  return (
    <div className="App">
      <div className="codemirror">
        <CodeMirror
          value="console.log('hello world!');"
          height="200px"
          onChange={onChange}
        />
        <button onClick={compileLatex}>Recompile</button>
      </div>
      <div className="all-page-container">
        <PDFViewer pdf={pdfurl} />
      </div>
    </div>
  );
}

export default App;
