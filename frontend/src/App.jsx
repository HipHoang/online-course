import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CourseStudent from './components/pages/student_screens/CourseStudent';
import HomeStudent from './components/pages/student_screens/HomeStudent';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          
          <Route   path="/" element={<HomeStudent />} />
          <Route path="/courses" element={<CourseStudent />} />
          
          <Route path="/pathway" element={<div>Trang lộ trình học</div>} />
          <Route path="/qa" element={<div>Trang hỏi đáp</div>} />
          <Route path="/settings" element={<div>Trang cài đặt</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;