"use client";

export default function DeleteButton({ message }: { message: string }) {
  return (
    <button
      type="submit"
      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      Sil
    </button>
  );
}
