import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import "./assets/css/ProfilePage.css";
import defaultProfilePic from './assets/image/profile.jpg'; // Default profile picture

const ProfilePage = () => {
  // Refs
  const fileInputRef = useRef(null);
  
  // Form data states
  const [profileData, setProfileData] = useState({
    firstName: "Aarogya",
    lastName: "Thapa",
    email: "aarogyathapa375@example.com",
    phone: "+977 976844821",
    address: "Lalitpur",
    city: "Lalitpur",
    state: "",
    zipCode: "10001",
    country: "Nepal",
    bio: "I am a passionate gamer who enjoys adventure and strategy games.",
    birthDate: "2005-05-01",
    profilePicture: defaultProfilePic
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Various UI states
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    productUpdates: true,
    promotions: false,
    securityAlerts: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Handle profile pic change
  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          profilePicture: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Handle notification toggles
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: checked
    });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // If we're turning off editing, clear any success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!profileData.firstName) errors.firstName = "First name is required";
    if (!profileData.lastName) errors.lastName = "Last name is required";
    if (!profileData.email) errors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(profileData.email)) errors.email = "Invalid email format";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // In a real app, you would save to backend here
    console.log("Saving profile data:", profileData);
    
    // Show success message
    setSaveSuccess(true);
    
    // Exit edit mode
    setIsEditing(false);
    
    // Clear success message after delay
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Save password changes
  const handleSavePassword = (e) => {
    e.preventDefault();
    
    // Validate passwords
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) errors.newPassword = "New password is required";
    if (passwordData.newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
    if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // In a real app, you would verify and update password here
    console.log("Saving new password");
    
    // Show success message
    setPasswordSuccess(true);
    
    // Clear form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    
    // Clear success message after delay
    setTimeout(() => {
      setPasswordSuccess(false);
    }, 3000);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-sidebar">
        <div className="profile-picture-container">
          <img 
            src={profileData.profilePicture} 
            alt="Profile" 
            className="profile-picture"
            onClick={handleProfilePictureClick} 
          />
          <div className="profile-picture-overlay">
            <i className="fas fa-camera"></i>
            <span>Change</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
        
        <h2 className="profile-name">{profileData.firstName} {profileData.lastName}</h2>
        <p className="profile-email">{profileData.email}</p>
        
        <div className="profile-menu">
          <button 
            className={`menu-item ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <i className="fas fa-user"></i> General Information
          </button>
          <button 
            className={`menu-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <i className="fas fa-lock"></i> Security Settings
          </button>
          <button 
            className={`menu-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <i className="fas fa-bell"></i> Notifications
          </button>
          <button 
            className={`menu-item ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <i className="fas fa-credit-card"></i> Payment Methods
          </button>
          <Link to="/" className="menu-item">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
      
      <div className="profile-content">
        {saveSuccess && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> Profile updated successfully!
          </div>
        )}
        
        {activeTab === "general" && (
          <div className="profile-section">
            <div className="section-header">
              <h2>General Information</h2>
              <button 
                className={`edit-button ${isEditing ? "save" : ""}`}
                onClick={isEditing ? handleSaveProfile : toggleEdit}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
              {isEditing && (
                <button className="cancel-button" onClick={toggleEdit}>
                  Cancel
                </button>
              )}
            </div>
            
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  {formErrors.firstName && <span className="error">{formErrors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  {formErrors.lastName && <span className="error">{formErrors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  {formErrors.email && <span className="error">{formErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <input 
                    type="text" 
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input 
                    type="text" 
                    id="state"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP/Postal Code</label>
                  <input 
                    type="text" 
                    id="zipCode"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input 
                    type="text" 
                    id="country"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthDate">Date of Birth</label>
                  <input 
                    type="date" 
                    id="birthDate"
                    name="birthDate"
                    value={profileData.birthDate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === "security" && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Security Settings</h2>
            </div>
            
            {passwordSuccess && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i> Password updated successfully!
              </div>
            )}
            
            <div className="password-section">
              <h3>Change Password</h3>
              <form className="profile-form" onSubmit={handleSavePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  {formErrors.currentPassword && <span className="error">{formErrors.currentPassword}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  {formErrors.newPassword && <span className="error">{formErrors.newPassword}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {formErrors.confirmPassword && <span className="error">{formErrors.confirmPassword}</span>}
                </div>
                
                <button type="submit" className="password-button">Update Password</button>
              </form>
            </div>
          </div>
        )}
        
        {activeTab === "notifications" && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Notification Preferences</h2>
            </div>
            
            <div className="notification-options">
              <div className="notification-item">
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive important updates via email</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="emailNotifications"
                    checked={notifications.emailNotifications}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Product Updates</h4>
                  <p>Get notified about new games and features</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="productUpdates"
                    checked={notifications.productUpdates}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Promotions and Discounts</h4>
                  <p>Receive offers, discounts and promotional emails</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="promotions"
                    checked={notifications.promotions}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div>
                  <h4>Security Alerts</h4>
                  <p>Get notified about security-related account activities</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="securityAlerts"
                    checked={notifications.securityAlerts}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "payments" && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Payment Methods</h2>
              <button className="add-payment-button">
                <i className="fas fa-plus"></i> Add New Method
              </button>
            </div>
            
            <div className="payment-methods">
              <div className="payment-card">
                <div className="card-info">
                  <div className="card-type visa">
                    <i className="fab fa-cc-visa"></i>
                  </div>
                  <div className="card-details">
                    <h4>Visa ending in 4242</h4>
                    <p>Expires 12/2025</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="card-action edit">Edit</button>
                  <button className="card-action delete">Remove</button>
                </div>
              </div>
              
              <div className="payment-card">
                <div className="card-info">
                  <div className="card-type mastercard">
                    <i className="fab fa-cc-mastercard"></i>
                  </div>
                  <div className="card-details">
                    <h4>Mastercard ending in 8888</h4>
                    <p>Expires 09/2024</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="card-action edit">Edit</button>
                  <button className="card-action delete">Remove</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;