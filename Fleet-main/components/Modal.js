// components/Modal.js
"use client";
import { Dialog } from "@headlessui/react"; // optional: if not using headlessui, keep your existing Dialog component
import { Fragment } from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="bg-white rounded-lg z-10 p-6 w-full max-w-2xl shadow">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
