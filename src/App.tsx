import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Generator from "./pages/Generator";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Comment from "./pages/Comment";
import Reply from "./pages/Reply";
import Close from "./pages/Close";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import PromptViewer from "./pages/PromptViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="auth" element={<Auth />} />
          <Route path="generator" element={<Generator />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="comment" element={<Comment />} />
          <Route path="reply" element={<Reply />} />
          <Route path="close" element={<Close />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="prompt-viewer" element={<PromptViewer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;