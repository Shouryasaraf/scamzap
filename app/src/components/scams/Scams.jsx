"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flag } from "lucide-react";
import API from "../../utils/api";
import Loader from "../loader/Loader";

export default function ScamFeed() {
  const [scams, setScams] = useState([]);
  const [filteredScams, setFilteredScams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/scams`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load scams");
        return res.json();
      })
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setScams(sorted);
        setFilteredScams(sorted);

        const uniqueCategories = Array.from(
          new Set(sorted.map((s) => s.category))
        );
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredScams(scams);
    } else {
      const filtered = scams.filter(
        (scam) => scam.category === selectedCategory
      );
      setFilteredScams(filtered);
    }
  }, [selectedCategory, scams]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] relative">
      <Link href="/report">
        <button
          className="fixed bottom-20 sm:bottom-6 right-4 z-50 p-2 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          title="Report a Scam"
        >
          <Flag className="w-5 h-5" />
        </button>
      </Link>

      <div className="flex-1 w-full max-w-screen-sm mx-auto p-4 mt-4 space-y-6">
        <div className="mb-4 px-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {" "}
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white"
                  : "border-[var(--input)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full border text-sm capitalize ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "border-[var(--input)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center mt-10">
            <Loader />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center mt-4">Error: {error}</p>
        )}

        {!loading && !error && filteredScams.length === 0 && (
          <p className="text-center text-gray-500">
            No scams in this category yet.
          </p>
        )}

        {!loading &&
          !error &&
          filteredScams.map((scam) => (
            <div
              key={scam.id}
              className="p-4 border border-[var(--input)] rounded-xl shadow-md  bg-gray-800 hover:shadow-md hover:bg-gray-700 "
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {scam.title}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                {scam.description}
              </p>
              <p className="mt-2 text-sm">
                <strong>Category:</strong> {scam.category}
              </p>
              <p className="text-sm mt-1">
                Submitted by:{" "}
                {scam.submittedBy ? (
                  <Link
                    href={`/search/${scam.submittedBy}`}
                    className="text-blue-600 hover:underline"
                  >
                    This user
                  </Link>
                ) : (
                  "Unknown user"
                )}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Reported on:{" "}
                {new Date(scam.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
