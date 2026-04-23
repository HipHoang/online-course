export const getStoredAuth = () => {
  const localUser = localStorage.getItem("currentUser");
  const sessionUser = sessionStorage.getItem("currentUser");

  return localUser || sessionUser
    ? JSON.parse(localUser || sessionUser)
    : null;
};

export const setStoredAuth = (data, remember = true) => {
  const payload = {
    user: data.user,
    access_token: data.access_token,
    refresh_token: data.refresh_token, // 👈 THÊM
  };

  if (remember) {
    localStorage.setItem("currentUser", JSON.stringify(payload));
    sessionStorage.removeItem("currentUser");
  } else {
    sessionStorage.setItem("currentUser", JSON.stringify(payload));
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

export const getRefreshToken = () => {
  return getStoredAuth()?.refresh_token || null;
};

export const updateAccessToken = (newToken) => {
  const data = getStoredAuth();
  if (!data) return;

  data.access_token = newToken;

  localStorage.setItem("currentUser", JSON.stringify(data));
};