"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post))
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`/api/posts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        router.push("/"); // Redirect ke homepage setelah menghapus
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-300 mb-6">By {post.user.name}</p>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-300">{post.content}</p>
        </div>

        {/* Tombol Edit dan Delete */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => router.push(`/posts/${id}/edit`)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
}
