
// import { load_get_job_by_name } from "../../../lib/des_api"

// export const load = load_get_job_by_name

// import { JOBS_LOADED } from '../../../lib/des_api'
// import { redirect } from '@sveltejs/kit'
// import { get } from 'svelte/store'

export const load = async( loadEvent ) => {
    // console.log( "'/job/[slug]/page.js -> loadEvent.params.slug ", loadEvent.params.slug ) 
    // if( !get( JOBS_LOADED ) ) { throw redirect( 302, '/job'  ) }
    return { job_name: loadEvent.params.slug }
}