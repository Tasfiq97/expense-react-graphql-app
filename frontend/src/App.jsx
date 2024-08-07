import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Transaction from './pages/Transaction';
import NotfoundPage from './pages/NotfoundPage';
import Header from './components/Header';

function App() {
  const authUser = true;
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="*" element={<NotfoundPage />} />
      </Routes>
    </>
  );
}

export default App;
