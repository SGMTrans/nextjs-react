"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Ambil token sebelum fetch

    fetch("/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Unauthorized! Please log in.");
          return [];
        }
        return res.json();
      })
      .then((data) => {
        console.log("API response:", data);
        setPosts(data.posts || []);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token"); // Ambil token di sini
        const res = await fetch(`/api/posts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("Unauthorized! Please log in.");
          return;
        }

        setPosts(posts.filter((post) => post.id !== id)); // Hapus dari state
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Posts</h1>
        <Link
          href="/posts/create"
          className="inline-block mb-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300"
        >
          Create Post
        </Link>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-750 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {post.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/posts/${post.id}/edit`)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
