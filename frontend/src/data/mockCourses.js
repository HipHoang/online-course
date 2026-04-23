export const mockCourses = [
    {
      id: 1,
      title: "Lập trình Web cơ bản với HTML, CSS, JavaScript",
      description:
        "Khóa học giúp học viên nắm vững nền tảng phát triển web từ cơ bản đến thực hành giao diện thực tế.",
      instructor: "Nguyễn Văn A",
      category: "Lập trình Web",
      level: "Cơ bản",
      rating: 4.7,
      price: 0,
      totalChapters: 3,
      totalLessons: 6,
      totalDuration: "10 giờ",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      introVideoThumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      outcomes: [
        "Hiểu cấu trúc một trang web hoàn chỉnh",
        "Biết cách dựng giao diện responsive",
        "Thực hành JavaScript cơ bản",
        "Có thể tiếp tục học React",
      ],
      chapters: [
        {
          id: 101,
          title: "Tổng quan HTML",
          lessonsCount: 2,
          lessons: [
            { id: 1001, title: "Giới thiệu HTML", duration: "15 phút" },
            { id: 1002, title: "Các thẻ cơ bản", duration: "20 phút" },
          ],
        },
        {
          id: 102,
          title: "Làm quen với CSS",
          lessonsCount: 2,
          lessons: [
            { id: 1003, title: "CSS cơ bản", duration: "18 phút" },
            { id: 1004, title: "Flexbox và Grid", duration: "25 phút" },
          ],
        },
        {
          id: 103,
          title: "JavaScript nhập môn",
          lessonsCount: 2,
          lessons: [
            { id: 1005, title: "Biến và hàm", duration: "22 phút" },
            { id: 1006, title: "DOM cơ bản", duration: "30 phút" },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "ReactJS từ cơ bản đến dự án thực tế",
      description:
        "Khóa học ReactJS giúp học viên xây dựng SPA hiện đại, quản lý state và tổ chức component hiệu quả.",
      instructor: "Trần Thị B",
      category: "Frontend",
      level: "Trung cấp",
      rating: 4.9,
      price: 299000,
      totalChapters: 3,
      totalLessons: 6,
      totalDuration: "14 giờ",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      introVideoThumbnail:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      outcomes: [
        "Nắm được component, props, state",
        "Biết dùng hooks cơ bản",
        "Làm được project React hoàn chỉnh",
        "Sẵn sàng học NextJS",
      ],
      chapters: [
        {
          id: 201,
          title: "React cơ bản",
          lessonsCount: 2,
          lessons: [
            { id: 2001, title: "React là gì?", duration: "18 phút" },
            { id: 2002, title: "JSX và component", duration: "22 phút" },
          ],
        },
        {
          id: 202,
          title: "Hooks trong React",
          lessonsCount: 2,
          lessons: [
            { id: 2003, title: "useState", duration: "20 phút" },
            { id: 2004, title: "useEffect", duration: "24 phút" },
          ],
        },
        {
          id: 203,
          title: "Project thực tế",
          lessonsCount: 2,
          lessons: [
            { id: 2005, title: "Tổ chức project", duration: "25 phút" },
            { id: 2006, title: "Kết nối API", duration: "28 phút" },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Python cho người mới bắt đầu",
      description:
        "Khóa học Python giúp học viên làm quen lập trình, xử lý dữ liệu cơ bản và xây dựng tư duy giải quyết vấn đề.",
      instructor: "Lê Văn C",
      category: "Python",
      level: "Cơ bản",
      rating: 4.5,
      price: 199000,
      totalChapters: 2,
      totalLessons: 4,
      totalDuration: "8 giờ",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
      introVideoThumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
      outcomes: [
        "Hiểu cú pháp Python cơ bản",
        "Biết dùng biến, hàm, vòng lặp",
        "Viết được bài tập Python đơn giản",
      ],
      chapters: [
        {
          id: 301,
          title: "Nhập môn Python",
          lessonsCount: 2,
          lessons: [
            { id: 3001, title: "Cài đặt và chạy Python", duration: "12 phút" },
            { id: 3002, title: "Biến và kiểu dữ liệu", duration: "20 phút" },
          ],
        },
        {
          id: 302,
          title: "Điều khiển luồng",
          lessonsCount: 2,
          lessons: [
            { id: 3003, title: "if else", duration: "18 phút" },
            { id: 3004, title: "for và while", duration: "22 phút" },
          ],
        },
      ],
    },
  ];