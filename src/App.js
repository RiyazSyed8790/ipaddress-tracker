import React, { useRef } from 'react';
import './App.css';
import axios from 'axios';
import { TileLayer, Marker, Popup } from 'react-leaflet';
import { MapContainer,useMapEvents } from 'react-leaflet';

function App() {
  let text=">";
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const [query,setQuery] = React.useState("");
  const [dat,setDat] = React.useState({
  ip: "106.203.193.139",
  location: {
      "country": "India",
      "region": "",
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
  function LocationMarker() {
    const map = useMapEvents({
      mouseover() {
        map.flyTo(cord, 15)
      },
    })
  
    return cord === null ? null : (
      <Marker position={cord}>
        <Popup>You are here</Popup>
      </Marker>
    )
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
      //console.log(response);
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
    <LocationMarker />
  </MapContainer>
      </section>
    </main>
  
  );
}

export default App;
