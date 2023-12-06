
<script>

    import { goto } from '$app/navigation'

    import { getContext } from 'svelte'
    import { DESSearchParam, updateJobsStore, debug } from '../../lib/des_api'

    import JobSearch from './JobSearch.svelte'
    import JobCard from './JobCard.svelte'

    $: JOBS = getContext( 'jobs' )
    $: search = new DESSearchParam( )

    const checkBounds = ( j ) => { 
        return ( 
            j.reg.des_job_lng >= search.lng_min &&  j.reg.des_job_lng <= search.lng_max && 
            j.reg.des_job_lat >= search.lat_min &&  j.reg.des_job_lat <= search.lat_max 
        )
    }
    const checkTextFilter = ( j, s ) => {
        let stat = JSON.parse(j.reg.des_job_json)
        return (
            j.reg.des_dev_serial.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_co.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_name.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_sf_loc.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_bh_loc.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_lic.toUpperCase( ).includes( s.token.toUpperCase( ) )
        )
    }
    
    const jobSelected = ( j ) => { 
        goto( `job/${ j.reg.des_job_name }` )
    }

</script>

<dvi class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col search">
            <JobSearch bind:search on:filter={ ( ) => { updateJobsStore( ) } } />
        </div>

        <div class="flx-col job-list">
            { #each $JOBS.filter( j => {  return  checkBounds( j ) && checkTextFilter( j, search ) } ) as job ( job.reg.des_job_name ) }
                <JobCard bind:job={ job } on:job-selected={ ( e ) => { jobSelected( e.detail ) } }/>
            { /each }
        </div>

    </div>

</dvi>  

<style>

    .container {
        overflow: hidden;
        height: 100%;
        gap: 1rem;
    }

    .content { 
        height: 100%;
    }

    .search {
        max-width: 25%;
        min-width: 25%;
        width: auto;
        padding: 0;
    }

    .job-list {
        overflow-y: auto;
        padding: 0 1em;
    }

/* LAP TOP */
@media(max-width: 1440px) {
    .content { padding-left: 0; }
    .search {
        max-width: 33%;
        min-width: 33%;
    }
    .job-list { padding-left: 0; }
}

/* TABLET */
@media(max-width: 1024px) {

    .content { padding-right: 1em; }
    .search {
        max-width: 45%;
        min-width: 45%;
        padding-right: 0.5em; 
    }
    
    .job-list { 
        padding: 0 0.5em; 
        overflow-x: hidden;
    }
}

/* MOBILE */
@media(max-width: 425px) {

    .content { 
        flex-direction: column; 
        padding-right: 0.5em; 
    }
    .search { 
        max-height: 30em;
        min-height: 30em;
        max-width: 100%;
        min-width: 100%;
    }
}
</style>