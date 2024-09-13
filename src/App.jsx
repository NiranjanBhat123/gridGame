import React from 'react';
import { ToastContainer } from 'react-toastify';
import Game from './components/Game';



const App = () => {
    return (
        <div>
            <Game />
            <ToastContainer />
        </div>
    );
};

export default App;