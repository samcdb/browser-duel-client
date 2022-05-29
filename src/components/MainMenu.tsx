import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const MainMenu: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
        <button onClick={() => navigate('/match')}>
            queue
        </button>
        </>
    );
}

export default MainMenu;