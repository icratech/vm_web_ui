// export const ssr = false

import { JOBS_LOADED, debug } from '../../../lib/des_api'
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'

export const load = async( loadEvent ) => {
    debug( "'/job/[slug]/page.js -> loadEvent.params.slug ", loadEvent.params.slug ) 
    if( !get( JOBS_LOADED ) ) { throw redirect( 302, '/job'  ) }
    return { job_name: loadEvent.params.slug }
}