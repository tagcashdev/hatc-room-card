/*
Example

type: custom:hatc-room-card
title: Cuisine
background_image: /local/area/kitchen.jpg

tap_action:
  action: navigate
  navigation_path: /lovelace-mushroom/kitchen

entities:
  - entity: sensor.fibaro_fenetre_porte_salon_access_control_door_state
    device_class: sliding-door
    position: top.right
  - entity: sensor.fibaro_fenetre_porte_salon_air_temperature
  - entity: sensor.all_estimated_kitchen_power
  - entity: light.ampoules_plafond_cuisine
    position: bottom
  - entity: switch.011030387805000808_bsh_common_setting_powerstate
    position: bottom
  - entity: select.siemens_hs658gxs7c_68a40e607fda_bsh_common_setting_powerstate
    show_state: false
    icon: mdi:stove
    position: bottom


-------------------------------------------------------------


type: custom:hatc-room-card
title: Hall d'entrée
background_image: /local/area/entrance.jpg

tap_action:
    action: navigate
    navigation_path: /lovelace-mushroom/entrance

entities:
  - entity: sensor.fibaro_porte_dentree_access_control_door_state
    device_class: door
    position: top.right
  - entity: sensor.temperature_moyenne_hall_d_entree
    device_class: temperature
  - entity: sensor.all_estimated_entrance_hall_power
  - entity: light.ampoules_plafond_couloir
    position: bottom

*/

import handleClick  from "./hass/handleClick.js";
import {html, css, LitElement} from './core/lit-core.min.js';

function powerColor(entityType, value){
    var entityClass = "";

    if(value == 'unavailable' || value == 'off'){
        entityClass = "disabled";
    }else if(value.includes("Standby")){
        entityClass = "standby";
    }else if(value.includes("paused")){
        entityClass = "pause";
    }else if(value.includes("playing") || value.includes("on")){
        entityClass = "played";
    }else if(value.includes("idle")){
        entityClass = "idle";
    }

    return entityClass;
}

function airTemperatureColor(entityType, value){
    var entityClass = '';

    if(entityType.includes("temperature")){      
        if(value <= 16){
            entityClass = "blue";
        }else if(value <= 20){
            entityClass = "yellow";
        }else if(value <= 22){
            entityClass = "orange";
        }else if(value <= 24){
            entityClass = "deep-orange";
        }else if(value <= 26){
            entityClass = "red";
        }else if(value <= 28){
            entityClass = "purple";
        }else if(value <= 30){
            entityClass = "deep-purple";
        }
    }
    return entityClass;
}

function powerColorConsumed(entityType, value){
    var entityClass = powerColor(entityType, value);
    
    if(entityType.includes("power")){      
        if(value === 0){
            entityClass = "disabled";
        }else if(value <= 25){
            entityClass = "white";
        }else if(value <= 150){
            entityClass = "blue";
        }else if(value <= 250){
            entityClass = "green";
        }else if(value <= 400){
            entityClass = "yellow";
        }else if(value <= 800){
            entityClass = "orange";
        }else if(value <= 1400){
            entityClass = "deep-orange";
        }else if(value <= 2500){
            entityClass = "red";
        }else if(value > 2500){
            entityClass = "purple";
        }
    }
    return entityClass;
}

function entityConstructor(t, ent){
    var hassEntity;
    var entEntity = ent.entity;
    var hPosition = (typeof ent.position !== 'undefined' ? ent.position : 'default');

    var showIconEntity = (typeof ent.show_icon !== 'undefined' ? ent.show_icon : true);
    var showTitleEntity = (typeof ent.show_title !== 'undefined' ? ent.show_title : false);
    var showStateEntity = (typeof ent.show_state !== 'undefined' ? ent.show_state : true); 
    
    if(t.hass.states[ent]){
        hassEntity = t.hass.states[ent];
    }else if(t.hass.states[entEntity]){
        hassEntity = t.hass.states[entEntity];
    }

    var device_class = (typeof ent.device_class !== 'undefined' ? ent.device_class : hassEntity.attributes.device_class); 

    var icon = '';
    var hStyleIcon = '';
    var hClassIcon = '';
    var hClassSensor = '';
    var hStateValue = '';
    var hStyleTVSource = '';
    var backgroundImage = '';
    var hUnitOfMeasurementValue = '';
    var hClick = {};

    hClick = (ev => t._handleEntities(ev, ent));
    //${ev => this._toggle(hV.hassEntity)}

    if(typeof hassEntity.attributes.icon !== 'undefined'){
        icon = hassEntity.attributes.icon;
    }

    if(typeof device_class !== 'undefined'){
        if(device_class == 'temperature'){
            icon = 'mdi:thermometer';
            hClassIcon = airTemperatureColor(device_class, hassEntity.state);
            hClassSensor = hClassIcon;
        }else if(device_class == 'duration'){
            if(hassEntity.attributes.unit_of_measurement == 'h'){
                var hm = (hassEntity.state).split('.');
                var _m = "" + parseFloat("0." + hm[1]) * 60;
                var m = "";
                console.log("m"+_m);
                if(_m.includes(".")){
                    m = _m.split('.')[0];
                }else{
                    m = _m;
                }
                hStateValue = hm[0] + "h" + m;
                hUnitOfMeasurementValue = ' ';
            }
        }else if(device_class == 'power'){
            icon = 'mdi:flash';
            hClassIcon = powerColorConsumed(device_class, hassEntity.state);
            hClassSensor = hClassIcon;
            if(parseFloat(hassEntity.state) >= 1000 && hassEntity.attributes.unit_of_measurement == 'W'){
                hStateValue = (parseFloat(hassEntity.state) / 1000).toFixed(2);
                hUnitOfMeasurementValue = 'kW';
            }
        }else if(device_class == 'home_connect_alt__settings'){
            hClassIcon = powerColor(device_class, hassEntity.state);
            hClassSensor = hClassIcon;
        }else if(device_class == 'tv'){
            icon = (icon != '' ? icon : 'mdi:television');
            hClassIcon = powerColor(device_class, hassEntity.state);
            hClassSensor = hClassIcon;
            showStateEntity = false;
            var source = '';
            var url = '';
            switch(hassEntity.attributes.source){
                case 'Netflix':
                    source = 'netflix';
                    url = source + '.png';
                    break;
                case 'Disney+':
                    source = 'disneyplus';
                    url = source + '.png';
                    break;
                case 'YouTube':
                    source = 'youtube';
                    url = source + '.png';
                    break;
                case 'Plex':
                    source = 'plex';
                    url = source + '.png';
                    break;
                case 'Spotify - Musique et podcasts':
                    source = 'spotify';
                    url = source + '.png';
                    break;
                case 'Nintendo Switch Console de jeu':
                    source = 'switch';
                    url = source + '.png';
                    break;
                case 'Swisscom Boîtier décodeur /Box Internet':
                    source = 'swisscom';
                    url = source + '.png';
                    break;
                case 'Tableau de bord Maison' :
                    source = 'home';
                    url = source + '.png';
                    break;
                case 'XBOX Console de jeu' :
                    source = 'xbox';
                    url = source + '.png';
                    break;
                default:
                    source = 'default';
                    url = source + '.png';
                    break;
            }

            hStyleTVSource = html`<style>ha-card.HatcRoomCard .box .tvsource.${source} { display:block; }</style>`;
        }else if(device_class == 'door'){
            if(hassEntity.attributes.value == 23 || hassEntity.state == 'off'){
                icon = 'mdi:door-closed-lock';
                hClassIcon = 'green';
            }else{
                icon = 'mdi:door-open';
                hClassIcon = 'red';
            }
            showStateEntity = false;
        }else if(device_class == 'window'){
            if(hassEntity.attributes.value == 23 || hassEntity.state == 'off'){
                icon = 'mdi:window-closed-variant';
                hClassIcon = 'green';
            }else{
                icon = 'mdi:window-open-variant';
                hClassIcon = 'red';
            }
            showStateEntity = false;
        }else if(device_class == 'sliding-door'){
            if(hassEntity.attributes.value == 23 || hassEntity.state == 'off'){
                icon = 'mdi:door-sliding-lock';
                hClassIcon = 'green';
            }else{
                icon = 'mdi:door-sliding-open';
                hClassIcon = 'red';
            }
            showStateEntity = false;
        }
    }else{
        if(hassEntity.entity_id.startsWith('light')){
            hClick = (ev => t._toggle(hassEntity, "homeassistant"));
            icon = (icon != '' ? icon : 'mdi:lightbulb');
            if(typeof hassEntity.attributes.rgb_color !== 'undefined'){
                hStyleIcon = 'color:rgb('+hassEntity.attributes.rgb_color+');';
            }else{
                hStyleIcon = 'color:rgbs(255,165,0);';
            }
            
        }
        if(hassEntity.entity_id.startsWith('switch')){
            hClick = (ev => t._toggle(hassEntity, "homeassistant"));
            icon = (icon != '' ? icon : 'mdi:toggle-switch-variant');
            if(hassEntity.state == 'on'){
                hClassIcon = 'orange';
            }
        }
        if(hassEntity.entity_id.startsWith('media_player')){
            hClick = (ev => t._toggle(hassEntity, "media_player"));
            hClassIcon = powerColor(device_class, hassEntity.state);
            hClassSensor = hClassIcon;
        }
    }

    

    if(hassEntity.entity_id.startsWith('light') || hassEntity.entity_id.startsWith('switch')){
        showStateEntity = false;
    }

    var hTitle = showTitleEntity ? hassEntity.attributes.friendly_name : '';
    var hIcon = showIconEntity ? (typeof ent.icon !== 'undefined' ? ent.icon : icon) : '';
    var hState = showStateEntity ? (hStateValue !== '' ? hStateValue : (hassEntity.state != 'unavailable' ? hassEntity.state : '')) : '';

    var hUnitOfMeasurement = (hUnitOfMeasurementValue !== '' ? hUnitOfMeasurementValue : (typeof hassEntity.attributes.unit_of_measurement !== 'undefined' ? (hassEntity.state != 'unavailable' ? hassEntity.attributes.unit_of_measurement : '') : ''));

    var h = {
        "hClick": hClick,
        "hPosition": hPosition,
        "hTitle": hTitle,
        "hIcon": hIcon,
        "hStyleIcon": hStyleIcon,
        "hClassIcon": hClassIcon,
        "hClassSensor": hClassSensor,
        "hStyleTVSource": hStyleTVSource,
        "hState": hState,
        "hUnitOfMeasurement": hUnitOfMeasurement
    }

    return h;
}

class HatcRoomCard extends LitElement {
    static get properties() {
        return {
            hass: {},
            config: {}
        };
    }

    static getConfigElement() {
        console.log("getConfigElement");
    }

    static getStubConfig() {
        return { entity: "sun.sun" }
    }

    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    render() {
        var headerTitle = (typeof this.config.title !== 'undefined') ? this.config.title : 'HatcRoomCard';
        
        var idCard = (typeof this.config.id !== 'undefined') ? this.config.id : 'HatcRoomCard';

        var backgroundImage; var backgroundImageStyle = 'display: none !important;'; var backgroundMedia;
        if(typeof this.config.background_image !== 'undefined'){
            backgroundImage = this.config.background_image;
            backgroundImageStyle = '';
            if(typeof this.config.background_filter !== 'undefined'){
                backgroundImageStyle = 'filter: brightness(0.'+this.config.background_filter+');';
            }
        }
        
        if(typeof this.config.background_media !== 'undefined'){
            backgroundMedia = this.config.background_media;
            var bgSource = html`
                <img class="tvsource netflix" src="${backgroundMedia}netflix.png">
                <img class="tvsource disneyplus" src="${backgroundMedia}disneyplus.png">
                <img class="tvsource youtube" src="${backgroundMedia}youtube.png">
                <img class="tvsource plex" src="${backgroundMedia}plex.png">
                <img class="tvsource spotify" src="${backgroundMedia}spotify.png">
                <img class="tvsource xbox" src="${backgroundMedia}xbox.png">
                <img class="tvsource swisscom" src="${backgroundMedia}swisscom.png">
                <img class="tvsource switch" src="${backgroundMedia}switch.png">
                <img class="tvsource home" src="${backgroundMedia}home.png">
                <img class="tvsource default" src="${backgroundMedia}default.png">
            `;
        }
        
        return html`
            <content-card-editor></content-card-editor>
            <ha-card class="HatcRoomCard">
                <div class="box">
                    <div @click=${e => this._handlePopup(e)} class="backgroundHandle"></div>
                    <img style="${backgroundImageStyle}" src="${backgroundImage}" class="backgroundImage">
                    ${bgSource}
                    
                    <div class="nameCard card-header">${headerTitle}</div>

                    <div class="entities_top_right">
                        ${this.config.entities.filter(function (enttr) {
                            var hPosition = (typeof enttr.position !== 'undefined' ? enttr.position : 'default');
                            return hPosition === "top.right";
                        }).map(enttr => {

                            var hV = entityConstructor(this, enttr);
                            
                            return html`
                                <div class="wrapper" @click="${hV.hClick}">
                                    ${hV.hTitle}
                                    <ha-icon
                                        .icon="${hV.hIcon}"
                                        style="${hV.hStyleIcon}"
                                        class="icon ${hV.hClassIcon}"
                                    ></ha-icon>
                                    <span class="sensor ${hV.hClassSensor}">
                                        ${hV.hState} ${hV.hUnitOfMeasurement}
                                    </span>
                                </div>
                            `;
                        })}
                    </div>

                    <div class="entities">
                        ${this.config.entities.filter(function (ent) {
                            var hPosition = (typeof ent.position !== 'undefined' ? ent.position : 'default');
                            return hPosition === "default";
                        }).map(ent => {

                            var hV = entityConstructor(this, ent);

                            return html`
                                <div class="wrapper" @click="${hV.hClick}">
                                    ${hV.hTitle}
                                    <ha-icon
                                        .icon="${hV.hIcon}"
                                        style="${hV.hStyleIcon}"
                                        class="icon ${hV.hClassIcon}"
                                    ></ha-icon>
                                    <span class="sensor ${hV.hClassSensor}">
                                        ${hV.hState} ${hV.hUnitOfMeasurement}
                                    </span>
                                </div>
                            `;
                        })}
                    </div>

                    <div class="entities_bottom_right">
                        ${this.config.entities.filter(function (entb) {
                            var hPosition = (typeof entb.position !== 'undefined' ? entb.position : 'default');
                            return hPosition === "bottom";
                        }).map(entb => {
                            
                            var hV = entityConstructor(this, entb);

                            if(hV.hPosition == 'bottom'){
                                return html`
                                    <div class="wrapper" @click="${hV.hClick}">
                                        ${hV.hTitle}
                                        <span class="ha-tv-source ${hV.hClassIcon}" style="">
                                          ${hV.hStyleTVSource}
                                        </span>
                                        <ha-icon
                                            .icon="${hV.hIcon}"
                                            style="${hV.hStyleIcon}"
                                            class="icon ${hV.hClassIcon}"
                                        ></ha-icon>
                                        <span class="sensor ${hV.hClassSensor}">
                                            ${hV.hState} ${hV.hUnitOfMeasurement}
                                        </span>
                                    </div>
                                `;
                                
                            }
                        })}
                    </div>
                </div>
            </ha-card>
        `;
    }

    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
        if (!config.entities) {
            throw new Error('You need to define an entities');
        }
        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
        return this.config.entities.length + 1;
    }

    _toggle(state, service) {
        this.hass.callService(service, "toggle", {
            entity_id: state.entity_id
        });
    }

    _handlePopup(e) {
        console.log("handlePopup called");
        console.log("e", e);
        if (!this.config.tap_action) {
            return;
        }
        e.stopPropagation();
        console.log("this.config:"+ JSON.stringify(this.config));
        console.log("this.config.tap_action:"+ this.config.tap_action);
        handleClick(this, this.hass, this.config.tap_action, false);
    }

    _handleEntities(e, entity) {
        var ent = entity || {};

        console.log("entity:"+ JSON.stringify(entity));
        console.log("ent:"+ JSON.stringify(ent));
        console.log("_handleEntities called");
        console.log("e", e);
        
        if (!ent['tap_action']) {
            ent = {
                tap_action: {
                    action: "more-info",
                    ...ent
                }
            }
            console.log("tap_action empty");
        }
        
        console.log("ent.tap_action:"+ ent.tap_action);
        console.log("ent.tap_action.action:"+ ent.tap_action.action);
        console.log("ent['tap_action']:"+ ent['tap_action']);
        console.log("ent:"+ JSON.stringify(ent));
        
        e.stopPropagation();
        handleClick(this, this.hass, ent.tap_action, false);
    }

    static get styles() {
        return css`
            :root, .HatcRoomCard .box .entities_top_right
            {
                --mdc-icon-size: 1.5em;
            }
            .HatcRoomCard .box .entities_bottom_right{
                --mdc-icon-size: 2em;
            }
            .HatcRoomCard .box .entities{
                --mdc-icon-size: 1.2em;
            }
            
            .HatcRoomCard > *{
               --primary-text-color: white; 
               color: white;
            }

            ha-card.HatcRoomCard{
                position: relative;
                min-height: 48px;
                height: 100%;
                z-index: 0;
                overflow:hidden;
                border: 0px;
            }

            ha-card.HatcRoomCard .box .card-header {
                position: absolute;
                top: 10px;
                left: 10px;
                font-weight: bold;
                font-size: 1.5em;
            }

            ha-card.HatcRoomCard .box .entities {
                display: flex;
                position: absolute;
                top: 35px;
                left: 5px;
                flex-flow: row wrap;
                place-content: center flex-start;
                align-items: center;
                gap: 5px;
            }

            ha-card.HatcRoomCard .box .entities_bottom_right {
                display: flex;
                position: absolute;
                bottom: 10px;
                right: 10px;
                align-items: center;
                flex-flow: row wrap;
                place-content: center flex-end;
                gap: 10px;
            }

            ha-card.HatcRoomCard .box .entities_top_right {
                display: flex;
                place-content: center flex-end;
                flex-flow: row-reverse nowrap;
                align-items: center;
                position: absolute;
                top: 10px;
                right: 10px;
                gap: 5px;
            }

            ha-card.HatcRoomCard .box .wrapper {
                display: inline-flex;
                align-items: center;
                flex-flow: row nowrap;
                place-content: center flex-start;
            }
            ha-card.HatcRoomCard .box .entities .wrapper, ha-card.HatcRoomCard .box .entities_top_right .wrapper{
                height: 17px;
                min-width: 17px;       
            }
            
            ha-card.HatcRoomCard .box .entities .wrapper{
                gap: 3px;
            }  

            ha-card.HatcRoomCard .box .wrapper .icon {
                order: 1;
            }
            ha-card.HatcRoomCard .box .wrapper .sensor{
                order: 2;
                font-weight: bold;
                font-size: 1.2em;
                filter: opacity(95%);
            }
            ha-card.HatcRoomCard .box .wrapper .ha-icon-badge {
                --mdc-icon-size: 12px;

                display: none;
                height: 12px;
                width: 12px;
                position: absolute;
                background-color: rgb(88, 158, 74);
                color: white;
                border-radius: 100%;
                text-align: center;
                font-size: 7px;
                top: -8px;
                right: -4px;
                align-items: center;
                justify-content: center;
                line-height: 0;
                padding: 1px 2px 1px 1px;
            }
            ha-card.HatcRoomCard .box .wrapper .ha-tv-source {
                --mdc-icon-size: 12px;

                display: none;
                height: 10px;
                width: 15px;
                position: absolute;
                background-size: 100%;
                background-repeat: no-repeat;
                background-position: 0% center;
                color: white;
                border-radius: 0;
                text-align: center;
                font-size: 7px;
                margin-left: 3px;
                align-items: center;
                justify-content: center;
                line-height: 0;
                padding: 1px 2px 1px 1px;
            }
            ha-card.HatcRoomCard .box .wrapper .ha-tv-source.played {
                display:block;
            }

            ha-card.HatcRoomCard .box .wrapper .sensor.pause,
            ha-card.HatcRoomCard .box .wrapper .sensor.idle,
            ha-card.HatcRoomCard .box .wrapper .sensor.played,
            ha-card.HatcRoomCard .box .tvsource
            {
                display:none;
            }

            ha-card.HatcRoomCard .box > .backgroundHandle{
                width: 100%;
                height: 100%;
                background: transparent;
                position: absolute;
            }
            ha-card.HatcRoomCard .box > img {
                display: block;
                height: 100%;
                width: 100%;
               
                object-fit: cover;
                position: absolute;
                z-index: -1;
                pointer-events: none;
                border-radius: var(--ha-card-border-radius);
            }
            
            ha-card.HatcRoomCard .box > img.backgroundImage {
                filter: brightness(0.35);
            }

            .red{ color: rgb(244, 67, 54); }
            .pink{ color: rgb(233, 30, 99); }
            .purple{ color: rgb(156, 39, 176); }
            .deep-purple{ color: rgb(103, 58, 183); }
            .indigo{ color: rgb(63, 81, 181); }
            .blue{ color: rgb(33, 150, 243); }
            .light-blue{ color: rgb(3, 169, 244); }
            .cyan{ color: rgb(0, 188, 212); }
            .teal{ color: rgb(0, 150, 136); }
            .green{ color: rgb(76, 175, 80); }
            .light-green{ color: rgb(139, 195, 74); }
            .lime{ color: rgb(205, 220, 57); }
            .yellow{ color: rgb(255, 235, 59); }
            .amber{ color: rgb(255, 193, 7); }
            .orange{ color: rgb(255, 152, 0); }
            .deep-orange{ color: rgb(255, 87, 34); }
            .brown{ color: rgb(121, 85, 72); }
            .grey{ color: rgb(158, 158, 158); }
            .blue-grey{ color: rgb(96, 125, 139); }
            .black{ color: rgb(0, 0, 0); }
            .white, .played{ color: rgb(255, 255, 255); }

            .disabled, .standby, .idle, .pause{ color: rgba(189, 189, 189, 0.4); }
        `;
    }
}

customElements.define('hatc-room-card', HatcRoomCard);