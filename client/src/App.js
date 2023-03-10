import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {useEffect, useState} from "react";
import API from "./API";
import {TopNav} from "./Components/Nav";
import {
  AddLayout,
  AnswerLayout,
  LoginLayout,
  MainLayout,
  MyLayout, NotFoundLayout,
  RankingLayout,
} from "./Components/PageLayout";
import ScrollToTop from "./Components/ScrollToTop";



function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        setUser(null);
        setLoggedIn(false);
      }
    };
    init();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try{
      await API.logOut();
      setLoggedIn(false);
      setUser(null);
    }catch (err) {
      throw err;
    }
  };
  return (
      <BrowserRouter>
        <ScrollToTop/>
        <div className="App">
          <TopNav loggedIn={loggedIn} logout={handleLogout} user={user}/>
          <div className="page-content">
          <Routes>
            <Route path="/"  element={<Navigate  to='/riddles' />}/>
            <Route path="/riddles"  element={<MainLayout loggedIn={loggedIn} user={user}/>}/>
            <Route path="/riddles/:riddleId/answers"  element={ loggedIn ? <AnswerLayout loggedIn={loggedIn} user={user}/>  : <Navigate  to='/login' />}/>
            <Route path="/login"  element={!loggedIn ? <LoginLayout login={handleLogin} /> : <Navigate to='/' />}/>
            <Route path="/new-riddle"  element={loggedIn ? <AddLayout/> : <Navigate  to='/login' /> }/>
            <Route path="/my-riddles"  element={loggedIn? <MyLayout loggedIn={loggedIn} user={user}/> : <Navigate  to='/login' /> }/>
            <Route path="/ranking"  element={<RankingLayout loggedIn={loggedIn} user={user}/>}/>
            <Route path="*" element={<NotFoundLayout />} />
          </Routes>
          </div>
        </div>
      </BrowserRouter>

  );
}

export default App;
