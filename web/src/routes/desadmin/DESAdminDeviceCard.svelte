<script>

    // import Prism from 'prismjs'  // npm install prismjs // npm install @types/prismjs
    import { JsonView } from '@zerodevx/svelte-json-view' // npm install @zerodevx/svelte-json-view

    import { debugging } from '../../lib/des/app'
    import { DESError } from '../../lib/des/api'
    import { debug, ALERT_CODES, alert } from '../../lib/des/utils'

    import { Device } from "../../lib/c001v001/device"
    import { device_class, device_version } from '../../lib/c001v001/models'
    
    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import DESAdminDeviceInfo from "./DESAdminDeviceInfo.svelte"
    import DesErrorBadge from './DESErrorBadge.svelte'
    
    import btn_img_cmd_red from "$lib/images/btn-img-cmd-red.svg"
    import btn_img_cmd_orange from "$lib/images/btn-img-cmd-orange.svg"
    import btn_img_cmd_yellow from "$lib/images/btn-img-cmd-yellow.svg"
    import btn_img_cmd_green from "$lib/images/btn-img-cmd-green.svg"
    import btn_img_cmd_aqua from "$lib/images/btn-img-cmd-aqua.svg"
    import btn_img_cmd_blue from "$lib/images/btn-img-cmd-blue.svg"
    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_collapse from "$lib/images/btn-img-collapse-aqua.svg"

    import btn_img_reset from "$lib/images/btn-img-reset-grey.svg"

    import btn_img_files from "$lib/images/btn-img-cmd-orange.svg"
    import btn_img_status from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_start from "$lib/images/btn-img-start-green.svg"
    import btn_img_stop from "$lib/images/btn-img-stop-red.svg"

    export let device = new Device( )

    const downloadDeviceFiles = async( ) => {
        let files = await device.getDeviceFiles( )
        debug( "DESAdminDeviceCMD.svelte -> downloadDeviceFiles( ) -> FILES: ", files )
        await jsonDownload( files.adm, "adm" )
        await jsonDownload( files.sta, "sta" )
        await jsonDownload( files.hdr, "hdr" )
        await jsonDownload( files.cfg, "cfg" )
        await jsonDownload( files.evt, "evt" )
    }

    /* JSON FILE -> DOWNLOAD & SAVE */
    const jsonDownload = async( obj, name ) => {

        let file = `[${ JSON.stringify( obj ) }]`
        let blob = new Blob( [ file ], { type: 'data:text/json; charset=utf-8;' } )
        let fileName = `${ name }.json`
        let saveOptions = { description: "JSON", accept: { "tex/plain" : [ ".json" ] } }

        await saveBlobToFile( blob, fileName, saveOptions )
    }
    /* JSON -> SAVE */
    const saveBlobToFile = async( blob, fileName, saveOptions ) => {

        if ( window.navigator && window.navigator.msSaveOrOpenBlob ) {

            window.navigator.msSaveOrOpenBlob( blob )

        } else {

            /* SAVE IN DEFAULT DOWNLOADS FOLDER */
            const url = window.URL.createObjectURL( blob )
            let link = document.createElement( 'a' )
            link.href = url
            link.download = fileName
            link.target="_blank"
            link.click( )

            // For Firefox it is necessary to delay revoking the ObjectURL.
            setTimeout( ( ) => { window.URL.revokeObjectURL( url ) }, 250)

        }
    }

    $: DESDevConnColor = 'bg-yellow' 
    $: DESDevConnHint = `Refresh DES subscriptions to ${ device_class }/${ device_version }/${ device.reg.des_dev_serial }/sig/...`
    $: DESDevConnImage = btn_img_reset 
    const DESDevConnFucn = ( ) => { 
        device.des_ping.time = 0
        device.des_ping.ok = false
        device.refreshDESClient( )
    }
    $: {
        if ( !device.des_ping.ok ) { 
            DESDevConnColor = 'bg-yellow' 
            DESDevConnHint = `DES subscribing to ${ device_class }/${ device_version }/${ device.reg.des_dev_serial }/sig/...`
            DESDevConnImage = btn_img_cmd_yellow
        } else { 
            DESDevConnColor = 'bg-grey' 
            DESDevConnHint = `Refresh DES subscriptions to ${ device_class }/${ device_version }/${ device.reg.des_dev_serial }/sig/...`
            DESDevConnImage = btn_img_reset
        }
    }

    $: errorLog = false
    $: errorLogButton = ( errorLog ? btn_img_collapse : btn_img_cmd_yellow )
    $: errorLogText = ( errorLog ? "Hide Log" : "Show Log" )
    $: errorCSS = ( errorLog ? "errlog-show" : "errlog-hide" )
    $: errorLogFunc = async( ) => {
        if ( errorLog ) {
            errorLog = false
        } else { 
            await device.qryDESErrorLog( )
            errorLog = true
        }
    }
    $: errorSelected = new DESError( )
    $: json = ( errorSelected.des_err_json == null ? null : JSON.parse( errorSelected.des_err_json ) )
</script>


<div class="flx-col container">
    <div class="flx-row controls">

        <div class="flx-col">
            <DESAdminDeviceInfo bind:device />
                
            <div class="flx-row field" style="margin-top: -2.5em;">
                <div class="flx-row field-name">Firmware</div>
                <div class="vert-line"/>

                <div class="flx-row fw">
                    <div class="flx-row fw-sub-l">
                        <div class="flx-row field-sub">Logger</div>
                        <div class="flx-row field-value">{ device.sta.sta_log_fw }</div>
                    </div>

                    <div class="flx-row fw-sub-r">
                        <div class="flx-row field-sub">Modem</div>
                        <div class="flx-row field-value">{ device.sta.sta_mod_fw }</div>
                    </div>
                </div>
            </div>

            <div class="flx-row field">
                <div class="flx-row field-name"><PillButton img={ DESDevConnImage } on:click={ DESDevConnFucn } /></div>
                <div class="vert-line"/>
                <div class="flx-row fw-sub-l">{ DESDevConnHint }</div>
            </div>

        </div>

        <div class="flx-col cmd-block">

            <div class="flx-row cmd">
                <PillButton img={ btn_img_files } on:click={ downloadDeviceFiles } />
                <p>Download device initialization files to default downloads folder</p>
            </div>

            <div class="flx-row cmd">
                <PillButton img={ btn_img_status } on:click={ device.getReport } />
                <p>Request device status report: Admin, State, Header, Config</p>
            </div>

            <div class="flx-row cmd">
                <PillButton img={ btn_img_start } on:click={ device.startJob } />
                <p>Start a job with a glaring indifference to the current device state</p>
            </div>

            <div class="flx-row cmd">
                <PillButton img={ btn_img_stop } on:click={ device.endJob } />
                <p>End a job with an unabashed disregard for the current device state</p>
            </div>


        </div>


        <div class="flx-col cmd-block half">
            
            <div class="flx-row cmd">
                <PillButton img={ btn_img_cmd_red } on:click={ device.setAdmin } />
                <p>Send Admin</p>
            </div>
            
            <div class="flx-row cmd">
                <PillButton img={ btn_img_cmd_orange } on:click={ device.setState } />
                <p>Send State</p>
            </div>
            
            <div class="flx-row cmd">
                <PillButton img={ btn_img_cmd_yellow } on:click={ device.setHeader } />
                <p>Send Header</p>
            </div>
            
            <div class="flx-row cmd">
                <PillButton img={ btn_img_cmd_green } on:click={ device.setConfig } />
                <p>Send Config</p>
            </div>

        </div>

        <div class="flx-col cmd-block half">
            
            <div class="flx-row cmd">
                <PillButton img={ btn_img_cmd_red } on:click={ ( ) => { alert( ALERT_CODES.WARNING, "Yet to be implemented") } } />
                <p>Remove Device</p>
            </div>
            
            <div class="flx-row cmd">
                <PillButton img={ btn_img_cmd_orange } on:click={ ( ) => { alert( ALERT_CODES.WARNING, "Yet to be implemented") } } />
                <p>Edit Serial #</p>
            </div>
            
            <div class="flx-row cmd">
                <PillButton img={ errorLogButton } on:click={ errorLogFunc } />
                <p>{ errorLogText }</p>
            </div>
            
            <!-- <div class="flx-row cmd">
                <PillButton img={ btn_img_cmd_green } on:click={ device.setConfig } />
                <p>Send Config</p>
            </div> -->

        </div>

    </div>
    <div class="flx-row { errorCSS }"><h3>DES Log</h3></div>
    <div class="flx-row { errorCSS }">
        <div class="flx-col">
            { #each device.des_errors as err, index ( index ) }
                <DesErrorBadge bind:err on:err_selected={ ( e ) => {  errorSelected = e.detail } }/>
            { /each }
        </div>
        <div class="flx-col err-json-container">
            <div class="flx-col err-json">
                <JsonView { json } />
            </div>
        </div>
    </div>
</div>
<style>
    
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        padding: 1em;
    }
    .controls {
        justify-content: space-between;
    }
    /* .container:hover { background-color: var(--light_003); } */

    .cmd-block { 
        gap: 1em;
    }

    .half {
        width: 50%;
    }

    .cmd { 
        align-items: center;
        gap: 1em;
    }

    .errlog-show { 
        display: flex;
    }
    .errlog-hide { 
        display: none;
    }
    .err-json-container {
		overflow-y: scroll; 
		overflow-x: hidden;
        height: 23em;
    }
    .err-json {
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        width: 100%;
        --jsonPadding: 0.5em;
        /* white-space: pre-wrap; */
    }

    .field { 
        /* align-items: center; */
        padding: 0;
        padding-left: 1em;
        height: 2em; 
        gap: 0;         
    }

    .field-name {
        color: var( --grey_07);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }

    .field-sub {
        color: var( --grey_07);
        justify-content: flex-end;
        align-items: center;
        max-width: 3.75em;
        min-width: 3.75em;
        padding: 0 0.5em;
    }
    
    .fw {
        justify-content: flex-start;
        padding-right: 0.8em;
    }
    .fw-sub-l {
        justify-content: flex-start;
        align-items: center;
        gap: 0.75em;
    }
    .fw-sub-r {
        justify-content: flex-end;
        align-items: center;
        width: auto;
        gap: 0.75em;
    }
</style>




