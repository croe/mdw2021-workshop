import React from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddPlayer from "./pages/AddPlayer";
import Home from "./pages/Home";

function App() {
  return (
    <div className="fixed_window">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/add" component={AddPlayer} />
      </Switch>
    </div>
  );
}

export default App;
