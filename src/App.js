import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './Home/HomePage';

import SignUp from './Home/Home/SignUp';
import HosSignUp from './Home/Home/HosSignUp'; // Fixing the component import
import Login from './Home/Home/Login';
import HosLogin from './Home/Home/HosLogin'; // Fixing the component import
import AdminLoginPage from './admin/AdminPages/AdminLoginPage';
import OverViewPage from './admin/AdminPages/OverViewPage';
import PatientPage from './admin/AdminPages/PatientPage';



import HospitalRequestsPage from './admin/AdminPages/HospitalRequestsPage';
import HospitalPages from './admin/AdminPages/HospitalPages';
import HospitalViewPage from './Hospital/HosPages/HospitalViewPage';
import HosDepPage from './Hospital/HosPages/HosDepPage';
import Hospital from './Home/Home/Hospital';
import Bookup from './Patients/PatComponents/Bookup';

import OTPVerification from './Home/Home/OTPVerification';
import HospiAdditional from './Home/Home/HospiAdditional';
import LoginOTP from './Home/Home/LoginOTP';
import HospitalDepartment from './Hospital/HosComponents/HospitalDepartment';
import HospitalProfile from './Hospital/HosComponents/HospitalProfile';
import BlockedPatHos from './admin/AdminComponents/BlockedPatHos';
import HospitalDetails from './admin/AdminComponents/HospitalDetails';
import HospitalDepartments from './admin/AdminComponents/HospitalDepartments';
import Login1 from './Login/Login1';
import HospitalDoctors from './Hospital/HosComponents/HospitalDoctors';
import Success from './Patients/PatComponents/Success';
import OpHistory from './Patients/PatComponents/OpHistory';
import HospitalBookings from './Hospital/HosComponents/HospitalBookings';
import AdminHostpitalDoctor from './admin/AdminComponents/AdminHostpitalDoctor';
import PatientWallet from './Patients/PatComponents/PatientWallet';
import HospitalPatients from './Hospital/HosComponents/HospitalPatients';
import Notifications from './Patients/PatComponents/Notifications';
import HospitalPremium from './Hospital/HosComponents/HospitalPremium';

import HospitalDashboard from './Hospital/HosComponents/HospitalDashboard';
import PatientProfile from './Patients/PatComponents/PatientProfile';
import ForgottPassword from './Patients/PatComponents/ForgottPassword';
import ResetPassword from './Patients/PatComponents/ResetPassword';
import Notification1 from './Hospital/HosComponents/Notification1';
import Feedback from './Hospital/HosComponents/Feedback';
import AdminPremium from './admin/AdminComponents/AdminPremium';


const App = () => (
    <div>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/LOGIN' element={<Login1 />} />
            


            {/* PATIENT */}

            <Route path="/register/patient" element={<SignUp  />} />
            <Route path="/forpasspat" element={<ForgottPassword/>} />
            <Route path="/resetpasswordPat" element={<ResetPassword/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/bookop" element={<Bookup />} />
            <Route path="/booking_success" element={<Success />} />
            <Route path="/op_history" element={<OpHistory />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/wallet" element={<PatientWallet/>} />
            <Route path="/changeprofile" element={<PatientProfile/>} />
            
            {/* <Route path="/changeprofile" element={<OpHistory />} /> */}
            


            
            {/* HOSPITAL */}

            <Route path="/hossignup" element={<HosSignUp />} />
            <Route path="/otpsignup" element={<OTPVerification />} />
            <Route path="/hospiAdditional" element={<HospiAdditional />} />
            <Route path="/hospital_login" element={<HosLogin />} />
            <Route path="/otp_login" element={<LoginOTP />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/hospital_dashboard" element={<HospitalDashboard />} />
            <Route path="/hospitalView" element={<HospitalViewPage />} />
            <Route path="/hospital_departments" element={<HospitalDepartment />} />
            <Route path="/hospital_doctors" element={<HospitalDoctors />} />
            <Route path="/hospital_bookings" element={<HospitalBookings />} />
            <Route path="/hospital_patients" element={<HospitalPatients />} />
            <Route path="/hospital_profile" element={<HospitalProfile />} />
            <Route path="/hospital_premium" element={<HospitalPremium />} />
            <Route path="/hospital_notifications" element={<Notification1 />} />
            <Route path="/hospital_feedback" element={<Feedback />} />


            {/* ADMIN */}
            
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/overview" element={<OverViewPage />} />
            <Route path="/patients" element={<PatientPage />} />
            <Route path="/HospitalRequests"element={<HospitalRequestsPage/>} />
            <Route path="/Hospitals"element={<HospitalPages/>} />
            <Route path="/status"element={<BlockedPatHos/>} />
            <Route path="/hospitaldetails/:id" element={<HospitalDetails />} />
            <Route path="/hospitaldepartments/:id" element={<HospitalDepartments />} />
            <Route path="/hospitaldoctors/:id" element={<AdminHostpitalDoctor />} />
            <Route path="/Premium" element={<AdminPremium />} />
            
            
           
            
        </Routes>
    </div>
);


export default App;
