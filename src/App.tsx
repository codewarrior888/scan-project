import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import Error from "./components/ErrorPage/Error";
import Authentication from "./components/Authentication/Auth";
import Search from "./components/Search/Search";
import SearchResult from "./components/SearchResult/SearchResult";
import Test from "./components/Test";

import "./styles/App.scss";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="*" element={<Main />} />
          <Route path="/error" element={<Error />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/search" element={<Search />} />
          <Route path="/result" element={<SearchResult />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
