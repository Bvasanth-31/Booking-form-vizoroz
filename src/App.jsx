import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Booking from './components/Booking';
import Form from './components/Form';
import Navbar from './components/Navbar';

const AppRoutes = () => {
  const location = useLocation();
  const showNavbar = location.pathname.startsWith('/form');

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="/form" element={<Form />} />
        <Route path="/form/:id" element={<Form />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;


