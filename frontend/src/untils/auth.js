export const getStoredAuth = () => {
    const localUser = localStorage.getItem("currentUser");
    const sessionUser = sessionStorage.getItem("currentUser");
  
    return localUser || sessionUser
      ? JSON.parse(localUser || sessionUser)
      : null;
  };
  
  export const setStoredAuth = (data, remember = true) => {
    if (remember) {
      localStorage.setItem("currentUser", JSON.stringify(data));
      sessionStorage.removeItem("currentUser");
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(data));
      localStorage.removeItem("currentUser");
    }
  };
  
  export const clearStoredAuth = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
  };
  
  export const getCurrentUser = () => {
    return getStoredAuth()?.user || null;
  };
  
  export const getCurrentUserId = () => {
    return getCurrentUser()?.id || null;
  };
  
  export const getAccessToken = () => {
    return getStoredAuth()?.access_token || null;
  };
  
  export const isLoggedIn = () => {
    return !!getCurrentUser();
  };
  
  export const isTeacherRole = (role) => {
    return role === "teacher" || role === "GiangVien" || role === "GV";
  };