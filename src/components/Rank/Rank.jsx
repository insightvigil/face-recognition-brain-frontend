import React from 'react'
const Rank = ({name,entries}) => {
    return(
        <article>
            <section className='white f3'>
                {`${name}, your current entry county is...`}
            </section>
            <section className="white f1">
                {entries}
            </section>
        </article>

    )
}

export default Rank
