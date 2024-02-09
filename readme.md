# HATC-GAUGE-CARD

## Installation

Se rendre sur HACS, puis dépôt personnalisé ajouter https://github.com/tagcashdev/hatc-room-card au Dépot et choisir catégorie Lovelace

![Dépots personnalisé](https://github.com/tagcashdev/hatc-gauge-card/blob/main/img/installation.png)

Puis appuyer sur le bouton (+ Explorer et télécharger des dépôts), chercher HATC et installer.
Enjoy !

## Description

Carte personnalisée pour lovelace qui peut être utilisée comme carte ou élément dans une carte button-card par example.

### Fonctionnalité futures
- ... 

### Fonctionnalité futures (peut-être)
- ...

***
Merci de soutenir mon travail en téléchargeant cette carte personnalisé !
Si vous aimez mon travail likez, abonnez-vous au repo :) Et si vous souhaitez contribuer aux nombreux café que je consomme vous pouvez m'offrir 1 ct ou plus grâce à ce lien : https://www.paypal.me/tagcash
***

#### Options
| Name | Type | Requis | Default | Description | Options |
| ---- | ---- | ------ | ------- | ----------- | ------- |
| type | string | **Obligatoire** | - | `custom:hatc-room-card` | - |
| entities | string | **Obligatoire** | - | ... | - |

## Examples

#### Minimum

```yaml
type: custom:hatc-room-card
entities:
  - entity: sensor.fibaro_fenetre_porte_salon_access_control_door_state
```
![Minimum](https://github.com/tagcashdev/hatc-gauge-card/blob/main/img/minimum.png)

#### Default

```yaml
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
```