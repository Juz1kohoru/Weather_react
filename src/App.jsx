import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from 'react';
import { object, string } from "yup"

import rainImg from './images/rain.png'
import clearImg from './images/clear.png'
import cloudsImg from './images/clouds.png'
import snowImg from './images/snow.png'
import thunderImg from './images/thunderstorm.png'

import './App.css';

function App() {
  const [city, setCity] = useState("Yerevan")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`,
    ).then((res) => {
      if(res.status === 404) {
        setError("city is not found")
      } else {
        setError(null)
        return res.json().then((res) => setData(res))
      }
    })
  }, [city]);

  const validationSchema = object({
    city: string().required("sity is requirerd")
  })

  const initialValues = {
    city: "",
    button: "Submit"
  }

  const background = (weather) => {
    if (weather && weather.weather[0] && weather.weather[0].main) {
      const main = weather.weather[0].main.toLowerCase()

      if (main === 'rain' || main === 'drizzle') return rainImg
      if (main === 'clear') return clearImg
      if (main === 'clouds') return cloudsImg
      if (main === 'snow') return snowImg
      if (main === 'thunderstorm') return thunderImg
    }
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${background(data)})` }}>
        <div className="container">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values) => setCity(values.city)}>
         <Form>
          <Field type="text" name="city" />
          <Field type="submit" name="button" />      
          <ErrorMessage name="city" component="p" />     
         </Form>
        </Formik>
        {data && <h1 className="weatherName">{data.name}</h1>}
        <div className="datablocks">
          <div className="block">
             {error && <h2>{error}</h2>}
             {data && (
               <div>
                <h4>Degree</h4>
                <h3>{Math.floor(data.main.temp_max - 273.15)}C</h3>
               </div>
             )}
           </div>
           <div className="block">
             {error && <h2>{error}</h2>}
             {data && (
               <div>
                <h4>weather</h4>
                <h3>{data.weather[0].main}</h3>
               </div>
             )}
           </div>
           <div className="block">
             {error && <h2>{error}</h2>}
             {data && (
               <div>
                <h4>feels like</h4>
                <h3>{Math.floor(data.main.feels_like - 273.15)}C</h3>
               </div>
             )}
           </div>
          </div>
        </div>
    </div>
  );
}

export default App;
