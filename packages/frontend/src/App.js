import React, { useState, useEffect } from "react";
import Header from "./components/mainPage/Header";
import NavBar from "./components/mainPage/NavBar";
import "./App.css";

function App() {

  /*
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error cargando mensaje.", error));
  }, []);
  */
 
  return (
    <div className="App">
      <Header></Header>
      <NavBar></NavBar>
    </div>
  );
}

export default App;
