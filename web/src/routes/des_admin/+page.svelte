
<script>

    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import { getContext, onMount } from 'svelte'

    import { debugging } from '../../lib/des/app'
    import { routeFixer, debug } from '../../lib/des/utils'
    import { DESSearchParam } from '../../lib/des/api'

    import { registerDevice } from '../../lib/c001v001/device'
    import { Job, getDESJobs } from '../../lib/c001v001/job'

    import DESAdminDeviceCard from './DESAdminDeviceCard.svelte'
    import DesAdminDeviceInfo from './DESAdminDeviceInfo.svelte'
    import DesAdminJobBadge from './DESAdminJobBadge.svelte'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'
    import SerialNumInput from '../../lib/des/components/SerialNumInput.svelte'

    import btn_img_add from "$lib/images/btn-img-add-orange.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_reset from "$lib/images/btn-img-reset-aqua.svg"

    $: DEVICES = getContext( 'devices' )
    // $: DEVICES_LOADED = getContext( 'devices_loaded' )

    $: DES_JOBS = getContext( 'des_jobs' )
    // $: DES_JOBS_LOADED = getContext( 'des_jobs_loaded' )

    onMount( async( ) => {
        await getDESJobs( )
        resetJobSearch( )
    } )

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

    let search = new DESSearchParam( )


    /* DEVICE */
    let serial
    $: addingDevice = false
    const callRegisterDevice = async( ) => { 
        await registerDevice( serial )
        addingDevice = false
        serial = null
        resetDeviceSearch( )
    }
    const deviceSelected = ( d ) => { 
        goto( routeFixer( $page.url.pathname, 'device/', d.reg.des_dev_serial ) )
    }
    const resetDeviceSearch = ( ) => {
        search = new DESSearchParam( )
        filterDeviceList( )
    }
    const checkDeviceTextFilter = ( d, s ) => {
        let txtFilter = ( 
            d.reg.des_dev_serial.toUpperCase( ).includes( s.token.toUpperCase( ) ) 
            /* OTHER STUFF ...*/
        )
        return txtFilter
    }
    const filterDeviceList = ( ) => {
        search.token = search.token
    }

    /* DATABASE */
    $: jobType = 0
    const setJobType = ( i ) => {
        jobType = i
        debug( "jobType: ", i )
        filterJobList( )
    }
    const resetJobSearch = ( ) => {
        clearTableSelection( )
        search = new DESSearchParam( )
        job = new Job( )
        jobType = 0
        filterJobList( )
    }
    const checkJobTextFilter = ( j, s ) => {
        let stat = JSON.parse(j.reg.des_job_json) // debug( "des_admin/+page.svelte -> checkTextFilter( ): ", stat )

        let txtFilter = ( 
            j.reg.des_dev_serial.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_co.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_name.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_sf_loc.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_bh_loc.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            stat.hdr.hdr_well_lic.toUpperCase( ).includes( s.token.toUpperCase( ) ) 
        )

        let cmdFilter = j.reg.des_job_name.includes( 'CMDARCHIVE' )

        let filters = j
        switch ( jobType ) {

            case 0: // INCLUDE CMDARCHIVES 
                filters = txtFilter
                break
            
            case 1: // EXCLUDE CMDARCIVES
                filters = !cmdFilter && txtFilter 
                break
            
            case 2: // ONLY SEARCH CMDARCHIVES
                filters = cmdFilter && txtFilter 
                break   
        }

        return filters
    }
    const filterJobList = ( ) => {
        clearTableSelection( )
        search.token = search.token
        // filteredJobList = $DES_JOBS.filter( j => { return checkJobTextFilter( j, search ) } )
    }


    $: job = new Job( )
    $: job_title = (  job.reg.des_job_name !== "" ? job.reg.des_job_name : "Select a database to view table rows" )
    const jobSelected = async( j )=> { 
        await j.getJobData( )
        job = j
        // orderDesc = false
        clearTableSelection( )
        tblSta = true
        tbl = job.states
        sortFunc = ( a, b ) => { return b.sta_time - a.sta_time }
        getTblValues( )
    }

    $: tbl = [ ]
    $: cols = [ ]
    $: rows = [ ]
    const trueColor = 'bg-orange'
    const falseColor = 'bg-grey'
    let tblAdm = false
    let tblSta = true
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
    const tableSelected = ( tblSelected, name ) => {
        if (  job.reg.des_job_name !== "" ) {
            
            if ( tblSelected ) { //debug( "toggle ", orderDesc )
                orderDesc = !orderDesc
            }

            clearTableSelection( )
            switch( name ) {

                case "admins": 
                    tblAdm = true
                    tbl = job.admins
                    sortFunc = ( a, b ) => { return b.adm_time - a.adm_time }
                    break
                case "states": 
                    tblSta = true
                    tbl = job.states
                    sortFunc = ( a, b ) => { return b.sta_time - a.sta_time }
                    break
                case "headers": 
                    tblHdr = true
                    tbl = job.headers
                    sortFunc = ( a, b ) => { return b.hdr_time - a.hdr_time }
                    break
                case "configs":
                    tblCfg = true
                    tbl = job.configs
                    sortFunc = ( a, b ) => { return b.cfg_time - a.cfg_time }
                    break
                case "events": 
                    tblEvt = true
                    tbl = job.events
                    sortFunc = ( a, b ) => { return b.evt_time - a.evt_time }
                    break
                case "samples":
                    tblSmp = true
                    tbl = job.samples
                    sortFunc = ( a, b ) => { return b.smp_time - a.smp_time }
                    break
            }

            getTblValues( )
        }
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
    let orderDesc = false
    let arrStyle = `style="font-size: 1.5em; color: var(--orange);"`
    let uarr = `<span ${ arrStyle }>&uarr;</span>`
    let darr = `<span ${ arrStyle }>&darr;</span>`
    $: symbol = ( orderDesc ? uarr : darr ) 

    let sortFunc = ( ) => { }
    const getTblValues = ( ) => {
        rows = [ ]
        if ( tbl && tbl.length > 0 ) {

            let data = [ ]
            if ( orderDesc ) {
                data = tbl.slice( tbl.length - 1000, ).sort( sortFunc )
            } else {
                data = tbl.slice( tbl.length - 1000 )
            }

            gettblColumns( data[ 0 ] )
            for ( let i = 0; i < data.length; i++ ) {
                rows.push( gettblRow( data[ i ] ) )
            }
        }
    }

    $: admCount = ( job.admins !== null ? job.admins.length : 0 )
    $: admFunc = ( job.admins !== null ? ( ) => { tableSelected( tblAdm, "admins" ) } : ( )=>{ } )

    $: staCount = ( job.states !== null ? job.states.length : 0 )
    $: staFunc = ( job.states !== null ? ( ) => { tableSelected( tblSta, "states" ) } : ( )=>{ } )

    $: hdrCount = ( job.headers !== null ? job.headers.length : 0 )
    $: hdrFunc = ( job.headers !== null ? ( ) => { tableSelected( tblHdr, "headers" ) } : ( )=>{ } )

    $: cfgCount = ( job.configs !== null ? job.configs.length : 0 )
    $: cfgFunc = ( job.configs !== null ? ( ) => { tableSelected( tblCfg, "configs" ) } : ( )=>{ } )

    $: evtCount = ( job.events !== null ? job.events.length : 0 )
    $: evtFunc = ( job.events !== null ? ( ) => { tableSelected( tblEvt, "events" ) } : ( )=>{ } )

    $: smpCount = ( job.samples !== null ? job.samples.length : 0 )
    $: smpFunc = ( job.samples !== null ? ( ) => { tableSelected( tblSmp, "samples" ) } : ( )=>{ } )



</script>

<dvi class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col status">

            <div class="flx-row title">
                <h1>DES ADMIN</h1>
                <div class="flx-row rad">
                    <div class="flx-row rad-btn { ( !showDevices ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ showDatabaseList } on:keyup>DATABASES</div>
                    <div class="flx-row rad-btn { ( !showDatabases ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ showDeviceList } on:keyup>DEVICES</div>
                </div>
            </div>
            
            { #if showDevices }

                
                <div class="flx-row input-row">
                    { #if addingDevice }
                    <PillButton img={ btn_img_cancel } hint={ null } on:click={ ( ) => { addingDevice = false; serial = null; } } />
                    <PillButton img={ btn_img_confirm } hint={ null } on:click={ callRegisterDevice } />
                    <SerialNumInput enabled={ true } bind:txt={ serial } place="Enter a serial # and click confirm." /> 
                    { :else }
                    <PillButton img={ btn_img_add } hint={ null } on:click={ addingDevice = true } />
                    <div class="flx-row" style="align-items: center;"><h4>ADD A DEVICE</h4></div>
                    { /if }
                </div>

                <div class="flx-row"><h4>SEARCH DEVICES</h4></div>
                <div class="flx-row input-row">
                    <PillButton img={ btn_img_reset } hint={ 'Reset filters' } on:click={ resetDeviceSearch } />
                    <InputText enabled={ true } bind:txt={ search.token } place="Search by serial #"/>
                </div>
                <div class="flx-col select-list">
                    { #each $DEVICES.filter( d => { return checkDeviceTextFilter( d, search ) } ) as device, index ( index ) }
                        <DesAdminDeviceInfo bind:device on:device-selected={ ( e ) => { deviceSelected( e.detail ) } } />
                    { /each }
                </div>
            { :else if showDatabases }
            <div class="flx-row"><h4>SEARCH DATABASES</h4></div>
            <div class="flx-row input-row">
                <PillButton img={ btn_img_reset } hint={ 'Reset filters' } on:click={ resetJobSearch } />
                <InputText enabled={ true } bind:txt={ search.token } place="Search text"/>
            </div>
            <div class="flx-row rad">
                <div class="flx-row rad-btn { ( jobType == 0 ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ ( ) => { setJobType( 0 ) } } on:keyup>ALL</div>
                <div class="flx-row rad-btn { ( jobType == 1 ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ ( ) => { setJobType( 1 ) } } on:keyup>! CMD</div>
                <div class="flx-row rad-btn { ( jobType == 2 ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ ( ) => { setJobType( 2 ) } } on:keyup>CMD</div>
            </div>
            <div class="flx-col select-list">
                <!-- <div class="flx-row"><h3>DATABASES</h3></div> -->
                { #each $DES_JOBS.filter( j => { return checkJobTextFilter( j, search ) } ) as job, index ( index ) }
                    <DesAdminJobBadge bind:job on:job-selected={ ( e ) => { jobSelected( e.detail ) } }/>
                { /each }
            </div>
            { /if }

        </div>

        <div class="flx-col panel">

            { #if showDevices }
            <div class="flx-col select-list">
                { #each $DEVICES.filter( d => { return checkDeviceTextFilter( d, search ) } ) as device, index ( index ) }
                    <DESAdminDeviceCard bind:device on:device-selected={ ( e ) => { deviceSelected( e.detail ) } } />
                { /each }
            </div>
            { :else if showDatabases }

            <div class="flx-col tbl-layout">

                <div class="flx-row"><h3>{ job_title }</h3></div>

                <div class="flx-row db-container">

                    <div class="flx-col tbl-menu">
                        
                        <div class="flx-row tlb-selector">
                            <div class="flx-row rad-btn { ( tblAdm ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ admFunc } on:keyup>ADMINS</div>
                            <div class="tbl-row-count">{ admCount }</div>
                            </div>
                    
                        <div class="flx-row tlb-selector">
                            <div class="flx-row rad-btn { ( tblSta ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ staFunc } on:keyup>STATES</div>
                            <div class="tbl-row-count">{ staCount }</div>
                        </div>
                    
                        <div class="flx-row tlb-selector">
                            <div class="flx-row rad-btn { ( tblHdr ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ hdrFunc } on:keyup>HEADERS</div>
                            <div class="tbl-row-count">{ hdrCount }</div>
                        </div>
            
                        <div class="flx-row tlb-selector">
                            <div class="flx-row rad-btn { ( tblCfg ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ cfgFunc } on:keyup>CONFIGS</div>
                            <div class="tbl-row-count">{ cfgCount }</div>
                        </div>
                                        
                        <div class="flx-row tlb-selector">
                            <div class="flx-row rad-btn { ( tblEvt ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ evtFunc } on:keyup>EVENTS</div>
                            <div class="tbl-row-count">{ evtCount }</div>
                        </div>

                        <div class="flx-row tlb-selector">
                            <div class="flx-row rad-btn { ( tblSmp ? 'fg-orange rad-btn-select' : 'fg-grey' ) }" on:click={ smpFunc } on:keyup>SAMPLES</div>
                            <div class="tbl-row-count">{ smpCount }</div>
                        </div>
                            
                        <!-- <div class="flx-row tlb-selector"><PillButton 
                            />REPORTS : { job.reports.length }</div> -->
                            
                    </div>

                    <div class="flx-col tbl-container">
                        <table>
                            <thead>
                                <tr>
                                    { #each cols as col, index ( index ) }
                                        <!-- { debug( "index: ", index ) } -->
                                        <th on:keydown on:click={ ( ) => { 
                                            if ( index == 0 ) {
                                                orderDesc = ! orderDesc
                                                getTblValues( )
                                            } 
                                        } }>
                                            { ( col.slice( 4, ) ).replace( '_', ' ').toUpperCase( ) } 
                                            { #if index == 0 } { @html symbol } { /if }
                                        </th>
                                    { /each }
                                </tr>
                            </thead>
                            <tbody >
                                    { #each rows as row, index ( index ) }
                                        <tr>
                                            { #each row as val, index ( index ) }
                                            <td>{ val }</td>
                                            { /each }
                                        </tr>
                                    { /each }
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            { /if }


        </div>


    </div>

</dvi>


<style>
    .container {
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
        gap: 0.75em;
    }
    .title {
        justify-content: space-between;
        padding-bottom: 1em;
    }

    .input-row {
        gap: 0.75em;
    }
    .panel {
        overflow: hidden;
        padding: 0;
        height: 100%;
        gap: 0.5em;
    }
    .rad {
        justify-content: flex-end;
        width: auto;
    }
    .rad-btn {
        border: solid 0.1em var(--light_02);
        background-color: var(--light_005);
        border-radius: 0.25em;
        justify-content: center;
        align-items: center;
        height: 2em;
        min-width: 7em;
        max-width: 7em;
        gap: 0.5em;
    }
    .rad-btn-select {
        border: solid 0.1em var(--orange_03);
        background-color: var(--orange_01);
    }

    .select-list {
        overflow-y: auto;
        padding: 1em;
        padding-top: 0;
        width: 100%;
        height: 100%;
    }

    .db-container {
        overflow: hidden;
        height: 100%;
    }

    .tbl-menu {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        width: auto;
        height: 100%;
        padding:1em;
    }
    .tlb-selector {
        justify-content: space-between;
        align-items: center;
        gap: 1em;
    }
    .tbl-row-count {
        width: auto;
        font-size: 0.9em;
        color: var(--aqua_07);
    }

    .tbl-layout {
        overflow: hidden;
        height: 100%;
    }

    .tbl-container {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .tbl-container thead, th {
        color: var(--aqua_05);
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: rgb(7, 33, 33, 0.7);
    }
    table, th, td {
        text-align: center;
        border-collapse: collapse;
        white-space: nowrap;
        text-align: left;
        padding: 0.75em;
    }
    .tbl-container th, td {
        border-left: 0.1em solid var(--orange_03);
    }
    .tbl-container thead:first-child, th:first-child, td:first-child {
		border-left: none;
	}
    .tbl-container tr:nth-child(even) {
        background-color:  var(--light_005);
    }

</style>