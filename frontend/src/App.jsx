import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Rules from './pages/Rules.jsx';
import UserPage from './pages/UserPage.jsx';
import UserStatistics from './pages/UserStatistics.jsx';
import CreateNewGame from './pages/CreateNewGame.jsx';
import CurrentGame from './pages/CurrentGame.jsx';
import PageNotFound from './pages/PageNotFound.jsx';

// Same URLs as the old web.xml servlet mappings.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/habitant/me" element={<UserPage />} />
      <Route path="/habitant/:username" element={<UserStatistics />} />
      <Route path="/newVillage" element={<CreateNewGame />} />
      <Route path="/newvillage" element={<CreateNewGame />} />
      <Route path="/village/:gameId" element={<CurrentGame isMasterRoute={false} />} />
      <Route path="/village/:gameId/master" element={<CurrentGame isMasterRoute={true} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
