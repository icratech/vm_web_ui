/* Data Exchange Server (DES) is a component of the Datacan Data2Desk (D2D) Platform.
License:

	[PROPER LEGALESE HERE...]

	INTERIM LICENSE DESCRIPTION:
	In spirit, this license:
	1. Allows <Third Party> to use, modify, and / or distributre this software in perpetuity so long as <Third Party> understands:
		a. The software is porvided as is without guarantee of additional support from DataCan in any form.
		b. The software is porvided as is without guarantee of exclusivity.

	2. Prohibits <Third Party> from taking any action which might interfere with DataCan's right to use, modify and / or distributre this software in perpetuity.
*/

const APP_VERSION = "0.0.0"
/* TODO : REPLACE WITH ENV VARIABLES FOR PRODUCTION *******************************/
const local = false
export const debugging = true
export const SERVER = ( local ? "://127.0.0.1:8007" : "://des1.data2desk.com" )
export const HTTP_SERVER = ( local ? `http${ SERVER }` : `https${ SERVER }` )
export const WS_SERVER = ( local ? `ws${ SERVER }` : `wss${ SERVER }` )


export const client_app = `client_app v${ APP_VERSION }`

export const MAPBOX_TOKEN =  'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
export const MAPBOX_STYLE = 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9'
/* TODO : END REPLACE WITH ENV VARIABLES FOR PRODUCTION *******************************/


