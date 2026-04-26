import React from 'react';
import { FiCheck, FiLock, FiPlay } from "react-icons/fi";
import { HiMapPin } from "react-icons/hi2";

const PathwayStudent = () => {
  const milestones = [
    { id: 1, title: "Lập trình Web cơ bản", status: "completed", desc: "Hoàn thành HTML, CSS cơ bản để xây dựng giao diện tĩnh." },
    { id: 2, title: "JavaScript & DOM", status: "current", desc: "Học cách tạo tương tác và xử lý logic trên trang web." },
    { id: 3, title: "ReactJS Framework", status: "locked", desc: "Xây dựng ứng dụng Single Page Application hiện đại." },
    { id: 4, title: "Dự án thực tế", status: "locked", desc: "Hoàn thiện sản phẩm cuối khóa để đưa vào hồ sơ năng lực." },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-blue-50 text-[#0047AB] rounded-2xl">
          <HiMapPin size={32} />
        </div>
        <h1 className="text-3xl font-bold text-[#021e4b]">Lộ trình học tập của tôi</h1>
        <p className="text-slate-500">Mục tiêu: Trở thành Frontend Developer</p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {milestones.map((m, idx) => (
          <div key={m.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${m.status === 'locked' ? 'opacity-60' : ''}`}>
            {/* Icon mốc thời gian */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 
              ${m.status === 'completed' ? 'bg-green-500 text-white' : m.status === 'current' ? 'bg-[#0047AB] text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
              {m.status === 'completed' ? <FiCheck /> : m.status === 'current' ? <FiPlay /> : <FiLock />}
            </div>

            {/* Nội dung Card */}
            <div className="w-[calc(100%-4rem)] md:w-[45%] bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <time className="font-bold text-[#021e4b]">Bước {idx + 1}</time>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${m.status === 'completed' ? 'bg-green-100 text-green-700' : m.status === 'current' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {m.status}
                </span>
              </div>
              <div className="text-slate-800 font-bold text-lg mb-1">{m.title}</div>
              <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathwayStudent;