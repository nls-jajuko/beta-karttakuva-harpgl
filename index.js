
import { GeoCoordinates } from "@here/harp-geoutils";
import { View } from "./View";
import { MapControls, MapControlsUI } from "@here/harp-map-controls";

import { extendStyle } from './BetaKarttakuvaMapStyle';

import { Hash } from './hash.js';

/* get one free at maanmittauslaitos.fi */
const apikey = '7cd2ddae-9f2e-481c-99d0-404e7bc7a0b2',
    styleUrl = 'resources/style.json';

const theme = extendStyle(styleUrl);

const app = new View({
    apikey: apikey,
    canvas: document.getElementById("map"),
    theme: theme,
    rasterBackground: true
}), mapView = app.mapView,
    mapControls = new MapControls(mapView),
    ui = new MapControlsUI(mapControls, { zoomLevel: "input" }),
    hash = new Hash();


mapControls.maxTiltAngle = 90;

mapView.canvas.parentElement.appendChild(ui.domElement);
mapView.lookAt({ target: new GeoCoordinates(60.158872, 24.877048), zoomLevel: 15.6, tilt: 35 });
mapView.update();

hash.addTo(mapView);