// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext" // Điều chỉnh đường dẫn nếu cần

const Login = () => {
  const { setUser } = useUser(); // Lấy hàm setUser từ context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Gọi API để lấy danh sách người dùng từ endpoint
      const response = await fetch("http://localhost:9999/user");
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const users = await response.json();

      // Tìm người dùng có email và mật khẩu khớp
      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!foundUser) {
        setErrorMsg("Email hoặc mật khẩu không đúng!");
        return;
      }

      // Kiểm tra trạng thái tài khoản
      if (foundUser.action === "lock") {
        setErrorMsg("Tài khoản của bạn đã bị khóa!");
        return;
      }

      // Lưu thông tin user vào Context và localStorage
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));

      // Chuyển hướng dựa theo role của người dùng
      if (foundUser.role === "seller") {
        navigate("/");
      } else {
        setErrorMsg("Bạn không có quyền truy cập!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };


  // Hàm đăng nhập tự động với thông tin mặc định của seller
  const handleLoginAsSeller = async () => {
    // Thay đổi thông tin mặc định theo dữ liệu có trong hệ thống của bạn
    const sellerEmail = "user3@gmail.com";
    const sellerPassword = "123123";
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:9999/user");
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const users = await response.json();

      // Tìm kiếm người dùng với thông tin seller mặc định
      const foundUser = users.find(
        (user) => user.email === sellerEmail && user.password === sellerPassword
      );

      if (!foundUser) {
        setErrorMsg("Seller user không tồn tại!");
        return;
      }

      if (foundUser.action === "lock") {
        setErrorMsg("Tài khoản của Seller đã bị khóa!");
        return;
      }

      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));

      if (foundUser.role === "seller") {
        navigate("/");
      } else {
        setErrorMsg("Bạn không có quyền truy cập!");
      }
    } catch (error) {
      console.error("Error during login as seller:", error);
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Đăng nhập</h2>
      {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Nhập email của bạn"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            placeholder="Nhập mật khẩu của bạn"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Đăng nhập
        </button>
      </form>
      <hr style={{ margin: "20px 0" }} />
      <button onClick={handleLoginAsSeller} style={styles.button}>
        Login as Seller
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer"
  },
  error: {
    color: "red"
  }
};

export default Login;
