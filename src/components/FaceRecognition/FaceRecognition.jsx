import React from 'react'
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <section className='center ma'>
      <article className='absolute mt2 mark'>
        <img id='inputImage' src={imageUrl} alt="" width='500px' height='auto' />
        {
          box.map((face, i) => (
            <div
              key={i}
              className='bounding-box'
              style={{
                top: face.topRow,
                right: face.rightCol,
                bottom: face.bottomRow,
                left: face.leftCol
              }}
            ></div>
          ))
        }
      </article>
    </section>
  );
}

export default FaceRecognition;
