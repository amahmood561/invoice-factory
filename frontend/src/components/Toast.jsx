import React from "react";

export default function Toast({ message, type }) {
  if (!message) return null;
  const color = type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow ${color}`}>
      {message}
    </div>
  );
}
