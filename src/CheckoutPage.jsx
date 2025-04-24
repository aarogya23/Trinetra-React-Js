import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './assets/css/CheckoutPage.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (savedCart.length === 0) {
          // Redirect to cart page if cart is empty
          navigate('/cart');
          return;
        }
        setCartItems(savedCart);
      } catch (error) {
        console.error("Error loading cart data:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [navigate]);

  // Calculate total price of all items in cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.price === "Free" || item.price === "Free to Play") {
        return total;
      }
      // Remove currency symbol and convert to number
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Only validate email or phone
    if (formData.email && !formData.phone) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    } else if (formData.phone && !formData.email) {
      if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    } else if (!formData.email && !formData.phone) {
      newErrors.email = 'Email or phone number is required';
      newErrors.phone = 'Email or phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Process payment
      processPayment();
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Process payment (mock implementation)
  const processPayment = () => {
    // Show loading state
    setLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Clear cart after successful payment
      localStorage.removeItem('cart');
      
      // Navigate to success page
      navigate('/order-success', { 
        state: { 
          orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          total: calculateTotal(),
          paymentMethod: paymentMethod,
          items: cartItems
        } 
      });
    }, 1500);
  };

  if (loading) {
    return <div className="loading">Processing your order...</div>;
  }

  return (
    <div className="checkout-page-container">
      <Navbar />
      
      <div className="checkout-content">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-layout">
          {/* Order Summary Section */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map((item, index) => {
                const priceValue = item.price === "Free" || item.price === "Free to Play" 
                  ? 0 
                  : parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                const subtotal = (priceValue * item.quantity).toFixed(2);
                const currencySymbol = item.price.replace(/[0-9.-]+/g, "").trim();
                
                return (
                  <div key={index} className="order-item">
                    <div className="order-item-info">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="order-item-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/60x80?text=Game";
                        }}
                      />
                      <div>
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-quantity">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="order-item-price">{currencySymbol}{subtotal}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="order-totals">
              <div className="order-total-row">
                <span>Subtotal:</span>
                <span>Rs {calculateTotal()}</span>
              </div>
              <div className="order-total-row">
                <span>Tax:</span>
                <span>Rs {(parseFloat(calculateTotal()) * 0.12).toFixed(2)}</span>
              </div>
              <div className="order-total-row grand-total">
                <span>Total:</span>
                <span>Rs {(parseFloat(calculateTotal()) * 1.12).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              className="back-to-cart-btn"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>
          </div>
          
          {/* Payment Form Section */}
          <div className="payment-form-section">
            <h2>Complete Your Purchase</h2>
            
            <form onSubmit={handleSubmit} className="payment-form">
              {/* Basic Information */}
              <div className="form-section">
                <h3>Contact Information</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'input-error' : ''}
                    placeholder="Enter email address"
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                
                <div className="contact-separator">OR</div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit number"
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>
              
              {/* Payment Method Selection */}
              <div className="form-section">
                <h3>Payment Method</h3>
                
                <div className="payment-methods">
                  <div 
                    className={`payment-method ${paymentMethod === 'esewa' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('esewa')}
                  >
                    <div className="payment-method-radio">
                      <div className={`radio-inner ${paymentMethod === 'esewa' ? 'selected' : ''}`}></div>
                    </div>
                    <div className="payment-method-icon">
                      <div className="payment-logo esewa-logo">eSewa</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`payment-method ${paymentMethod === 'khalti' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('khalti')}
                  >
                    <div className="payment-method-radio">
                      <div className={`radio-inner ${paymentMethod === 'khalti' ? 'selected' : ''}`}></div>
                    </div>
                    <div className="payment-method-icon">
                      <div className="payment-logo khalti-logo">Khalti</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`payment-method ${paymentMethod === 'ebanking' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('ebanking')}
                  >
                    <div className="payment-method-radio">
                      <div className={`radio-inner ${paymentMethod === 'ebanking' ? 'selected' : ''}`}></div>
                    </div>
                    <div className="payment-method-icon">
                      <div className="payment-logo ebanking-logo">E-Banking</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* eSewa Details */}
              {paymentMethod === 'esewa' && (
                <div className="payment-info-section">
                  <p className="payment-info-text">You will be redirected to eSewa to complete your payment securely.</p>
                  <div className="payment-instruction">
                    <p>1. Click "Pay Now" below</p>
                    <p>2. Log in to your eSewa account</p>
                    <p>3. Confirm payment details</p>
                    <p>4. Complete the transaction</p>
                  </div>
                </div>
              )}
              
              {/* Khalti Details */}
              {paymentMethod === 'khalti' && (
                <div className="payment-info-section">
                  <p className="payment-info-text">You will be redirected to Khalti to complete your payment securely.</p>
                  <div className="payment-instruction">
                    <p>1. Click "Pay Now" below</p>
                    <p>2. Log in to your Khalti account</p>
                    <p>3. Confirm payment details</p>
                    <p>4. Complete the transaction</p>
                  </div>
                </div>
              )}
              
              {/* E-Banking Details */}
              {paymentMethod === 'ebanking' && (
                <div className="payment-info-section">
                  <div className="form-group">
                    <label htmlFor="bank">Select Bank</label>
                    <select 
                      id="bank" 
                      name="bank" 
                      value={formData.bank || ''}
                      onChange={handleInputChange}
                      className={errors.bank ? 'input-error' : ''}
                    >
                      <option value="">Select a bank</option>
                      <option value="global">Global IME Bank</option>
                      <option value="nabil">Nabil Bank</option>
                      <option value="nic">NIC Asia Bank</option>
                      <option value="prabhu">Prabhu Bank</option>
                      <option value="nmb">NMB Bank</option>
                    </select>
                    {errors.bank && <div className="error-message">{errors.bank}</div>}
                  </div>
                  <p className="payment-info-text">You will be redirected to your bank's secure payment portal.</p>
                </div>
              )}
              
              {/* Submit Button */}
              <button type="submit" className="pay-now-btn">
                Pay Now - Rs {(parseFloat(calculateTotal()) * 1.12).toFixed(2)}
              </button>
              
              <div className="secure-payment-notice">
                <span className="secure-icon">🔒</span> 100% secure payment
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;