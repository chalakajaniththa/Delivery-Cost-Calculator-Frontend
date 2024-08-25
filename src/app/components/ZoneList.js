'use client';

import { useEffect, useState } from 'react';

const ZoneList = () => {
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [suburbInput, setSuburbInput] = useState('');
  const [filteredSuburbs, setFilteredSuburbs] = useState([]);
  const [stateInput, setStateInput] = useState('');
  const [isStateLocked, setIsStateLocked] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
        const data = await response.json();
        setZones(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchZones();
  }, []);

  const handleZoneChange = (e) => {
    const selectedId = e.target.value;
    setSelectedZoneId(selectedId);

    // Find the selected zone and update cities
    const selectedZone = zones.find(zone => zone._id === selectedId);
    if (selectedZone) {
      setCities(selectedZone.cities);
    } else {
      setCities([]);
      setSelectedCity(null);
      setFilteredSuburbs([]);
    }
  };

  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;
    const city = cities.find(city => city.name === selectedCityName);
    setSelectedCity(city);
    setFilteredSuburbs([]);
    setSuburbInput('');
    setStateInput('');
    setIsStateLocked(false);
  };

  const handleSuburbInputChange = (e) => {
    const input = e.target.value;
    setSuburbInput(input);

    if (selectedCity) {
      const matchingSuburbs = selectedCity.suburbs.filter(suburb =>
        suburb.name.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuburbs(matchingSuburbs);

      if (matchingSuburbs.length === 1 && matchingSuburbs[0].name.toLowerCase() === input.toLowerCase()) {
        // Auto-fill and lock the state if a matching suburb is found
        setStateInput(matchingSuburbs[0].state);
        setIsStateLocked(true);
      } else {
        // Allow manual input if no exact match
        setStateInput('');
        setIsStateLocked(false);
      }
    }
  };

  return (
    <div className="bg-gray-100 p-10">
        <form action="/submit-data" method="POST" className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">State Information</h2>
            <label htmlFor="stateName" className="block mb-2 font-semibold">State Name:</label>
            <select id="stateName" name="stateName" required className="border border-gray-300 p-2 w-full mb-4 rounded" onChange={handleZoneChange} value={selectedZoneId}>
                <option value="">Select a State</option>
                {zones.map((zone) => (
                    <option key={zone._id} value={zone._id}>{zone.name}</option>
                ))}
            </select>
            <h2 className="text-xl font-bold mb-4">City Information</h2>
            <div id="cityContainer">
                <div className="city border p-4 mb-4 rounded random-bg">
                    <label htmlFor="cityName" className="block mb-2 font-semibold">City Name:</label>
                    <select id="cityName" name="cityName" required className="border border-gray-300 p-2 w-full mb-4 rounded" onChange={handleCityChange}>
                        <option value="">Select a City</option>
                        {cities.map((city) => (
                            <option key={city._id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    <h3 className="text-lg font-semibold mb-2">Suburb Information</h3>
                    <div className="suburb border p-4 mb-4 rounded random-bg">
                        <label htmlFor="suburbName" className="block mb-2 font-semibold">Suburb Name:</label>
                        <input type="text" id="suburbName" name="suburbName" required className="border border-gray-300 p-2 w-full mb-4 rounded" value={suburbInput} onChange={handleSuburbInputChange} list="suburbSuggestions"/>
                        <datalist id="suburbSuggestions">
                            {filteredSuburbs.map(suburb => (
                                <option key={suburb._id} value={suburb.name} />
                            ))}
                        </datalist>
                        <label htmlFor="state" className="block mb-2 font-semibold">State:</label>
                        <input type="text" id="state" name="cities[0][suburbs][0][state]" value={stateInput} required className="border border-gray-300 p-2 w-full mb-4 rounded" onChange={(e) => setStateInput(e.target.value)} readOnly={isStateLocked}/>
                        <label htmlFor="postalCodeType" className="block mb-2 font-semibold">Postal Code Type:</label>
                        <select id="postalCodeType" name="cities[0][suburbs][0][postalCodeType]" required className="border border-gray-300 p-2 w-full mb-4 rounded">
                            <option value="single">Single</option>
                            <option value="range">Range</option>
                            <option value="list">List</option>
                        </select>
                        <div id="postalCodeInput" className="mb-4">
                            <label for="postalCode" className="block mb-2 font-semibold">Postal Code:</label>
                            <input type="text" id="postalCode" name="cities[0][suburbs][0][postalCodes]" required className="border border-gray-300 p-2 w-full mb-4 rounded"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <div className="bg-gray-100 p-10">
        <h1 className="text-2xl font-bold mb-4">Zones</h1>
        {zones.map((zone) => (
            <div key={zone._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold">{zone.name}</h2>
            {zone.cities.map((city) => (
                <div key={city._id}>
                <h3 className="text-lg font-medium mt-2">{city.name}</h3>
                {city.suburbs.map((suburb) => (
                    <div key={suburb._id} className="pl-4">
                    <p className="font-medium">{suburb.name} ({suburb.state})</p>
                    </div>
                ))}
                </div>
            ))}
            </div>
        ))}
        </div>

    </div>
  );
};

export default ZoneList;