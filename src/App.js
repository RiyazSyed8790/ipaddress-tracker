import React, { useRef } from 'react';
import './App.css';
import axios from 'axios';
import { TileLayer, Marker, Popup } from 'react-leaflet';
import { MapContainer } from 'react-leaflet';
import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
import L from "leaflet";
function App() {
  let text=">";
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const customIcon = new L.Icon({
    
    iconUrl:'data:image/png;base64,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',
    iconSize: [25, 25], // Adjust the size as needed
  });
  const [query,setQuery] = React.useState("");
  const [dat,setDat] = React.useState({
  ip: "106.203.193.139",
  location: {
      "country": "India",
      "region": "--",
      "city": "Guntur",
      "lat": 42.365,
      "lng": -71.08554,
      "postalCode": "522006",
      "timezone": "+5.5",
      "geonameId": 12382288
  },
  isp: "Bharti Airtel Limited"});
  const [cord,setCord] = React.useState([16.302299332459512, 80.43914251285031]);
  const mapRef= useRef();
  function handleChange(e){
    setQuery(e.target.value);
  }
  function checker(e){
    if(e.key==="Enter"){
      getIp();
    }
  }
  function getIp(){
    ipv4Regex.test(query)?(
    axios.get('https://geo.ipify.org/api/v2/country,city?', {
      params: {
        apiKey: process.env.REACT_APP_API_key,
        ipAddress: query
      }
    })
    .then(function (response) {
      console.log(response);
      setDat(response.data);
      setCord([response.data.location.lat,response.data.location.lng]);
    })
    .catch(function (error) {
      console.log(error);
    })):alert("Enter a valid Ip address!");
  }

  return (
    
    <main className="App relative text-2xl rubik h-screen text-black ">
      <section className='query h-1/3 desk'>
          <h2 className=' text-white py-4'>IP Address Tracker</h2>
          <div className='flex items-center justify-center'>
          <input name='query' value={query} onKeyDown={(e)=>checker(e)} onChange={(e)=>handleChange(e)} className='px-2  outline-none py-2 md:my-4 my-2 rounded-l-xl text-base w-2/3 md:w-1/4' type='text' placeholder='Search for any IP address or domain' />
          <button type='submit' onClick={getIp} className=' bg-black w-10 h-10  text-center text-white rounded-r-xl'>{text}</button>
          </div>
      </section>
      <section className='flex  absolute top-32   md:top-40  w-full justify-center'>
      <div className='data  z-30 w-2/3 md:h-[8rem] h-full shadow-md rounded-xl child:my-2 child:text-center md:child:text-left  md:child:mx-4 flex flex-wrap justify-center md:justify-between bg-white items-center'>
        <div>
          <h3 className=' text-sm text-gray-600'>IP ADDRESS</h3>
          <h2 className=' text-xl font-semibold'>{dat.ip}</h2>
        </div>
        <div>
          <h3 className=' text-sm text-gray-600'>LOCATION</h3>
          <h2 className=' text-xl font-semibold'>{dat.location.city}, {dat.location.country} {dat.location.postalCode} </h2>
        </div>
        <div>
          <h3 className=' text-sm text-gray-600'>TIMEZONE</h3>
          <h2 className=' text-xl font-semibold'>UTC{dat.location.timezone}</h2>
        </div>
        <div>
          <h3 className=' text-sm text-gray-600'>ISP</h3>
          <h2 className=' text-xl font-semibold'>{dat.isp}</h2>
        </div>
      </div>
      </section>
      <section className='h-2/3 '  id="map" >
    <MapContainer className='h-full w-full z-0' center={cord} ref={mapRef} zoom={15} scrollWheelZoom={false}>
    <TileLayer
    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>'
      url='https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=5wFM7v9vkH24H6JHfzVz'
    />
    <Marker icon={customIcon} opacity={1} position={cord}>
      <Popup>
        You are here!
      </Popup>
    </Marker>
  </MapContainer>
      </section>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>
    </main>
  
  );
}

export default App;
