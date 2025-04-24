import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';

import Navbar from './Navbar';
import './assets/css/OrderHistoryPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = () => {
      setIsLoading(true);
      try {
        const libraryGamesJSON = localStorage.getItem('libraryGames');
        const libraryGames = libraryGamesJSON ? JSON.parse(libraryGamesJSON) : [];

        let orderHistoryJSON = localStorage.getItem('orderHistory');
        let orderHistory = orderHistoryJSON ? JSON.parse(orderHistoryJSON) : [];

        const orderMap = {};
        const paymentMap = {};
        const monthlyMap = {};

        libraryGames.forEach(game => {
          if (game.orderNumber) {
            if (!orderMap[game.orderNumber]) {
              const existingOrder = orderHistory.find(order => order.orderNumber === game.orderNumber);

              const newOrder = {
                orderNumber: game.orderNumber,
                purchaseDate: game.purchaseDate,
                total: game.price || '0',
                paymentMethod: game.paymentMethod || 'unknown'
              };

              orderMap[game.orderNumber] = {
                orderNumber: game.orderNumber,
                purchaseDate: game.purchaseDate,
                items: [game],
                total: existingOrder?.total || newOrder.total,
                paymentMethod: existingOrder?.paymentMethod || newOrder.paymentMethod
              };

              if (!existingOrder) {
                orderHistory.push(newOrder);
              }
            } else {
              orderMap[game.orderNumber].items.push(game);
            }
          }
        });

        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

        const ordersArray = Object.values(orderMap).sort(
          (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );
        setOrders(ordersArray);

        // Prepare chart data
        ordersArray.forEach(order => {
          const method = order.paymentMethod || 'Unknown';
          const total = parseFloat(order.total || 0) * 1.12;

          // Pie chart (payment method)
          paymentMap[method] = (paymentMap[method] || 0) + 1;

          // Bar chart (monthly sales)
          const date = new Date(order.purchaseDate);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyMap[key] = (monthlyMap[key] || 0) + total;
        });

        const formattedPayment = Object.entries(paymentMap).map(([name, value]) => ({
          name: formatPaymentMethod(name),
          value
        }));

        const formattedMonthly = Object.entries(monthlyMap)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([month, total]) => ({
            month,
            total: parseFloat(total.toFixed(2))
          }));

        setPaymentData(formattedPayment);
        setMonthlySalesData(formattedMonthly);

      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPaymentMethod = (method) => {
    if (!method) return 'N/A';
    if (method === 'esewa') return 'eSewa';
    if (method === 'khalti') return 'Khalti';
    if (method === 'ebanking') return 'E-Banking';
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  return (
    <div className="order-history-container">
      <Navbar />

      <div className="order-history-content">
        <div className="order-history-header">
          <h1>Order History</h1>
          <p>View all your past purchases and order details</p>
        </div>

        {/* Charts */}
        {!isLoading && orders.length > 0 && (
          <div className="charts-section">
            <div className="chart-card">
              <h2>Payment Method Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>Monthly Sales</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#82ca9d" name="Sales (Rs)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="loading-indicator">Loading your order history...</div>
        ) : orders.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📋</div>
            <h2>No Order History Found</h2>
            <p>You haven't made any purchases yet.</p>
            <button className="shop-now-btn" onClick={() => navigate('/')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div key={index} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h2>Order #{order.orderNumber}</h2>
                    <p className="order-date">Placed on {formatDate(order.purchaseDate)}</p>
                  </div>
                  <div className="order-status">
                    <span className="status-badge completed">Completed</span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">{formatPaymentMethod(order.paymentMethod)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Amount:</span>
                    <span className="detail-value">
                      Rs {order.total !== 'N/A' ? (parseFloat(order.total) * 1.12).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="purchased-games">
                  <h3>Items Purchased</h3>
                  <div className="games-grid">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="game-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100x130?text=Game";
                          }}
                        />
                        <div className="game-details">
                          <div className="game-name">{item.name}</div>
                          <div className="game-key">
                            <span className="key-label">Game Key:</span>
                            <span className="key-value">{item.key}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="view-details-btn"
                    onClick={() =>
                      navigate(`/order/${order.orderNumber}`, {
                        state: {
                          orderNumber: order.orderNumber,
                          total: order.total,
                          paymentMethod: order.paymentMethod,
                          items: order.items,
                          purchaseDate: order.purchaseDate
                        }
                      })
                    }
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
