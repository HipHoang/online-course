import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CourseStudent from "./components/pages/student_screens/CourseStudent";
import HomeStudent from "./components/pages/student_screens/HomeStudent";
import CourseDetail from "./components/pages/student_screens/CourseDetail";
import LearningPage from "./components/pages/student_screens/LearningPage";
import AllCourses from "./components/pages/student_screens/AllCourses";
import CourseSearchResults from "./components/pages/student_screens/CourseSearchResults";

import TeacherDashboard from "./components/pages/teacher_screens/TeacherDashboard";
import CourseTeacher from "./components/pages/teacher_screens/CourseTeacher";
import TeacherProfile from "./components/pages/teacher_screens/TeacherProfile";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* student / public */}
          <Route path="/" element={<HomeStudent />} />
          <Route path="/courses" element={<CourseStudent />} />
          <Route path="/all-courses" element={<AllCourses />} />
          <Route path="/search" element={<CourseSearchResults />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/pathway" element={<div>Trang lộ trình học</div>} />
          <Route path="/qa" element={<div>Trang hỏi đáp</div>} />
          <Route path="/settings" element={<div>Trang cài đặt</div>} />
          <Route path="/ai" element={<div>Trang đề xuất AI</div>} />
          <Route path="/learn/:id" element={<LearningPage />} />

          {/* teacher */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<CourseTeacher />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/qa" element={<div>Trang hỏi đáp giáo viên</div>} />
          <Route path="/teacher/settings" element={<div>Trang cài đặt giáo viên</div>} />
          <Route path="/teacher/ai" element={<div>Trang trợ lý AI giáo viên</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;