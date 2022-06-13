import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

// needs
interface AimTokenProps {
    clickCallback: () => void;
    attack: boolean
    x: number;
    y: number;
}


const AimToken: React.FC<AimTokenProps> = ({ clickCallback, attack, x, y }) => {
    const [clicked, setClicked] = useState<boolean>(false);

    const clickHandler = () => {
        console.log("clicked token");
        setClicked(true);
        clickCallback();
    }

    return (
        <Token attack={attack} x={x} y={y} onClick={clickHandler} />
    );
}

interface TokenStyleProps {
    attack: boolean;
    x: number;
    y: number;
}

const Token = styled.button<TokenStyleProps>`
    position: relative;
    ${props => `left: ${props.x} px; right: ${props.y} px;`}
    border-radius: 50%;
    ${props => `background-color: ${props.attack ? 'green' : 'blue'}`}
`;

export default AimToken; 