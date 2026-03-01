import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FiSearch, FiTarget, FiX } from 'react-icons/fi';
import './location.css'; // Make sure to create this CSS file

const LocationModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered className="zepto-location-modal">
      <div className="modal-content-wrapper">
        <div className="modal-header-custom">
          <h5 className="modal-title-text">Your Location</h5>
          <FiX className="close-btn" onClick={onHide} />
        </div>

        <div className="modal-body-custom">
          {/* Search Bar */}
          <div className="search-box-modal">
            <FiSearch className="search-icon-gray" />
            <input type="text" placeholder="Search a new address" />
          </div>

          {/* Location Action Box */}
          <div className="current-location-card">
            <div className="location-icon-circle">
              <FiTarget size={20} />
            </div>
            <div className="location-info">
              <div className="location-title-pink">Use My Current Location</div>
              <div className="location-subtitle">Enable your current location for better services</div>
            </div>
            <button className="enable-btn">Enable</button>
          </div>

          {/* Bottom Illustration */}
          <div className="illustration-container">
            <img 
              src="https://cdn.zeptonow.com/app/images/location_permission_off.png?tr=w-undefined,q-40" 
              alt="Location Illustration" 
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;