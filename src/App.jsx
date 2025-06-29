import { useState } from 'react'
import './App.css'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import 'tachyons'
//import Clarifai from 'clarifai'

function App() {
  const [input, setInput] = useState('')
  const [imgUrl,setImgUrl]=useState(null)
  const [box,setbox]=useState({})

  /*const app = new Clarifai.App({
    apiKey:'88fc2ca5753e40ae89c25e21b84f21b8'
  })*/
  
  const calculateFaceLocation = (data) => {

    const clarifaiFace=  data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height)


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
    console.log('Input enviado desde App:', input);
    setImgUrl(input);

    // app.models.predict('face-detection', input)
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestOptions(input))
    .then(response => response.json())
    .then(result => {

        const regions = result.outputs[0].data.regions;

        regions.forEach(region => {
            // Accessing and rounding the bounding box values
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);

            region.data.concepts.forEach(concept => {
                // Accessing and rounding the concept value
                const name = concept.name;
                const value = concept.value.toFixed(4);

                console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                
            });
        });
        return result;
    })//Result End
    .then(response => displayFaceBox(calculateFaceLocation(response)))
    .catch(err => console.log(err));


  } 

/*-----------------------------------------------------------------------------*/ 
const returnClarifaiRequestOptions = (imgUrl) => {
  // Your PAT (Personal Access Token) can be found in the Account's Security section
  const PAT = '557c14de7ba941b08ac00854fee53f75';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'insightvigil';
  const APP_ID = 'test';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
  const IMAGE_URL = imgUrl;

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


  return (
    <>
      <Navigation/>
      <Logo/>
      <Rank/>
      <ImageLinkForm input={input} onInputChange={onInputChange} onButtonSubmit={handleSubmit}/>
      <FaceRecognition box={box} imageUrl={imgUrl}/>
    
    </>
  )

}

export default App
