import React from 'react'
import './ImageLinkForm.css'

const ImageLinkForm = ({input, onInputChange, onButtonSubmit} ) => {
    return(
        <article>
            <p className="f3">
                {'This Magic Brain Will Detect Faces in your pictures. Give it a try'}
            </p>
            <section>
                <article className='form center pa4 br3 shadow-5 articleW'>
                <input className='f4 pa2 w-70 center' type="text" onChange={onInputChange} />
                <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>
                </article>
            </section>
        </article>

    )

}

export default ImageLinkForm