export default function Contact() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <input placeholder="Your Name" className="input" />
      <input placeholder="Email" className="input" />
      <textarea placeholder="Message" className="input"></textarea>

      <button className="bg-black text-white px-4 py-2 mt-3">
        Send
      </button>
    </div>
  );
}