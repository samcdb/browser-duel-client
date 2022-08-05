import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

// needs
interface AimTokenProps {
    clickCallback: (clicked: boolean) => void;
    attack: boolean
    x: number;
    y: number;
    clicked: boolean;
}

// -EXPLANATION-
// must re-render if it is clicked
// every render must reset 'clicked'
// essentially: every render caused by parent (passing in prop) must set clicked to false
//      every render caused by clicking must set clicked to true

//'How do we reset 'clicked' when component is rendered via a props change, but not when rendered by setting state 'clicked' to true and re-rendering the component?'
// answer: instead we get clickCallback to set clicked state to true in parent component - causes a re-render via props - so all rendering is done by props change
//      this means every automatic re-render from setInterval in parent will reset clicked to false, but a click action will set clicked to true

const AimToken: React.FC<AimTokenProps> = ({ clickCallback, attack, x, y, clicked}) => {
    // if no click happens before re-rendering then simulate a click - this should not trigger a re-render
    // this helps keep aim game flowing
    useEffect(() => () => {
            console.log("token cleanup");
            // clean up function simulates a click if unclicked
            console.log(clicked)

            if (!clicked) {
                clickCallback(false);
            }
    });

    const clickHandler = () => {
        if (clicked) {
            return;
        }
        console.log("clicked token");
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