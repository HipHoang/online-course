export const mockUsers = [
    {
      id: 1,
      fullName: "Hoàng Phúc",
      email: "student@ou.edu.vn",
      password: "123456",
      role: "student",
      avatar: "HP",
    },
    {
      id: 2,
      fullName: "Nguyễn Minh Anh",
      email: "teacher@ou.edu.vn",
      password: "123456",
      role: "teacher",
      avatar: "MA",
    },
  ];
  
  export const saveCurrentUser = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  };
  
  export const getCurrentUser = () => {
    const data = localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
  };
  
  export const logoutUser = () => {
    localStorage.removeItem("currentUser");
  };