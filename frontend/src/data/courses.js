export const mockCourses = [
  {
    id: 1,
    course_id: 1,
    title: "Python Co Ban",
    description:
      "Khóa học Python Cơ Bản dành cho người mới bắt đầu, giúp bạn làm quen với cú pháp, biến, kiểu dữ liệu, câu điều kiện, vòng lặp và hàm. Sau khóa học, bạn có thể tự viết các chương trình Python đơn giản và có nền tảng để học lên các mảng nâng cao như web, data hoặc automation.",
    shortDescription: "Học Python từ cơ bản, phù hợp cho người mới bắt đầu.",
    category: "Lập trình",
    topic: "Python",
    price: 499000,
    instructor_id: 3,
    instructor: "Giang Vien 1",
    rating: 4.8,
    level: "Cơ bản",
    totalChapters: 3,
    totalLessons: 6,
    totalDuration: "4 giờ 20 phút",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Hiểu cú pháp cơ bản của Python",
      "Làm việc với biến và kiểu dữ liệu",
      "Viết được câu lệnh điều kiện và vòng lặp",
      "Tạo được hàm đơn giản để tái sử dụng mã",
    ],
    chapters: [
      {
        id: 101,
        title: "Giới thiệu Python",
        lessonsCount: 2,
        lessons: [
          { id: 1001, title: "Python là gì?", duration: "15:00" },
          { id: 1002, title: "Cài đặt môi trường", duration: "18:00" },
        ],
      },
      {
        id: 102,
        title: "Biến và kiểu dữ liệu",
        lessonsCount: 2,
        lessons: [
          { id: 1003, title: "Biến trong Python", duration: "22:00" },
          { id: 1004, title: "Kiểu dữ liệu cơ bản", duration: "25:00" },
        ],
      },
      {
        id: 103,
        title: "Điều kiện và vòng lặp",
        lessonsCount: 2,
        lessons: [
          { id: 1005, title: "if else", duration: "24:00" },
          { id: 1006, title: "for và while", duration: "28:00" },
        ],
      },
    ],
  },
  {
    id: 2,
    course_id: 2,
    title: "ReactJS",
    description:
      "Khóa học ReactJS giúp bạn xây dựng giao diện web hiện đại với component, props, state, hook và routing. Nội dung được thiết kế theo hướng thực hành, phù hợp cho sinh viên và người mới học frontend.",
    shortDescription: "Xây dựng giao diện web hiện đại với ReactJS.",
    category: "Frontend",
    topic: "React",
    price: 399000,
    instructor_id: 3,
    instructor: "Giang Vien 1",
    rating: 4.9,
    level: "Cơ bản đến trung cấp",
    totalChapters: 3,
    totalLessons: 6,
    totalDuration: "5 giờ 05 phút",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Hiểu JSX và component",
      "Biết sử dụng props và state",
      "Làm việc với useState và useEffect",
      "Biết điều hướng với React Router",
    ],
    chapters: [
      {
        id: 201,
        title: "Tổng quan ReactJS",
        lessonsCount: 2,
        lessons: [
          { id: 2001, title: "React là gì?", duration: "16:00" },
          { id: 2002, title: "JSX và Component", duration: "24:00" },
        ],
      },
      {
        id: 202,
        title: "State và Props",
        lessonsCount: 2,
        lessons: [
          { id: 2003, title: "Props cơ bản", duration: "21:00" },
          { id: 2004, title: "useState", duration: "27:00" },
        ],
      },
      {
        id: 203,
        title: "Hook và Routing",
        lessonsCount: 2,
        lessons: [
          { id: 2005, title: "useEffect", duration: "30:00" },
          { id: 2006, title: "React Router DOM", duration: "32:00" },
        ],
      },
    ],
  },
  {
    id: 3,
    course_id: 3,
    title: "Excel",
    description:
      "Khóa học Excel dành cho người mới bắt đầu, tập trung vào các thao tác văn phòng phổ biến như nhập dữ liệu, định dạng bảng, sử dụng hàm cơ bản và lọc dữ liệu.",
    shortDescription: "Thành thạo các thao tác Excel phổ biến trong học tập và công việc.",
    category: "Tin học văn phòng",
    topic: "Excel",
    price: 0,
    instructor_id: 5,
    instructor: "Giang Vien 2",
    rating: 4.7,
    level: "Cơ bản",
    totalChapters: 2,
    totalLessons: 4,
    totalDuration: "3 giờ 10 phút",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Biết nhập và định dạng dữ liệu",
      "Sử dụng được các hàm cơ bản",
      "Lọc và sắp xếp dữ liệu",
    ],
    chapters: [
      {
        id: 301,
        title: "Làm quen với Excel",
        lessonsCount: 2,
        lessons: [
          { id: 3001, title: "Giao diện Excel", duration: "15:00" },
          { id: 3002, title: "Nhập và định dạng dữ liệu", duration: "25:00" },
        ],
      },
      {
        id: 302,
        title: "Các hàm cơ bản",
        lessonsCount: 2,
        lessons: [
          { id: 3003, title: "SUM, AVERAGE", duration: "20:00" },
          { id: 3004, title: "IF cơ bản", duration: "22:00" },
        ],
      },
    ],
  },
  {
    id: 4,
    course_id: 4,
    title: "Java Web",
    description:
      "Khóa học Java Web cung cấp nền tảng xây dựng ứng dụng web với Java, từ kiến thức về servlet, JSP đến tư duy backend cơ bản và kết nối dữ liệu.",
    shortDescription: "Nền tảng phát triển web backend với Java.",
    category: "Backend",
    topic: "Java",
    price: 599000,
    instructor_id: 5,
    instructor: "Giang Vien 2",
    rating: 4.8,
    level: "Trung cấp",
    totalChapters: 3,
    totalLessons: 6,
    totalDuration: "5 giờ 30 phút",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Hiểu nền tảng Java Web",
      "Làm việc với Servlet và JSP",
      "Biết tổ chức dự án backend cơ bản",
      "Có nền tảng học Spring Boot",
    ],
    chapters: [
      {
        id: 401,
        title: "Nền tảng Java Web",
        lessonsCount: 2,
        lessons: [
          { id: 4001, title: "Giới thiệu Java Web", duration: "20:00" },
          { id: 4002, title: "Mô hình request/response", duration: "24:00" },
        ],
      },
      {
        id: 402,
        title: "Servlet và JSP",
        lessonsCount: 2,
        lessons: [
          { id: 4003, title: "Servlet cơ bản", duration: "28:00" },
          { id: 4004, title: "JSP cơ bản", duration: "25:00" },
        ],
      },
      {
        id: 403,
        title: "Kết nối dữ liệu",
        lessonsCount: 2,
        lessons: [
          { id: 4005, title: "JDBC", duration: "32:00" },
          { id: 4006, title: "Mini project", duration: "35:00" },
        ],
      },
    ],
  },
  {
    id: 5,
    course_id: 5,
    title: "Data Science",
    description:
      "Khóa học Data Science giới thiệu quy trình phân tích dữ liệu, làm sạch dữ liệu, trực quan hóa và áp dụng các công cụ phổ biến trong khoa học dữ liệu.",
    shortDescription: "Nhập môn khoa học dữ liệu cho sinh viên và người mới học.",
    category: "Data",
    topic: "Data Science",
    price: 0,
    instructor_id: 9,
    instructor: "Giang Vien 3",
    rating: 4.9,
    level: "Trung cấp",
    totalChapters: 3,
    totalLessons: 6,
    totalDuration: "6 giờ",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Hiểu quy trình xử lý dữ liệu",
      "Biết dùng công cụ trực quan hóa dữ liệu",
      "Làm quen với phân tích dữ liệu cơ bản",
      "Có nền tảng để học machine learning",
    ],
    chapters: [
      {
        id: 501,
        title: "Tổng quan Data Science",
        lessonsCount: 2,
        lessons: [
          { id: 5001, title: "Data Science là gì?", duration: "18:00" },
          { id: 5002, title: "Các bước xử lý dữ liệu", duration: "24:00" },
        ],
      },
      {
        id: 502,
        title: "Làm sạch và phân tích dữ liệu",
        lessonsCount: 2,
        lessons: [
          { id: 5003, title: "Tiền xử lý dữ liệu", duration: "30:00" },
          { id: 5004, title: "Phân tích cơ bản", duration: "27:00" },
        ],
      },
      {
        id: 503,
        title: "Trực quan hóa dữ liệu",
        lessonsCount: 2,
        lessons: [
          { id: 5005, title: "Biểu đồ phổ biến", duration: "26:00" },
          { id: 5006, title: "Mini case study", duration: "34:00" },
        ],
      },
    ],
  },
  {
    id: 6,
    course_id: 6,
    title: "Marketing",
    description:
      "Khóa học Marketing giúp người học nắm kiến thức nền tảng về marketing hiện đại, hành vi khách hàng, xây dựng nội dung và chiến lược truyền thông cơ bản.",
    shortDescription: "Kiến thức nền tảng về marketing hiện đại.",
    category: "Kinh doanh",
    topic: "Marketing",
    price: 299000,
    instructor_id: 9,
    instructor: "Giang Vien 3",
    rating: 4.6,
    level: "Cơ bản",
    totalChapters: 3,
    totalLessons: 5,
    totalDuration: "4 giờ 15 phút",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Hiểu marketing là gì",
      "Biết phân tích khách hàng mục tiêu",
      "Biết xây dựng nội dung cơ bản",
      "Có tư duy chiến lược truyền thông",
    ],
    chapters: [
      {
        id: 601,
        title: "Nhập môn Marketing",
        lessonsCount: 2,
        lessons: [
          { id: 6001, title: "Marketing hiện đại", duration: "18:00" },
          { id: 6002, title: "Hành vi khách hàng", duration: "22:00" },
        ],
      },
      {
        id: 602,
        title: "Content và truyền thông",
        lessonsCount: 2,
        lessons: [
          { id: 6003, title: "Viết nội dung cơ bản", duration: "24:00" },
          { id: 6004, title: "Kênh truyền thông phổ biến", duration: "26:00" },
        ],
      },
      {
        id: 603,
        title: "Lập kế hoạch",
        lessonsCount: 1,
        lessons: [
          { id: 6005, title: "Xây dựng kế hoạch marketing", duration: "30:00" },
        ],
      },
    ],
  },
  {
    id: 7,
    course_id: 7,
    title: "Soft Skills",
    description:
      "Khóa học Soft Skills tập trung vào giao tiếp, làm việc nhóm, quản lý thời gian và tư duy chuyên nghiệp, phù hợp cho sinh viên và người mới đi làm.",
    shortDescription: "Rèn luyện kỹ năng mềm cần thiết trong học tập và công việc.",
    category: "Kỹ năng",
    topic: "Soft Skills",
    price: 0,
    instructor_id: 3,
    instructor: "Giang Vien 1",
    rating: 4.7,
    level: "Mọi trình độ",
    totalChapters: 2,
    totalLessons: 4,
    totalDuration: "2 giờ 50 phút",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Giao tiếp tự tin hơn",
      "Biết làm việc nhóm hiệu quả",
      "Quản lý thời gian tốt hơn",
    ],
    chapters: [
      {
        id: 701,
        title: "Giao tiếp và làm việc nhóm",
        lessonsCount: 2,
        lessons: [
          { id: 7001, title: "Kỹ năng giao tiếp", duration: "20:00" },
          { id: 7002, title: "Làm việc nhóm", duration: "25:00" },
        ],
      },
      {
        id: 702,
        title: "Tư duy chuyên nghiệp",
        lessonsCount: 2,
        lessons: [
          { id: 7003, title: "Quản lý thời gian", duration: "18:00" },
          { id: 7004, title: "Tác phong chuyên nghiệp", duration: "22:00" },
        ],
      },
    ],
  },
  {
    id: 8,
    course_id: 8,
    title: "Design",
    description:
      "Khóa học Design giúp người học tiếp cận tư duy thiết kế hình ảnh cơ bản, làm quen với công cụ Photoshop và cách xây dựng sản phẩm trực quan.",
    shortDescription: "Làm quen thiết kế đồ họa và Photoshop cơ bản.",
    category: "Thiết kế",
    topic: "Design",
    price: 499000,
    instructor_id: 5,
    instructor: "Giang Vien 2",
    rating: 4.8,
    level: "Cơ bản",
    totalChapters: 3,
    totalLessons: 5,
    totalDuration: "4 giờ 40 phút",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Biết nguyên lý thiết kế cơ bản",
      "Làm quen với Photoshop",
      "Tạo được poster đơn giản",
    ],
    chapters: [
      {
        id: 801,
        title: "Tư duy thiết kế",
        lessonsCount: 2,
        lessons: [
          { id: 8001, title: "Nguyên lý thị giác", duration: "18:00" },
          { id: 8002, title: "Màu sắc và bố cục", duration: "24:00" },
        ],
      },
      {
        id: 802,
        title: "Photoshop cơ bản",
        lessonsCount: 2,
        lessons: [
          { id: 8003, title: "Giao diện Photoshop", duration: "20:00" },
          { id: 8004, title: "Layer và công cụ cơ bản", duration: "28:00" },
        ],
      },
      {
        id: 803,
        title: "Thực hành",
        lessonsCount: 1,
        lessons: [
          { id: 8005, title: "Thiết kế poster đơn giản", duration: "30:00" },
        ],
      },
    ],
  },
  {
    id: 9,
    course_id: 9,
    title: "C++",
    description:
      "Khóa học C++ giúp người học nắm được cú pháp ngôn ngữ, tư duy lập trình, hàm, mảng, con trỏ và lập trình hướng đối tượng ở mức nền tảng.",
    shortDescription: "Nắm nền tảng lập trình với C++ từ cơ bản đến OOP.",
    category: "Lập trình",
    topic: "C++",
    price: 699000,
    instructor_id: 9,
    instructor: "Giang Vien 3",
    rating: 4.8,
    level: "Cơ bản đến trung cấp",
    totalChapters: 3,
    totalLessons: 6,
    totalDuration: "5 giờ 10 phút",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Hiểu cú pháp C++ cơ bản",
      "Làm việc với hàm và mảng",
      "Biết con trỏ cơ bản",
      "Tiếp cận OOP với C++",
    ],
    chapters: [
      {
        id: 901,
        title: "Nền tảng C++",
        lessonsCount: 2,
        lessons: [
          { id: 9001, title: "Cấu trúc chương trình C++", duration: "18:00" },
          { id: 9002, title: "Biến và kiểu dữ liệu", duration: "20:00" },
        ],
      },
      {
        id: 902,
        title: "Hàm, mảng, con trỏ",
        lessonsCount: 2,
        lessons: [
          { id: 9003, title: "Hàm trong C++", duration: "24:00" },
          { id: 9004, title: "Mảng và con trỏ", duration: "30:00" },
        ],
      },
      {
        id: 903,
        title: "Lập trình hướng đối tượng",
        lessonsCount: 2,
        lessons: [
          { id: 9005, title: "Class và Object", duration: "26:00" },
          { id: 9006, title: "Kế thừa cơ bản", duration: "28:00" },
        ],
      },
    ],
  },
  {
    id: 10,
    course_id: 10,
    title: "NodeJS",
    description:
      "Khóa học NodeJS giúp người học xây dựng backend cơ bản, làm việc với Express, route, middleware và xây dựng API đơn giản.",
    shortDescription: "Xây dựng backend cơ bản với NodeJS và Express.",
    category: "Backend",
    topic: "NodeJS",
    price: 399000,
    instructor_id: 3,
    instructor: "Giang Vien 1",
    rating: 4.9,
    level: "Trung cấp",
    totalChapters: 3,
    totalLessons: 6,
    totalDuration: "5 giờ 25 phút",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80",
    introVideoThumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80",
    outcomes: [
      "Hiểu cách NodeJS hoạt động",
      "Xây dựng server với Express",
      "Tạo route và middleware",
      "Viết API cơ bản",
    ],
    chapters: [
      {
        id: 1001,
        title: "Nhập môn NodeJS",
        lessonsCount: 2,
        lessons: [
          { id: 10001, title: "NodeJS là gì?", duration: "16:00" },
          { id: 10002, title: "Cài đặt và chạy dự án", duration: "20:00" },
        ],
      },
      {
        id: 1002,
        title: "ExpressJS cơ bản",
        lessonsCount: 2,
        lessons: [
          { id: 10003, title: "Tạo server Express", duration: "24:00" },
          { id: 10004, title: "Route và controller", duration: "26:00" },
        ],
      },
      {
        id: 1003,
        title: "Middleware và API",
        lessonsCount: 2,
        lessons: [
          { id: 10005, title: "Middleware", duration: "28:00" },
          { id: 10006, title: "Xây dựng REST API", duration: "30:00" },
        ],
      },
    ],
  },
];