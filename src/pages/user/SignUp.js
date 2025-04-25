import React, { useState } from "react";
import axios from "axios"; // Thư viện dùng để gửi yêu cầu HTTP

const SignUp = () => {
  // State để quản lý dữ liệu form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("seller"); // Default role là seller
  const [image, setImage] = useState(""); // Để tải ảnh

  // Hàm để xử lý form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Tạo một đối tượng người dùng từ các giá trị trong form
    const newUser = {
      email,
      password,
      fullname,
      address: {
        street,
        zipcode,
        city,
        country,
      },
      role,
      image: "/assets/images/guestava.jpg", // Đặt ảnh mặc định cho người dùng
      action: "unlock",
    };

    // Gửi yêu cầu POST đến API để đăng ký người dùng
    axios
      .post("http://localhost:3000/users", newUser) // Cập nhật endpoint phù hợp với API của bạn
      .then((response) => {
        console.log("User registered successfully:", response.data);
        // Thực hiện điều hướng hoặc thông báo đăng ký thành công
      })
      .catch((error) => {
        console.error("There was an error registering the user!", error);
      });
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Street:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Zipcode:</label>
          <input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
