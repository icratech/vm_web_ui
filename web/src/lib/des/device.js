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

import { HTTP_SERVER } from './app'
import { ALERT_CODES, alert, debug } from './utils'
import { postRequestAuth } from './api'

export const API_URL_DEVICE_VALIDATE_SERIAL =  `${ HTTP_SERVER }/api/device/validate_serial`

export const validateSerialNumber = async( serial ) => {
    let err = null
    serial = formatSerialNumber( serial )

    // let list = await getAllSerialNumbers( ) // debug( "list: ",  list )
    // let dup = list.map( sn => sn === serial )[ 0 ] // debug( "dup: ",  dup )
    // if ( dup ) err = "Duplicate serial number."

    let res = await postRequestAuth( API_URL_DEVICE_VALIDATE_SERIAL, serial )
    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    
    err = res.err

    return { err, serial }
}

 /* WE ACCEPT UPTO 10, ALPHANUMERIC, UPPERCASE CHARACTERS */
export const formatSerialNumber = ( txt ) => { 

    if ( txt !== "" && txt !== null & txt !== undefined ) {
            
        let output = ""
        for ( let i = 0; i < ( txt.length > 10 ? 10 : txt.length ); i++ ) // UPTO 10
            if ( txt[ i ].match( /^[\w]+$/ ) ) // ALPHANUMERIC 
                output += txt[ i ]
        
        txt = output.toUpperCase( ) // UPPERCASE
    }
    return txt
}

/* NOT IMPLEMENTED */
export const removeDevice = async( serial ) => {

    /* 
    GET 
    DELETE 
        JobSearches ( des_job_searches.des_job_key = des_jobs.des_job_id )
        Jobs ( des_jobs.des_job_dev_id = des_devs.des_dev_id )
        Device 
    */

}

/* USED TO VALIDATE MEASURED VALUES RECEIVED FROM THE DEVICE
    WHERE THE VALUE IS ONE OF THE ERROR VALUES, NULL IS RETURNED 
    - VALUE -999.25 => 'NOT MEASURED ( INTENTIONALLY )'
    - VALUE -9999.25 => 'MEASUREMENT FAILED'
*/
export const validateMeasuredValue = ( val ) => {
    val = ( val === -999.25 || val === -9999.25 ? null : val )
    return val
}

