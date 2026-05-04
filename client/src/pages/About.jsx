export default function About() {
  const BASE_URL = "http://localhost:5000";

  return (
    <div className="grid grid-cols-2 gap-10 items-center p-10">

      {/* LEFT CONTENT */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Our Story</h1>

        <p className="text-gray-600 leading-7">
          Exclusive is a modern and user-friendly e-commerce platform developed using React and Node.js.
          It provides a seamless online shopping experience where users can explore products,
          add items to their cart, and place orders efficiently.

          <br /><br />

          The platform includes authentication, product browsing, shopping cart,
          secure checkout, and order tracking — just like real-world platforms
          such as Flipkart and Amazon.

          <br /><br />

          Built with a focus on performance and security, Exclusive ensures that users can shop with confidence.
          With a clean UI, responsive design, and scalable architecture,
          Exclusive is built to deliver both performance and user satisfaction.
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div>
        <img
          src={`${BASE_URL}/images/about.png`}
          alt="About"
          className="w-full rounded-lg shadow-md object-cover"
        />
      </div>

    </div>
  );
}