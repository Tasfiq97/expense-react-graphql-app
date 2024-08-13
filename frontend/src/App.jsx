import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Transaction from './pages/Transaction';
import NotfoundPage from './pages/NotfoundPage';
import Header from './components/Header';
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query';
import { Toaster } from 'react-hot-toast';
function App() {
  const { loading, data } = useQuery(GET_AUTHENTICATED_USER);
  if (loading) return null;
  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path="/" element={data?.authUser ? <HomePage /> : <Navigate to="/login" />}></Route>
        <Route path="/login" element={!data?.authUser ? <Login /> : <Navigate to="/" />}></Route>
        <Route path="/signup" element={!data?.authUser ? <Signup /> : <Navigate to="/" />}></Route>
        <Route path="/transaction/:id" element={data?.authUser ? <Transaction /> : <Navigate to="/" />} />
        <Route path="*" element={<NotfoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
