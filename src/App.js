import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import axios from 'axios';
import MyTable from './Common/MyTable';
import Loader from './Common/Loader ';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    try {
      setLoading(true)
      const apiCall = await axios.get('https://dummyjson.com/products');
      setData(apiCall.data.products)
      setLoading(false)
    } catch (error) {
      console.log('Error fetching data:', error);
      setLoading(false)
    }
  };

  useEffect(() => {


    fetchData();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <MyTable data={data} setLoading={setLoading} />
    </>
  );
}

export default App;
