import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HosLogin from './Home/Home/HosLogin'
import Hospital from './Home/Home/Hospital'
import HospitalViewPage from './Hospital/HosPages/HospitalViewPage'
import HosDepPage from './Hospital/HosPages/HosDepPage'

const HosApp = () => {
 <div>
     <Routes>
         <Route path="/hoslogin" element={<HosLogin />} />
         <Route path="/hospital" element={<Hospital />} />
         <Route path="/hospitalView" element={<HospitalViewPage />} />
        <Route path="/hospital_departments" element={<HosDepPage />} />
     </Routes>
 </div>
}

export default HosApp