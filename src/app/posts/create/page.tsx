"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Ambil token dari localStorage

    if (!token) {
      console.error("No token found");
      return;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Kirim token di header
      },
      body: JSON.stringify({ title, content, image }),
    });

    const data = await res.json();
    console.log("Response:", data);

    if (res.ok) {
      router.push("/");
    } else {
      console.error("Error creating post:", data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Create Post</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {image && (
          <div className="flex justify-center mb-4">
            <img
              src={image}
              alt="Preview"
              className="max-w-full h-32 rounded-lg shadow-md"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
