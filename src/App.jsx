import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Buses from './pages/Buses';
import Crew from './pages/Crew';
import DutyScheduler from './pages/DutyScheduler';
import RoutePlanner from './pages/RoutePlanner';
import ViewRoutes from './pages/ViewRoutes'; // NEW

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Main app routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/duties" element={<DutyScheduler />} />

        {/* Routes module */}
        <Route path="/routes" element={<RoutePlanner />} />     {/* Create new route */}
        <Route path="/view-routes" element={<ViewRoutes />} />  {/* View routes list */}
      </Routes>
    </Router>
  );
}

export default App;