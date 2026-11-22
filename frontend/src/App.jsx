import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Rules from './pages/Rules.jsx';
import UserPage from './pages/UserPage.jsx';
import UserStatistics from './pages/UserStatistics.jsx';
import CreateNewGame from './pages/CreateNewGame.jsx';
import CurrentGame from './pages/CurrentGame.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import { fetchSession } from './utils/session.js';

// Dev-only mock gallery (tree-shaken out of the production build).
const MockIndex = import.meta.env.DEV ? React.lazy(() => import('./mocks/MockIndex.jsx')) : null;
const MockScreen = import.meta.env.DEV ? React.lazy(() => import('./mocks/MockScreen.jsx')) : null;

// /habitant and /habitant/ redirect to the user's own page (done by PageController too, but the Vite dev
// server never hits it for page URLs).
function HabitantRedirect() {
  fetchSession().then(({ user }) =>
    window.location.replace('/' + (user ? 'habitant/' + encodeURIComponent(user.username) : 'login')));
  return null;
}

// Same URLs as the old web.xml servlet mappings.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/habitant" element={<HabitantRedirect />} />
      <Route path="/habitant/me" element={<UserPage />} />
      <Route path="/habitant/:username" element={<UserStatistics />} />
      <Route path="/newVillage" element={<CreateNewGame />} />
      <Route path="/newvillage" element={<CreateNewGame />} />
      <Route path="/village/:gameId" element={<CurrentGame isMasterRoute={false} />} />
      <Route path="/village/:gameId/master" element={<CurrentGame isMasterRoute={true} />} />
      {import.meta.env.DEV && <Route path="/mock" element={<Suspense fallback={null}><MockIndex /></Suspense>} />}
      {import.meta.env.DEV && <Route path="/mock/:screen/:variant" element={<Suspense fallback={null}><MockScreen /></Suspense>} />}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
