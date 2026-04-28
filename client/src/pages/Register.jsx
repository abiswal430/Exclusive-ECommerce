import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!data.username || !data.password) {
      alert("Please fill all fields ❌");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/signup",
        data
      );

      // ✅ SUCCESS
      alert("Registration Successful ✅");
      navigate("/login");

    } catch (err) {
      const message = err.response?.data;

      // ✅ HANDLE USER ALREADY EXISTS
      if (message === "User already exists") {
        alert("User already exists! Redirecting to Login 🔁");

        setTimeout(() => {
          navigate("/login");
        }, 1000); // smooth redirect
      } else {
        alert(message || "Error creating account ❌");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        {/* USERNAME */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          required
          className="border w-full p-2 mb-3 rounded"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
          className="border w-full p-2 mb-4 rounded"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}