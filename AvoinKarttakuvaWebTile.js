/*
 * Copyright (C) nls.fi based on work by
 * Copyright (C) 2019-2021 HERE Europe B.V.
 * Licensed under Apache 2.0, see full license in LICENSE
 * SPDX-License-Identifier: Apache-2.0
 */
import {
    CopyrightInfo,
    RequestHeaders,
    TextureLoader,
    Tile,
    UrlCopyrightProvider
} from "@here/harp-mapview";
import {
    ApiKeyAuthentication,
    AppIdAuthentication,
    getOptionValue,
    TokenAuthentication
} from "@here/harp-utils";
import { Texture } from "three";

import {
    WebTileDataProvider,
    WebTileDataSource,
    WebTileDataSourceOptions
} from "@here/harp-webtile-datasource";

const textureLoader = new TextureLoader();


const TILE_BASE_NORMAL =
    "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator";

const TILE_BASE_TERRAIN =
    "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator";

const AVOIN_KARTTAKUVA_COPYRIGHT_INFO = [{
    id: "maanmittauslaitos.fi",
    year: new Date().getFullYear(),
    label: "MML",
    link: "https://maanmittauslaitos.fi"
}];

export class AvoinKarttakuvaTileProvider {

    constructor(m_options) {
        this.m_options = m_options;
        this.m_ppi = WebTileDataSource.ppiValue.ppi72;
        this.m_tileBaseAddress = m_options.product || TILE_BASE_NORMAL;
        this.m_resolution = 256;
    }


    /** @override */
    async getTexture(tile, abortSignal) {
        const column = tile.tileKey.column;
        const row = tile.tileKey.row;
        const level = tile.tileKey.level;

        const imageRequestParams = [
            `api-key=${this.m_options.authenticationCode}`
        ];

        const imageQueryParams = imageRequestParams.length > 0 ?
            `?${imageRequestParams.join("&")}` : '';

        const url =
            `${this.m_tileBaseAddress}/${level}/${row}/${column}.png${imageQueryParams}`;

        return Promise.all([   
            textureLoader.load(url, undefined, abortSignal),
            AVOIN_KARTTAKUVA_COPYRIGHT_INFO
        ]);
    }
}


export class AvoinKarttakuvaWebTileDataSource extends WebTileDataSource {


    constructor(m_options) {
        super({
            ...{
                minDataLevel: 1,
                maxDataLevel: 17,
                resolution: 256,
                dataProvider: new AvoinKarttakuvaTileProvider(m_options),
                storageLevelOffset: m_options.storageLevelOffset || -1
            }, ...m_options
        });
        this.cacheable = true;
    }
}

export { TILE_BASE_NORMAL as TAUSTAKARTTA, TILE_BASE_TERRAIN as MAASTOKARTTA };