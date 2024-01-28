import React from 'react'

// const loadingGif = 'https://tenor.com/en-IN/view/loading-splash-gif-21140992'
import LoadingGif from '../images/icegif-1263.gif'

const Loader = () => {
    return (
        <div className='loader'>
            <div className="loader__image">
                <img src={LoadingGif} alt="" />
            </div>
        </div>
    )
}

export default Loader