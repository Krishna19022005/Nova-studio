const adminLogout = () => {
  localStorage.removeItem("nova_admin_token");
  localStorage.removeItem("nova_admin");

  window.location.href = "/admin/login";
};

export default adminLogout;