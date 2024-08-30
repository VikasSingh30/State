import React, { useState, useEffect } from 'react';

const XState = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: ''
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://crio-location-selector.onrender.com/countries');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${formData.country}/states`);
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    if (!!formData.country) {
      fetchStates();
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${formData.country}/state=${formData.state}/cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    if (!!formData.state) {
      fetchCities();
      setFormData((data) => ({ ...data, city: '' }));
    }
  }, [formData.state, formData.country]);

  const handleCountryChange = (e) => {
    setFormData({ ...formData, country: e.target.value, state: '', city: '' });
  };

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value, city: '' });
  };

  const handleCityChange = (e) => {
    setFormData({ ...formData, city: e.target.value });
  };

  return (
    <div className='app-container'>
      <h1>Select Location</h1>
      <div className='dropdown-container'>
        <div className='dropdown'>
          <select value={formData.country} onChange={handleCountryChange}>
            <option value=''>--Select Country--</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div className='dropdown'>
          <select value={formData.state} onChange={handleStateChange} disabled={!formData.country}>
            <option value=''>--Select State--</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className='dropdown'>
          <select value={formData.city} onChange={handleCityChange} disabled={!formData.state}>
            <option value=''>--Select City--</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {formData.country && formData.state && formData.city && (
        <div>
          <p style={{ fontSize: '20px' }}>
            <span style={{ fontWeight: 'bold' }}>You selected </span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'black' }}>{formData.city},</span>
            <span style={{ fontWeight: '600', color: 'grey' }}> {formData.state}, {formData.country}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default XState;