import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from "./Components/pages/LoadingPage";
import AuthPage from './Components/pages/AuthPage';
import WelcomePage from './Components/pages/WelcomePage';
import WinningPage from './Components/pages/WinningPage';
import BeginnerLevel from './Components/pages/BeginnerLevel';
import IntermediateLevel from './Components/pages/IntermediateLevel';
import AdvancedLevel from './Components/pages/AdvancedLevel';
import Dashboard from './Components/pages/Dashboard';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BonusGame from './Components/pages/BonusGame';
import LevelComplete from './Components/pages/LevelComplete';

export default function App() {
  return (
    <Router>    
      <div className="app-container"></div>
        <Routes>
          <Route path="/" element={<LoadingPage/>}/>
          <Route path="/auth" element={<AuthPage/>}/>
          <Route path='/welcome' element={<WelcomePage/>}/>
          <Route path='/win' element={<WinningPage/>}/>
          <Route path='/beginner' element={<BeginnerLevel/>}/>
          <Route path='/intermediate' element={<IntermediateLevel/>}/>
          <Route path='/bonus' element={<BonusGame/>}/>
          <Route path='/level-complete' element={<LevelComplete/>}/>
          <Route path='/advanced' element={<AdvancedLevel/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>

        <ToastContainer position="top-center" />
    </Router>
  );
};