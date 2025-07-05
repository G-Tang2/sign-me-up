export default function Button({ text }: { text: string }) {
  return (
    <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      {text}
    </button>
  );
}
