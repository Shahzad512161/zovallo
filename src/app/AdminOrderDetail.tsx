import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { Order } from "../types";
import { orderApi } from "../services/orderApi";

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getById(orderId!);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: Order["orderStatus"]) => {
    if (!order) return;
    setUpdating(true);
    try {
      await orderApi.updateOrderStatus(order.id, newStatus);
      setOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const printInvoice = () => {
    if (!order) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the invoice");
      return;
    }

    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.id.slice(-8).toUpperCase()}</title>
      <style>
        @media print {
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Arial', sans-serif;
          }
          .no-print {
            display: none;
          }
        }
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        .invoice-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #c1a57b;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .logo span {
          color: #c1a57b;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #1a1a1a;
          margin: 20px 0 10px;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 15px;
          background: #f5f5f2;
        }
        .info-box {
          flex: 1;
        }
        .info-box h3 {
          font-size: 12px;
          margin-bottom: 10px;
          color: #8b6b3d;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-box p {
          margin: 5px 0;
          font-size: 12px;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .products-table th {
          background: #f5f5f2;
          padding: 12px;
          text-align: left;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid #e0d6c8;
        }
        .products-table td {
          padding: 12px;
          font-size: 12px;
          border-bottom: 1px solid #e0d6c8;
          vertical-align: top;
        }
        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border: 1px solid #e0d6c8;
        }
        .totals {
          text-align: right;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #c1a57b;
        }
        .totals-row {
          display: flex;
          justify-content: flex-end;
          margin: 8px 0;
        }
        .totals-label {
          font-weight: bold;
          width: 150px;
          text-align: right;
          margin-right: 20px;
        }
        .totals-value {
          width: 120px;
          text-align: right;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          color: #c1a57b;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0d6c8;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          text-align: center;
          font-size: 10px;
          border-top: 1px solid #e0d6c8;
          color: #999;
        }
        @page {
          size: A4;
          margin: 2cm;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="logo">LUXWOOD<span>.</span></div>
          <div class="invoice-title">TAX INVOICE</div>
          <p>Premium Furniture Collection</p>
        </div>

        <div class="order-info">
          <div class="info-box">
            <h3>Order Details</h3>
            <p><strong>Order #:</strong> ${order.id.slice(-8).toUpperCase()}</p>
            <p><strong>Date:</strong> ${order.createdAt?.toDate().toLocaleDateString("en-GB")}</p>
            <p><strong>Status:</strong> ${order.orderStatus.toUpperCase()}</p>
          </div>
          <div class="info-box">
            <h3>Customer Information</h3>
            <p><strong>${order.customerInfo.fullName}</strong></p>
            <p>${order.customerInfo.email}</p>
            <p>${order.customerInfo.phone}</p>
          </div>
          <div class="info-box">
            <h3>Shipping Address</h3>
            <p>${order.customerInfo.address}</p>
            <p>${order.customerInfo.city}, ${order.customerInfo.postalCode}</p>
            <p>${order.customerInfo.country}</p>
          </div>
        </div>

        <table class="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Title</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
              .map(
                (p) => `
              <tr>
                <td><img src="${p.image}" alt="${p.title}" class="product-image" onerror="this.style.display='none'" /></td>
                <td><strong>${p.title}</strong><br/><small>ID: ${p.productId.slice(-8).toUpperCase()}</small></td>
                <td>${p.quantity}</td>
                <td>${formatCurrency(p.price)}</td>
                <td>${formatCurrency(p.price * p.quantity)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span class="totals-label">Subtotal:</span>
            <span class="totals-value">${formatCurrency(order.totalPrice)}</span>
          </div>
          <div class="totals-row">
            <span class="totals-label">Delivery:</span>
            <span class="totals-value">FREE</span>
          </div>
          <div class="totals-row grand-total">
            <span class="totals-label">GRAND TOTAL:</span>
            <span class="totals-value">${formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Payment Method: Cash on Delivery (COD)</p>
          <p>Thank you for shopping with LUXWOOD!</p>
          <p>For any queries, contact us at support@luxwood.com | +44 20 1234 5678</p>
        </div>
      </div>
    </body>
    </html>
  `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
          Accessing Secure Records...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <p className="text-gray-400 font-medium">
          Order not found in our database.
        </p>
        <Link
          to="/admin/orders"
          className="text-gold font-bold uppercase tracking-widest text-[10px] hover:underline"
        >
          Return to Ledger
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-gold/10 text-walnut border-gold/20",
    processing: "bg-near-black/5 text-near-black border-near-black/10",
    shipped: "bg-blue-50 text-blue-600 border-blue-100",
    delivered: "bg-mint-50 text-mint-700 border-mint-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 text-gray-400 hover:text-near-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Back to Ledger
            </span>
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-display text-near-black uppercase tracking-tight">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <span
              className={`px-4 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-[0.15em] ${statusColors[order.orderStatus]}`}
            >
              {order.orderStatus}
            </span>
          </div>
          <div className="flex items-center gap-6 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />{" "}
              {order.createdAt
                ?.toDate()
                .toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />{" "}
              {order.createdAt
                ?.toDate()
                .toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={printInvoice} // Change this line
            className="flex items-center gap-2 px-6 py-3 bg-white border border-warm-beige text-[10px] font-bold uppercase tracking-widest text-near-black hover:bg-cream transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
          <div className="relative group">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-near-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors disabled:opacity-50"
              disabled={updating}
            >
              Update Status {updating && "..."}
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-warm-beige shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {(
                [
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ] as Order["orderStatus"][]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  className="w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-colors disabled:opacity-50"
                  disabled={order.orderStatus === status}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Products Table */}
          <section className="bg-white border border-warm-beige overflow-hidden">
            <div className="px-8 py-6 border-b border-warm-beige flex items-center justify-between bg-cream/30">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Order Contents
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {order.products.length} Items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-warm-beige">
                  {order.products.map((p, idx) => (
                    <tr key={idx}>
                      <td className="px-8 py-6 w-24">
                        <div className="w-16 h-16 bg-cream border border-warm-beige">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-6">
                        <p className="text-sm font-bold text-near-black">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">
                          ID: {p.productId.slice(-8).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Qty
                        </p>
                        <p className="text-sm font-medium mt-1">{p.quantity}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Price
                        </p>
                        <p className="text-sm font-bold mt-1 text-near-black">
                          {formatCurrency(p.price)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-near-black text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    Settlement Total
                  </p>
                  <p className="text-xs text-gray-500 font-medium italic">
                    Includes all applicable duties and carriage fees.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold leading-none">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section className="bg-white border border-warm-beige p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-mint-50 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-mint-700" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-near-black mb-1">
                  Payment Method
                </h3>
                <p className="text-sm font-medium text-gray-600">
                  Cash on Delivery (COD)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-mint-700 bg-mint-50 px-4 py-2 border border-mint-100">
              <CheckCircle className="w-3.5 h-3.5" /> Transaction Verified
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Customer Intelligence */}
          <section className="bg-white border border-warm-beige">
            <div className="px-8 py-6 border-b border-warm-beige bg-cream/30">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Customer Profile
              </h2>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center rounded-full text-lg font-display font-bold">
                  {order.customerInfo.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-near-black">
                    {order.customerInfo.fullName}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">
                    UID: {order.userId.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-4 h-4 text-walnut mt-0.5" />
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Comms Endpoint
                    </p>
                    <p className="text-xs font-bold text-near-black">
                      {order.customerInfo.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-4 h-4 text-walnut mt-0.5" />
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Contact Line
                    </p>
                    <p className="text-xs font-bold text-near-black">
                      {order.customerInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Coordinates */}
          <section className="bg-white border border-warm-beige">
            <div className="px-8 py-6 border-b border-warm-beige bg-cream/30">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-near-black">
                Shipping Coordinates
              </h2>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-walnut mt-0.5" />
                <div className="space-y-4">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Physical Address
                    </p>
                    <p className="text-xs font-bold text-near-black leading-relaxed">
                      {order.customerInfo.address}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">
                      {order.customerInfo.city}, {order.customerInfo.postalCode}
                    </p>
                    <p className="text-xs font-medium text-gold mt-0.5 uppercase tracking-widest">
                      {order.customerInfo.country}
                    </p>
                  </div>
                  {order.customerInfo.notes && (
                    <div className="p-4 bg-gold/5 border border-gold/10 italic">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-walnut mb-2">
                        Delivery Directives
                      </p>
                      <p className="text-[11px] text-walnut leading-relaxed">
                        "{order.customerInfo.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-warm-beige space-y-4">
                <div className="flex items-center gap-4">
                  <Truck className="w-4 h-4 text-walnut" />
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Fulfillment Mode
                    </p>
                    <p className="text-xs font-bold text-near-black uppercase tracking-widest">
                      Standard Carrier
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Package className="w-4 h-4 text-walnut" />
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Packaging Status
                    </p>
                    <p className="text-xs font-bold text-near-black uppercase tracking-widest">
                      Ready for Despatch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
