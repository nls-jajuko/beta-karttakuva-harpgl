/*
 * Copyright (C) 2017-2020 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */

import { EarthConstants, GeoCoordinates, sphereProjection } from "@here/harp-geoutils";
import {
    AtmosphereLightMode,
    CopyrightElementHandler,
    MapView,
    MapViewAtmosphere
} from "@here/harp-mapview";
import { AuthenticationMethod, VectorTileDataSource, APIFormat } from "@here/harp-vectortile-datasource";
import { AvoinKarttakuvaWebTileDataSource } from "./AvoinKarttakuvaWebTile.js";
import { TAUSTAKARTTA, MAASTOKARTTA } from './AvoinKarttakuvaWebTile.js';

import { ThemeLoader } from '@here/harp-mapview';

const defaultTheme = "resources/berlin_tilezen_base.json";

export class View {
    constructor(args) {
        this.apikey = args.apikey;
        this.canvas = args.canvas;
        this.theme = args.theme === undefined ? defaultTheme : args.theme;
        this.mapView = this.initialize();
    }

    initialize() {


        const loadedTheme = ThemeLoader.load(this.theme).then(t => {
            ThemeLoader.isThemeLoaded(t);
            console.log(this.theme, t);
            return t;
        });

        const mapView = new MapView({
            maxZoomLevel:18,
            canvas: this.canvas,
            projection: sphereProjection,
            theme: loadedTheme,
            decoderUrl: "decoder.bundle.js"
        });

        mapView.resize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", () => {
            mapView.resize(window.innerWidth, window.innerHeight);
        });

        const apikey = this.apikey,
            auth = {
                authenticationCode: apikey,
                authenticationMethod: {
                    method: AuthenticationMethod.QueryString,
                    name: "api-key"
                }
            }

        if (this.rasterBackground) {
            const rasterSource = new AvoinKarttakuvaWebTileDataSource({
                ...auth,
                ...{
                    name: 'taustakartta',
                    product: TAUSTAKARTTA
                }
            });
            mapView.addDataSource(rasterSource);
        }

        const vectorSource = new VectorTileDataSource({
            ...{
                apiFormat: APIFormat.XYZMVT,
                styleSetName: "avoin-karttakuva",
                url: 'https://avoin-karttakuva.maanmittauslaitos.fi/vectortiles/taustakartta/wmts/1.0.0/taustakartta/default/v20/WGS84_Pseudo-Mercator/{z}/{y}/{x}.pbf',
                minDataLevel: 0,
                maxDataLevel: 17,
                maxDisplayLevel: 19
            }, ...auth
        });
        mapView.addDataSource(vectorSource);

        const cadastreSource = new VectorTileDataSource({
            ...{
                apiFormat: APIFormat.XYZMVT,
                styleSetName: "beta-karttakuva",
                url: 'https://beta-karttakuva.maanmittauslaitos.fi/kiinteisto-avoin/vectortiles/wmts/1.0.0/kiinteistojaotus/default/v2/WGS84_Pseudo-Mercator/{z}/{y}/{x}.pbf',
                minDataLevel: 13,
                maxDataLevel: 17,
                maxDisplayLevel: 18
            }, ...auth
        });
        mapView.addDataSource(cadastreSource);

        const updateCallback = () => mapView.update();
        const atmosphere = new MapViewAtmosphere(
            mapView.mapAnchors,
            mapView.camera,
            mapView.projection,
            mapView.renderer.capabilities,
            updateCallback
        );
        atmosphere.lightMode = AtmosphereLightMode.LightDynamic;
       

        return mapView;
    }
}
