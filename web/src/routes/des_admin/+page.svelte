
<script>

    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import { getContext, onMount } from 'svelte'

    import { debugging } from '../../lib/des/app'
    import { routeFixer, debug } from '../../lib/des/utils'
    import { AUTH } from '../../lib/des/api'

    import { registerDevice } from '../../lib/c001v001/device'
    import { Job, getDESJobs } from '../../lib/c001v001/job'

    import DESAdminDeviceCard from './DESAdminDeviceCard.svelte'
    import DesAdminDeviceInfo from './DESAdminDeviceInfo.svelte'
    import DesAdminJobBadge from './DESAdminJobBadge.svelte'
    import DesAdminJobDbList from './DESAdminJobDBList.svelte'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'
    import SerialNumInput from '../../lib/des/components/SerialNumInput.svelte'
	import { each } from 'svelte/internal';
	import { validateSerialNumber } from '../../lib/des/device';

    $: DEVICES = getContext( 'devices' )
    $: DEVICES_LOADED = getContext( 'devices_loaded' )

    $: DES_JOBS = getContext( 'des_jobs' )
    $: DES_JOBS_LOADED = getContext( 'des_jobs_loaded' )

    $: showDevices = false
    $: showDatabases = true
    const clearShow = ( ) => {
        showDevices = false
        showDatabases = false
    }
    const showDeviceList = ( ) => { 
        clearShow( )
        showDevices = true
    }
    const showDatabaseList = async( ) => { 
        clearShow( )

        showDatabases = true
    }

    /* DEVICE */
    let serial
    const callRegisterDevice = async( ) => { 
        await registerDevice( serial )
        serial = null
    }
    const deviceSelected = ( d ) => { 
        goto( routeFixer( $page.url.pathname, 'device/', d.reg.des_dev_serial ) )
    }

    /* DATABASE */
    $: job = new Job( )
    $: job_title = ( job.reg.des_job_name !== "" ? job.reg.des_job_name : "Select a database to view table rows" )
    const jobSelected = async( j )=> { 
        // let x = $JOBS.filter( ( jb ) => { return jb.reg.des_job_name  == j.reg.des_job_name } )[0]
        await j.getJobData( )
        job = j
        tableSelected( "events" )
        // debug( "selected job: ", j )
    }

    $: tbl = [ ]
    $: cols = [ ]
    $: rows = [ ]
    const trueColor = 'bg-orange'
    const falseColor = 'bg-grey'
    let tblAdm = true
    let tblSta = false
    let tblHdr = false
    let tblCfg = false
    let tblEvt = false
    let tblSmp = false
    const clearTableSelection = ( ) => {
        tblAdm = false
        tblSta = false
        tblHdr = false
        tblCfg = false
        tblEvt = false
        tblSmp = false
        tbl = [ ]
        cols = [ ]
        rows = [ ]
    }
    const tableSelected = ( name ) => {
        clearTableSelection( )
        switch( name ) {

            case "admins": 
                tblAdm = true
                tbl = job.admins
                break
            case "states": 
                tblSta = true
                tbl = job.states
                break
            case "headers": 
                tblHdr = true
                tbl = job.headers
                break
            case "configs":
                tblCfg = true
                tbl = job.configs
                break
            case "events": 
                tblEvt = true
                tbl = job.events
                break
            case "samples":
                tblSmp = true
                tbl = job.samples
                break
        }
        getTblValues( )
    }
    const gettblColumns = ( row ) => {
        cols = [ ]
        for ( var col in row ) {
            if ( row.hasOwnProperty( col ) ) {
                cols.push( col ) // debug( "col: ", col )
            }
        }
    }
    const gettblRow = ( row ) => {
        let tblRow = [ ]
        for ( var i in cols ) {
            tblRow.push( row[ cols[ i ] ] )
        } //  debug( "tblRow: ", tblRow )
        return tblRow
    }
    const getTblValues = ( ) => {
        rows = [ ]
        gettblColumns( tbl[ 0 ] )
        for ( let i = 0; i < tbl.length; i++ ) {
            rows.push( gettblRow( tbl[ i ] ) )
        }
    }


    $: smpCount = ( job.samples !== null ? job.samples.length : 0 )
    $: smpFunc = ( job.samples !== null ? ( ) => { tableSelected( "samples" ) } : ( )=>{ } )

</script>

<dvi class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col status">

            <div class="flx-row title">
                <h1>DES ADMIN</h1>
                { #if showDevices }
                <div class="flx-row selector">
                    <div class="flx-row op-lbl">Show Database List</div>
                    <PillButton cls='bg-accent' on:click={ showDatabaseList } hint={ null } />
                </div>
                { :else if showDatabases }
                <div class="flx-row selector">
                    <div class="flx-row op-lbl">Show Device List</div>
                    <PillButton cls='bg-accent' on:click={ showDeviceList } hint={ null } />
                </div>
                { /if }
            </div>
            
            { #if showDevices }
            <div class="flx-col select-list">
                <div class="flx-row"><h3>ADD A DEVICE</h3></div>
                <div class="flx-row register">
                    <PillButton cls='bg-accent' on:click={ callRegisterDevice } hint={ null } />
                    <div class="flx-col input-container">
                        <SerialNumInput 
                            enabled ={ debugging }
                            bind:txt={ serial }
                            place="Enter a serial # and click the circle over there." 
                            
                            /> 
                    </div>
                </div>
                { #each $DEVICES as device, index ( index ) }
                    <DesAdminDeviceInfo bind:device on:device-selected={ ( e ) => { deviceSelected( e.detail ) } } />
                { /each }
            </div>
            { :else if showDatabases }
            <div class="flx-col select-list">
                <div class="flx-row"><h3>DATABASES</h3></div>
                { #each $DES_JOBS as job, index ( index ) }
                    <DesAdminJobBadge bind:job on:job-selected={ ( e ) => { jobSelected( e.detail ) } }/>
                { /each }
            </div>
            { /if }

        </div>

        <div class="flx-col panel">

            { #if showDevices }
            <div class="flx-col select-list">
                { #each $DEVICES as device, index ( index ) }
                    <DESAdminDeviceCard bind:device on:device-selected={ ( e ) => { deviceSelected( e.detail ) } } />
                { /each }
            </div>
            { :else if showDatabases }

            <div class="flx-row"><h3>{ job_title }</h3></div>

            <div class="flx-row tbl-container">

                <div class="flx-col tbl-menu">
                    
                    <div class="flx-row tlb-selector"><PillButton 
                        on:click={ ( ) => { tableSelected( "admins" ) } }
                        cls={ ( tblAdm ? trueColor : falseColor ) }
                        />ADMINS : { job.admins.length }</div>
                
                    <div class="flx-row tlb-selector"><PillButton 
                        on:click={ ( ) => { tableSelected( "states" ) } }
                        cls={ ( tblSta ? trueColor : falseColor ) }
                        />STATES : { job.states.length }</div>
                
                    <div class="flx-row tlb-selector"><PillButton 
                        on:click={ ( ) => { tableSelected( "headers" ) } }
                        cls={ ( tblHdr ? trueColor : falseColor ) }
                        />HEADERS : { job.headers.length }</div>
        
                    <div class="flx-row tlb-selector"><PillButton 
                        on:click={ ( ) => { tableSelected( "configs" ) } }
                        cls={ ( tblCfg ? trueColor : falseColor ) }
                        />CONFIGS : { job.configs.length }</div>
                                    
                    <div class="flx-row tlb-selector"><PillButton 
                        on:click={ ( ) => { tableSelected( "events" ) } }
                        cls={ ( tblEvt ? trueColor : falseColor ) }
                        />EVENTS : { job.events.length }</div>

                    <div class="flx-row tlb-selector"><PillButton 
                        on:click={ smpFunc }
                        cls={ ( tblSmp ? trueColor : falseColor ) }
                        />SAMPLES : { smpCount }</div>
                        
                    <!-- <div class="flx-row tlb-selector"><PillButton 
                        />REPORTS : { job.reports.length }</div> -->
                        
                </div>

                <div class="flx-col tbl-rows">
                    <div class="flx-row">
                        { #each cols as col, index ( index ) }
                            <div class="flx-row tbl-cell col-hdr">{ col.slice( 4, ) }</div>
                        { /each }
                    </div>
                    { #each rows as row, index ( index ) }
                    <div class="flx-row">
                        { #each row as val, index ( index ) }
                        <div class="flx-row tbl-cell ">{ val }</div>
                        { /each }
                    </div>
                    { /each }
                </div>

            </div>

            { /if }


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
    
    .status {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        max-width: 25%;
        min-width: 25%;
        width: 25%;
        height: 100%;
        padding: 0.5em 1em;
    }
    .title {
        justify-content: space-between;
        padding-bottom: 1em;
    }
    .selector {
        justify-content: flex-end;
        align-items: center;
        width: auto;
    }
    .op-lbl {
        align-items: center;
        width: auto;
    }
    .register {
        align-items: center;
        gap: 0.75em;
    }

    .panel {
        padding: 0;
        height: auto;
        gap: 0.5em;
    }

    .select-list {
        overflow-x: visible;
        overflow-y: auto;
        padding: 1em;
        width: 100%;
        height: 100%;
    }

    .tbl-container {
        height: 100%;
    }
    .tbl-menu {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        max-width: 13em;
        min-width: 13em;
        width: 13em;
        height: 100%;
        padding:1em;
    }
    .tlb-selector {
        /* justify-content: flex-end; */
        align-items: center;
        width: auto;
    }
    .tbl-rows {
        overflow: auto;
        gap: 0.5em;
    }
    .col-hdr {
        font-weight: 500;
        color: var(--orange_07);
    }
    .tbl-cell {
        font-size: 0.85em;
        max-width: 6em;
        min-width: 6em;
        width: 6em;
        padding-bottom: 0.25em;
        padding-right: 0;
    }
    .input-container {
        gap: 0.25rem;
    }


</style>