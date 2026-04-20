import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CourseStudent from "./components/pages/student_screens/CourseStudent";
import HomeStudent from "./components/pages/student_screens/HomeStudent";
import CourseDetail from "./components/pages/student_screens/CourseDetail";
import LearningPage from "./components/pages/student_screens/LearningPage";
import AllCourses from "./components/pages/student_screens/AllCourses";
import PaymentSuccess from "./components/pages/student_screens/PaymentSuccess";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeStudent />} />
          <Route path="/courses" element={<CourseStudent />} />
          <Route path="/all-courses" element={<AllCourses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/pathway" element={<div>Trang lộ trình học</div>} />
          <Route path="/qa" element={<div>Trang hỏi đáp</div>} />
          <Route path="/settings" element={<div>Trang cài đặt</div>} />
          <Route path="/ai" element={<div>Trang đề xuất AI</div>} />
          <Route path="/learn/:id" element={<LearningPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;