import React, { useState } from "react";
import axios from "axios";

const defaultItem = { description: "", quantity: 1, price: 0 };

export default function InvoiceForm() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [client, setClient] = useState({ name: "", email: "", address: "" });
  const [items, setItems] = useState([ { ...defaultItem } ]);
  const [logo, setLogo] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleItemChange = (idx, field, value) => {
    const newItems = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { ...defaultItem }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("invoiceNumber", invoiceNumber);
      formData.append("date", date);
      formData.append("client", JSON.stringify(client));
      formData.append("items", JSON.stringify(items));
      formData.append("notes", notes);
      if (logo) formData.append("logo", logo);
      const res = await axios.post("http://localhost:8080/generate-invoice", formData, {
        responseType: "blob",
      });
      if (res.status === 404) {
        setError("Endpoint not found. Is the backend running?");
        return;
      }
      if (res.headers["content-type"] === "application/pdf" || res.data.type === "application/pdf") {
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${invoiceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        setSuccess("Invoice PDF downloaded!");
      } else {
        setError("No PDF received. Check backend response.");
      }
    } catch (err) {
      setError("Failed to generate invoice PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-3xl mx-auto bg-white p-8 rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block font-semibold mb-1">Invoice Number</label>
          <input type="text" className="input" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Client Name</label>
          <input type="text" className="input" value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Client Email</label>
          <input type="email" className="input" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} required />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Client Address</label>
          <textarea className="input" value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} required />
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Logo Upload</label>
        <input type="file" accept="image/*" onChange={handleLogoChange} />
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Line Items</label>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input type="text" className="input flex-1" placeholder="Description" value={item.description} onChange={e => handleItemChange(idx, "description", e.target.value)} required />
              <input type="number" className="input w-20" min={1} value={item.quantity} onChange={e => handleItemChange(idx, "quantity", e.target.value)} required />
              <input type="number" className="input w-24" min={0} step={0.01} value={item.price} onChange={e => handleItemChange(idx, "price", e.target.value)} required />
              <button type="button" className="text-red-500" onClick={() => removeItem(idx)} disabled={items.length === 1}>✕</button>
            </div>
          ))}
          <button type="button" className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={addItem}>+ Add Item</button>
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Notes</label>
        <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded" disabled={loading}>Generate PDF</button>
        {loading && <span className="text-gray-500">Generating...</span>}
        {error && <span className="text-red-500">{error}</span>}
        {success && <span className="text-green-500">{success}</span>}
      </div>
    </form>
  );
}
