import React from 'react';
import {SvgXml} from "react-native-svg";
import {CustomQuakelyIconProps} from "../../utils/global/CustomQuakelyIconProps";

const QuakelyHomeIcon: React.FC<CustomQuakelyIconProps> = ({ width, height, color }) => {
    const svgMarkup = `
        <?xml version="1.0" encoding="utf-8"?>
        <!-- Your SVG code goes here -->
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill-rule="nonzero" d="M5 21a1 1 0 0 1-.993-.883L4 20v-9H1l10.327-9.388a1 1 0 0 1 1.246-.08l.1.08L23 11h-3v9a1 1 0 0 1-.883.993L19 21H5zm7-17.298L6 9.156V19h4.357l1.393-1.5L8 14l5-3-2.5-2 3-3-.5 3 2.5 2-4 3 3.5 3-1.25 2H18V9.157l-6-5.455z"/>
            </g>
        </svg>
    `;

    return <SvgXml xml={svgMarkup} width={width} height={height} fill={color} />;
};

export default QuakelyHomeIcon;