import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Buses from './pages/Buses';
import Crew from './pages/Crew';
import DutyScheduler from './pages/DutyScheduler'; // ✅ Make sure this exists

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes (inside layout) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/duties" element={<DutyScheduler />} />
      </Routes>
    </Router>
  );
}

export default App;
