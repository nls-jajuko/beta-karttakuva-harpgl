/*
 * Copyright (C) 2017-2020 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeoCoordinates } from "@here/harp-geoutils";
import { View } from "./View";
import { MapControls, MapControlsUI } from "@here/harp-map-controls";


/* get one free at maanmittauslaitos.fi */
const apikey = '7cd2ddae-9f2e-481c-99d0-404e7bc7a0b2',
    styleUrl = 'resources/style.json';

const imageString =
    // tslint:disable-next-line:max-line-length
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiIHZlcnNpb249IjEuMSIgaWQ9Imx1aS1pY29uLWRlc3RpbmF0aW9ucGluLW9uZGFyay1zb2xpZC1sYXJnZSIKCSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4IDQ4IgoJIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDQ4IDQ4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0ibHVpLWljb24tZGVzdGluYXRpb25waW4tb25kYXJrLXNvbGlkLWxhcmdlLWJvdW5kaW5nLWJveCIgb3BhY2l0eT0iMCI+CgkJPHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTQ3LDF2NDZIMVYxSDQ3IE00OCwwSDB2NDhoNDhWMEw0OCwweiIvPgoJPC9nPgoJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yNCwyQzEzLjg3MDgsMiw1LjY2NjcsMTAuMTU4NCw1LjY2NjcsMjAuMjIzMwoJCWMwLDUuMDMyNSwyLjA1MzMsOS41ODg0LDUuMzcxNywxMi44ODgzTDI0LDQ2bDEyLjk2MTctMTIuODg4M2MzLjMxODMtMy4zLDUuMzcxNy03Ljg1NTgsNS4zNzE3LTEyLjg4ODMKCQlDNDIuMzMzMywxMC4xNTg0LDM0LjEyOTIsMiwyNCwyeiBNMjQsMjVjLTIuNzY1LDAtNS0yLjIzNS01LTVzMi4yMzUtNSw1LTVzNSwyLjIzNSw1LDVTMjYuNzY1LDI1LDI0LDI1eiIvPgo8L2c+Cjwvc3ZnPgo=";

const theme = {
        extends: styleUrl,
        styles: {
            "beta-karttakuva": [
                {
                    "id": "cadastre-boundaries",
                    "description": "KiinteistorajanSijaintitiedot",
                    "layer": "KiinteistorajanSijaintitiedot",
                    "when": [
                        "all",
                        [
                            "==",
                            [
                                "get",
                                "$layer"
                            ],
                            "KiinteistorajanSijaintitiedot"
                        ],
                        [
                            "==",
                            [
                                "geometry-type"
                            ],
                            "LineString"
                        ]
                    ],
                    "technique": "solid-line",
                    "renderOrder": 5000,
                    "final": true,
                    "clipping": false,
                    "lineWidth": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        12,
                        15,
                        14,
                        3,
                        16,
                        1
                    ],
                    color: {
                        interpolation: "Linear",
                        zoomLevels: [14, 15, 16, 18, 20],
                        values: [
                            "#5f0000",
                            "#7f0000",
                            "#9f0000",
                            "#af0000",
                            "#ff0000"
                        ]
                    }

                }, {                    
                    "when": 
                    [
                        "==",
                        [
                            "get",
                            "$layer"
                        ],
                        "RajamerkinSijaintitiedot"
                    ],
                    technique: "labeled-icon",
                    text: ["get", "numero"],
                    priority: 10000, // Displace other labels
                    size: 14,
                    imageTexture: "custom-icon",
                    screenHeight: 16,
                    iconScale: 0.5,
                    distanceScale: 1,
                    iconYOffset: 20,
                    color: "#ffffff"
                }
            ]
        },
        images: {
            "custom-icon": {
                url: imageString,
                preload: true
            }
        },
        imageTextures: [
            {
                name: "custom-icon",
                image: "custom-icon"
            }
        ]
    };

const app = new View({
    apikey: apikey,
    canvas: document.getElementById("map"),
    theme: theme
});

const mapView = app.mapView;

const mapControls = new MapControls(mapView);
mapControls.maxTiltAngle = 90;
const ui = new MapControlsUI(mapControls, { zoomLevel: "input" });

mapView.canvas.parentElement.appendChild(ui.domElement);


// center the camera to New York
mapView.lookAt({ target: new GeoCoordinates(60.158872, 24.877048), zoomLevel: 15.6, tilt: 35 });

// make sure the map is rendered
mapView.update();

window.mapView = mapView;
