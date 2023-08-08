// import { REQUEST_GET_JOBS } from "$lib/server_routes"
// import { error } from '@sveltejs/kit'

// export const load = async( { params } ) => {
//     let res = await fetch( REQUEST_GET_JOBS )
//     let txt = await res.text( ) 
//     let jobs = await JSON.parse( txt )
//     let job = jobs.find( job => job.des_reg.des_job_name === params.slug )

//     if ( !job ) throw error( 404, 'Job not found...' )

//     return { job }
// }