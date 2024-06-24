import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import SideMenu from './components/sideMenu';
import Register from './pages/register';
import Login from './pages/login';
import FacilityList from './pages/facilityList';
import ProtectedRoute from './ProtectedRoute';
import CsvUpload from './pages/csvUpload';
import { Box } from '@mui/material';

const App = () => (
  <div>
    <Box display="flex" flexDirection="column" height="100vh">
      <Navbar />
      <Box display="flex" flex={1}>
        <SideMenu />
        <Box component="main" flex={1} p={3}>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <FacilityList />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/facility-management" 
              element={
                <ProtectedRoute>
                  <FacilityList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/facility-upload" 
              element={
                <ProtectedRoute>
                  <CsvUpload />
                </ProtectedRoute>
              } 
            />     
          </Routes>
        </Box>
      </Box>
    </Box>
  </div>
);

export default App;
