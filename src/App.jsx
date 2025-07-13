import { useState, useEffect } from 'react'
import './App.css'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import 'tachyons'
//import Clarifai from 'clarifai'
//'https://samples.clarifai.com/face-det.jpg'

function App() {
  const [input, setInput] = useState('')
  const [imgUrl,setImgUrl]=useState(null)
  const [box,setBox]=useState([])
  const [route,setRoute] =useState('signIn')
  const [sign,setSign]=useState(false)
  const [user,setUser]=useState({
    id: '',
    name:'',
    email:'',
    entries:0,
    joined:''
  })
  const [iState, setIState] = useState({


  })



  const returnRequestOptions = (imageUrl) => {
    const PAT = '557c14de7ba941b08ac00854fee53f75';
    const USER_ID = 'insightvigil';
    const APP_ID = 'test';
    const IMAGE_URL = imageUrl;
    

    const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                    // "base64": IMAGE_BYTES_STRING
                }
            }
        }
    ]
});

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  return requestOptions

  }


  const loadUser = (data) => {
    setUser(
      {
      id: data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
      }
    )

  }


  const calculateFaceLocation = (data) => {
  const image = document.getElementById('inputImage');
  if (!image) return [];

  const width = image.width;
  const height = image.height;

  return data.outputs[0].data.regions.map(region => {
    const boundingBox = region.region_info.bounding_box;
    return {
      leftCol: `${boundingBox.left_col * width}px`,
      topRow: `${boundingBox.top_row * height}px`,
      rightCol: `${(1 - boundingBox.right_col) * width}px`,
      bottomRow: `${(1 - boundingBox.bottom_row) * height}px`
    };
  });
};

const displayFaceBox = (data) => {
  const boxes = calculateFaceLocation(data);
  setBox(boxes);
};

  const onInputChange = (event) => {
    setInput(event.target.value)
    console.log('Click',input)
  }

const handleSubmit = () => {
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

  setImgUrl(input); // Mostrar imagen en la interfaz

  fetch(
    `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
    returnRequestOptions(input) // Genera el body y headers con tu PAT
  )
    .then(response => response.json())
    .then(result => {
      const regions = result.outputs?.[0]?.data?.regions;

      if (regions && Array.isArray(regions)) {
        // ✅ Llama a tu servidor para actualizar el contador de entradas
        fetch('https://face-recognition-brain-backend-x0ti.onrender.com/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id })
        })
          .then(res => res.json())
          .then(count => {
            setUser({ ...user, entries: count }); // Actualiza el Rank
          })
          .catch(err => console.log('Error al actualizar entradas:', err));

        // ✅ Muestra las cajas faciales en la imagen
        displayFaceBox(result);

        // 🧪 (opcional) Imprimir resultados en consola
        regions.forEach((region, index) => {
          const bbox = region.region_info.bounding_box;
          const concepts = region.data?.concepts || [];
          console.log(
            `#${index + 1} BBox: ${bbox.top_row}, ${bbox.left_col}, ${bbox.bottom_row}, ${bbox.right_col}`
          );
          concepts.forEach(concept => {
            console.log(`  ${concept.name}: ${concept.value.toFixed(4)}`);
          });
        });

      } else {
        console.log('No se detectaron rostros');
        setBox([]); // Limpia cualquier caja anterior
      }
    })
    .catch(error => {
      console.error('Error al contactar Clarifai:', error);
    });
};

const onRouteChange = (route) => {
  if (route==='signOut') {
    setSign(false)
  }
  else if (route==='home'){
    setSign(true)
  }

  setRoute(route)
}

  return (
    <>
      <Navigation isSignedIn={sign} onRouteChange={onRouteChange}/>
      { route === 'home'? 

      <>
      <Logo/>
      <Rank name={user.name} entries={user.entries}/>
      <ImageLinkForm input={input} onInputChange={onInputChange} onButtonSubmit={handleSubmit}/>
      <FaceRecognition box={box} imageUrl={imgUrl}/>
      </>

      
      
      :
      (route === 'signIn') ?
      <>
      <Signin loadUser={loadUser} onRouteChange={onRouteChange}/>
      </>
      :
      <Register loadUser={loadUser} onRouteChange={onRouteChange}/>

      }
    
    </>
  )

}

export default App
