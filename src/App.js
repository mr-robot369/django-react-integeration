import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import LoginReg from "./pages/auth/LoginReg";
import Registration from "./pages/auth/Registration";
import UserLogin from "./pages/auth/UserLogin";
import UserVerify from "./pages/auth/UserVerify";
import ResetPassword from "./pages/auth/ResetPassword";
import SendPasswordResetEmail from "./pages/auth/SendPasswordResetEmail";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./pages/Layout";

import { useSelector } from "react-redux"; // add this

function App() {

  // to get access token from auth state
  const {access_token} = useSelector(state => state.auth)
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            {/* change */}
            <Route path="login" element={!access_token ? <UserLogin /> : <Navigate to="/dashboard" />} /> 
            <Route path="register" element={<Registration />} />
            {/* change */}
            <Route path="verify" element={!access_token ? <UserVerify /> : <Navigate to="/dashboard" />} /> 
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path="reset" element={<ResetPassword />} />
            {/* change */}
            <Route path="/dashboard" element={access_token ? <Dashboard /> : <Navigate to="/login" />} /> 
          </Route>
          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;