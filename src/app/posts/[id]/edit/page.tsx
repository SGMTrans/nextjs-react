"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      alert("Unauthorized: Please log in first.");
      router.push("/login");
      return;
    }
    setToken(savedToken);

    fetch(`/api/posts/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Unauthorized: Invalid token.");
          router.push("/login");
        }
        return res.json();
      })
      .then((data) => {
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setTitle(data.posts[0].title || "");
          setContent(data.posts[0].content || "");
          setImage(data.posts[0].image || "");
        } else {
          console.error("Unexpected data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Unauthorized: Missing token.");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.status === 401) {
        alert("Unauthorized: Invalid token.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      router.push(`/`);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="image"
              placeholder="Enter post url image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              placeholder="Write your post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={6}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
}
