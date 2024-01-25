
<script>

    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import { getContext, onMount } from 'svelte'

    import { routeFixer, debug, ALERT_CODES, alert } from '../../lib/des/utils'
    import { DESSearchParam } from '../../lib/des/api'
    
    import JobSearch from './JobSearch.svelte'
    import JobCard from './JobCard.svelte'
	import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputFile from '../../lib/common/input_file/InputFile.svelte'
    import btn_img_upload from "$lib/images/btn-img-collapse-pink.svg"

    $: JOBS = getContext( 'jobs' )

    let input_job_data
    onMount( ( ) => { 
        input_job_data = document.getElementById( 'input_job_data' )
    } )

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
        goto( routeFixer( $page.url.pathname, 'job/', j.reg.des_job_name ) )
    }

    const uploadJobData = async( input ) => {
        debug( "uploadJobData( ): ", input.files.length )
        if ( input.files.length == 6 ) {
            let formData = new FormData( )
            for ( let i = 0; i < input.files.length; i++ ) {
                let f = input.files[ i ]
                debug( "uploadJobData( ): ", f.name.split('.')[0] ) 
                formData.append( f.name.split('.')[0], f ) 
            }
            debug( "uploadJobData( ): ", formData ) 
        } else {
            /* TODO: ACTUAL VALIDATION */
            alert( ALERT_CODES.ERROR, "Invalid file count" )
        }
    }

</script>

<InputFile id="input_job_data" 
    func={ async( )=> { await uploadJobData( input_job_data ) } }
    accept=".json" 
/>
<dvi class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col search">
            <JobSearch bind:search />
        </div>

        <div class="flx-col content">

            <div class="flx-row btns">
                <PillButton img={ btn_img_upload } hint={ null } on:click={ input_job_data.click( ) }/>
                <h4>Upload Job Data</h4>
            </div>

            <div class="flx-col job-list">
                { #each $JOBS.filter( j => {  return  checkBounds( j ) && checkTextFilter( j, search ) } ) as job, index ( index ) }
                    <JobCard bind:job on:job-selected={ ( e ) => { jobSelected( e.detail ) } }/>
                { /each }
            </div>
        </div>

    </div>

</dvi>  

<style>

    .container {
        overflow: hidden;
        height: 100%;
        gap: 1rem;
    }

    .content { height: 100%; }

    .search {
        max-width: 25%;
        min-width: 25%;
        width: auto;
        padding: 0;
    }

    .btns {
        align-items: center;
        gap: 0.5em;
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
@media(max-width: 1100px) {

    .content { padding-right: 1em; }
    .search {
        max-width: 50%;
        min-width: 50%;
        padding-right: 0.5em; 
    }
    
    .job-list { 
        padding: 0 0.5em; 
        overflow-x: hidden;
    }
}

/* MOBILE */
@media(max-width: 450px) {

    .content { 
        flex-direction: column; 
        padding-right: 0.5em; 
    }
    .search { 
        /* max-height: 37.5em; */
        /* min-height: 37.5em; */
        max-width: 100%;
        min-width: 100%;
    }
}
</style>