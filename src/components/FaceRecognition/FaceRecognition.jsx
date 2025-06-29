import React from 'react'
import './FaceRecognition.css';
const FaceRecognition = ({imageUrl, box}) => {
    return (
        <section className='center'>
            <article className='m2'>
            <img id='inputImage' src={imageUrl} alt="" width='500px' height='auto'/>
            <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow,left:box.leftCol }}></div>
            </article>
        </section>

    )
}

export default FaceRecognition 