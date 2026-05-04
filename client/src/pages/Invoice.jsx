import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return (
      <div className="p-10">
        <h2>No Invoice Data Found ❌</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const items = order.items || order.products || [];

  // 📥 DOWNLOAD PDF
  const downloadPDF = async () => {
    const input = document.getElementById("invoice");

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`Invoice_${order._id}.pdf`);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <div
        id="invoice"
        className="bg-white p-6 rounded shadow max-w-3xl mx-auto"
      >

        <h1 className="text-2xl font-bold mb-4">🧾 Invoice</h1>

        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Date:</b> {new Date(order.date).toLocaleString()}</p>

        <hr className="my-4" />

        {/* ITEMS */}
        {items.map((item, i) => (
          <div key={i} className="flex justify-between mb-2">

            <div>
              <p>{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.qty || 1}
              </p>
            </div>

            <p>₹ {item.price}</p>

          </div>
        ))}

        <hr className="my-4" />

        <h2 className="text-xl font-bold text-right">
          Total: ₹ {order.total}
        </h2>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-5 justify-center">

        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>

      </div>

    </div>
  );
}