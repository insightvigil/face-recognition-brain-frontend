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

function App() {
  const [input, setInput] = useState('')
  const [imgUrl,setImgUrl]=useState(null)
  const [box,setbox]=useState({})
  const [route,setRoute] =useState('signIn')
  const [sign,setSign]=useState(false)
  const [user,setUser]=useState({
    id: '',
    name:'',
    email:'',
    entries:0,
    joined:''
  })

  /*const app = new Clarifai.App({
    apiKey:'88fc2ca5753e40ae89c25e21b84f21b8'
  })*/
  
    //After render run this code
/*
  useEffect(() => {
    fetch('http://localhost:5001')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []); // empty array = run once (on mount)

  return <div>Data Retrieved</div>;
  */

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
    const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - (boundingBox.right_col * width),
      bottomRow: height - (boundingBox.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setbox(box)
  }

  const onInputChange = (event) => {
    setInput(event.target.value)
    console.log('Click',input)
  }
/*-------------------------Aquí inicia el controlador de face recognition ------------------*/  
  const handleSubmit = () => {
    setImgUrl(input); // para mostrar la imagen en la app

  const PAT = '557c14de7ba941b08ac00854fee53f75';
  const USER_ID = 'insightvigil';
  const APP_ID = 'test';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID
    },
    inputs: [
      {
        data: {
          image: {
            url: input
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT
    },
    body: raw
  };

  fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.outputs && result.outputs[0].data.regions) {
        const box = calculateFaceLocation(result); // Calcula coordenadas reales
        displayFaceBox(box); // Actualiza estado para dibujar la caja

        // Opcional: Actualiza el contador en tu backend
        fetch('http://localhost:5001/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id })
        })
          .then(response => response.json())
          .then(count => {
            setUser(prevUser => ({...prevUser, entries: count}));
            console.log(user)
          });
      }
    })
    .catch(error => console.log('Error al llamar a Clarifai:', error));
  } 

/*-----------------------------------------------------------------------------*/ 


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
