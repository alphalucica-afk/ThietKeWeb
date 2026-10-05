// BẢO MẬT TRANG QUẢN LÝ
function accessAdmin() {
  const password = prompt("Vui lòng nhập mật khẩu quản lý:");
  if (password === "abcd") {
    const adminPath = (window.location.protocol === 'file:' || !window.location.origin) 
      ? 'qli/quanli.html' 
      : (window.location.pathname.includes('/BTL.1') ? '/BTL.1/qli/quanli.html' : 'qli/quanli.html');
    window.open(adminPath, "_blank");
  } else if (password !== null) {
    alert("Mật khẩu không chính xác!");
  }
}

// MỞ BẢNG ĐĂNG NHẬP / ĐĂNG KÝ
function openAuthModal(mode) {
  document.getElementById("authModal").style.display = "flex";
  switchTab(mode);
}
// ĐÓNG BẢNG
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// CHUYỂN ĐỔI ĐĂNG NHẬP / ĐĂNG KÝ
function switchTab(mode) {
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");

  if (mode === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");

    formLogin.classList.add("active");
    formRegister.classList.remove("active");
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");

    formRegister.classList.add("active");
    formLogin.classList.remove("active");
  }
}

// XỬ LÝ ĐĂNG NHẬP
function handleLogin(event) {
  event.preventDefault();
  const phone = document.getElementById("loginUser").value;
  loginUser(phone);
  closeModal("authModal");
  alert("Đăng nhập thành công!");
}

// XỬ LÝ ĐĂNG KÝ
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("regName").value;
  loginUser(name);
  closeModal("authModal");
  alert("Đăng ký thành công!");
}

// HIỆN AVATAR SAU KHI ĐĂNG NHẬP
function loginUser(username) {
  const authArea = document.getElementById("navAuthArea");
  authArea.innerHTML = `
                <div class="user-profile">
                    <div class="user-info">
                        <div class="user-avatar" onclick="toggleLogout()">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <span>${username}</span>
                    </div>
                    <span id="logoutText" class="logout-text" onclick="logoutUser()">
                        Đăng xuất
                    </span>
                </div>
            `;
}

// BẤM AVATAR → HIỆN / ẨN ĐĂNG XUẤT
function toggleLogout() {
  const logoutText = document.getElementById("logoutText");
  logoutText.style.display =
    logoutText.style.display === "block" ? "none" : "block";
}

// ĐĂNG XUẤT
function logoutUser() {
  const authArea = document.getElementById("navAuthArea");
  authArea.innerHTML = `
                <a class="btn-auth-header" onclick="openAuthModal('login')">
                    Đăng nhập / Đăng ký
                </a>
            `;
  alert("Đã đăng xuất!");
}

