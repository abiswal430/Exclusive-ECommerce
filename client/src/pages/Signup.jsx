import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const signup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/signup", data);

      alert(res.data || "Account Created Successfully ✅");

      window.location.href = "/login";

    } catch (err) {
      const message = err.response?.data || "Something went wrong ❌";
      alert(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={signup}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          type="text"
          name="Name"
          placeholder="Username"
          value={data.name}
          onChange={handleChange}
          required
          className="border w-full p-2 mb-3 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
          className="border w-full p-2 mb-4 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
        >
          Sign Up
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}