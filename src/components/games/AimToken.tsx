import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

// needs
interface AimTokenProps {
    clickCallback: (clicked: boolean) => void;
    attack: boolean
    x: number;
    y: number;
    index: number;
}


const AimToken: React.FC<AimTokenProps> = ({ clickCallback, attack, x, y, index }) => {
    const [clicked, setClicked] = useState<boolean>(false);

    // if no click happens before unmounting - simulate a click
    // this helps keep aim game flowing
    useEffect(() => 
        () => {
            console.log("token cleanup");
            // clean up function simulates a click if unclicked
            setClicked(false);
            
            if (!clicked) {
                clickCallback(false);
            }
    }, [index]);

    const clickHandler = () => {
        if (clicked) {
            return;
        }
        console.log("clicked token");
        setClicked(true);
        clickCallback(true);
    }

    return (
        <Token attack={attack} x={x} y={y} clicked={clicked} onClick={clickHandler} />
    );
}

interface TokenStyleProps {
    attack: boolean;
    clicked: boolean;
    x: number;
    y: number;
}

const Token = styled.button<TokenStyleProps>`
    width: 50px;
    height: 50px;
    position: relative;
    ${props => props.clicked ? `display: none;` : ``}
    ${props => `left: ${props.x}px; top: ${props.y}px;`}
    border-radius: 50%;
    ${props => `background-color: ${props.attack ? 'green' : 'blue'}`}
`;

export default AimToken; 