
export const ssr = false

import { DEVICES_LOADED, DEVICES } from '../../../lib/des_api'
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'


export const load = async( loadEvent ) => {
    console.log( "'/device/[slug]/page.js -> loadEvent.params.slug ", loadEvent.params.slug ) 
    if( !get( DEVICES_LOADED ) ) { throw redirect( 302, '/device'  ) }
    return { serial: loadEvent.params.slug }
}