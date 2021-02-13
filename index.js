/*
 * Copyright (C) 2017-2020 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeoCoordinates } from "@here/harp-geoutils";
import { View } from "./View";
import { MapControls, MapControlsUI } from "@here/harp-map-controls";

import { extendStyle} from './BetaKarttakuvaMapStyle';

/* get one free at maanmittauslaitos.fi */
const apikey = '7cd2ddae-9f2e-481c-99d0-404e7bc7a0b2',
    styleUrl = 'resources/style.json';

    
const theme = extendStyle(styleUrl);

const app = new View({
    apikey: apikey,
    canvas: document.getElementById("map"),
    theme: theme,
    rasterBackground: false
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

