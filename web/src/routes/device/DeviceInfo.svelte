<script>

    import { createEventDispatcher } from 'svelte'

    import { debug } from '../../lib/des/utils'
    import { AUTH, RoleCheck } from '../../lib/des/api'

    import { Sample, OP_CODES } from '../../lib/c001v001/models'
    import { Device } from "../../lib/c001v001/device"
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import HeaderCard from '../../lib/c001v001/components/header/HeaderCard.svelte'
    import HeaderPanel from "../../lib/c001v001/components/header/HeaderPanel.svelte"
    import BarGaugeCard from "../../lib/c001v001/components/gauge/BarGaugeCard.svelte"

    import DeviceMode from "./DeviceMode.svelte"
    import DeviceConn from "./DeviceConn.svelte"

    import btn_img_default from "$lib/images/btn-img-default.svg"
    import btn_img_start_green from "$lib/images/btn-img-start-green.svg"
    import btn_img_cmd_pink from "$lib/images/btn-img-cmd-pink.svg"
    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_stop_red from "$lib/images/btn-img-stop-red.svg"
    import btn_img_disconnected_red from "$lib/images/btn-img-disconnect-red.svg"
    import btn_img_connected_orange from "$lib/images/btn-img-connect-orange.svg"
    
    const role = new RoleCheck( )
    export let device = new Device( )
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: sta = device.sta
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    // $: cmdButtonColor = 'bg-accent'
    $: cmdButtonHint = 'Not Set'
    $: cmdButtonIcon = btn_img_default
    $: cmdButtonFunc = ( ) => {
        debug( "device.sta.sta_logging: ", sta.sta_logging, OP_CODES.JOB_ENDED )
    } 

    $: { switch ( sta.sta_logging ) {

            case OP_CODES.DES_REG_REQ: 
            case OP_CODES.DES_REGISTERED: 
            case OP_CODES.JOB_ENDED: 
                cmdButtonHint = 'Start Job'
                cmdButtonIcon = btn_img_start_green
                cmdButtonFunc = ( ) => { dispatch( 'start' ) }
                smp = new Sample( )
                break 

            case OP_CODES.JOB_STARTED: 
                cmdButtonHint = 'End Job'
                cmdButtonIcon = btn_img_stop_red
                cmdButtonFunc = ( ) => { dispatch( 'end' ) }
                break 
            
            case OP_CODES.JOB_START_REQ:
                cmdButtonHint = 'Job Start Pending' 
                cmdButtonIcon = btn_img_cmd_purple
                cmdButtonFunc = ( ) => { device.setState( ) }
                break

            case OP_CODES.JOB_END_REQ:
                cmdButtonHint = 'Job End Pending' 
                cmdButtonIcon = btn_img_cmd_purple
                cmdButtonFunc = ( ) => { device.setState( ) }
                break

            case OP_CODES.GPS_ACQ:
                cmdButtonHint = 'Acquiring GPS' 
                cmdButtonIcon = btn_img_cmd_pink
                cmdButtonFunc = ( ) => { }
                break
        }
    }

    $: socketButtonImage = ( device.socket ? btn_img_connected_orange : btn_img_disconnected_red )
    $: socketButtonText = ( device.socket ? 'Pause live updates' : 'Resume live updates' )
    $: socketButtonFunc =  ( ) => { ( device.socket ? device.disconnectWS( ) : device.connectWS( ) ) }
    

    const dispatch = createEventDispatcher( )

</script>


<div class="flx-col container">

    <div class="flx-col layout">

        <div class="flx-row title-bar">     

            <div class="flx-row ser-cont">
                <div class="flx-row fg-accent ser-lbl">Serial #</div>
                <div class="vert-line"/>
                <div class="flx-row ser">{ device.reg.des_dev_serial }</div>
            </div>  

            <DeviceMode bind:device />

            <div class="flx-row btns">

                { #if device.ping.ok && role.isOperator( $AUTH.user.role ) }
                <PillButton 
                    on:click={ cmdButtonFunc }
                    bind:img={ cmdButtonIcon }
                    bind:hint={ cmdButtonHint }
                />
                { /if }
                
                <PillButton 
                    on:click={ socketButtonFunc }
                    img={ socketButtonImage }
                    hint={ socketButtonText } 
                />

            </div> 

        </div>  

        <div class="flx-col conn">
            <DeviceConn bind:device />
            <div class="flx-col gauge">
                <BarGaugeCard bind:cfg bind:smp/>
            </div>
            <div class="flx-col panel-cont w1440">
                <HeaderPanel bind:device />
            </div>
        </div>

    </div>

    <br>
    
    <div class="flx-col map">
        <div class="map-container" use:device.makeMap />
    </div>

    <div></div>
</div>

<style>

    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        height:100%;
        padding: 0;
        gap: 0.5em;
    }
    .layout {  
        padding: 0; 
        padding-right: 0.5em;
        gap: 0em; 
    }
    .title-bar {
        justify-content: space-between;
        align-items: center;
        padding: 0;
        padding-top: 0.5em;
        padding-bottom: 1em;
    }
    
    .ser-cont { 
        width: auto;
        height: 2em; 
        gap: 0;         
    }
    .ser-lbl { 
        font-size: 1.25em;  
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.6em;
        max-width: 4.8em;
        min-width: 4.8em;
    }
    .ser { 
        font-size: 1.25em;  
        align-items: center; 
        width: auto;
    }

    .btns { 
        justify-content: flex-end; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }

    .conn {
        padding-right: 0.5em;
        /* padding-bottom: 0.5em; */
        gap: 0.75em
    }

    .map {
        border-radius: 0.5em;
        min-height: 15em;
        height: 100%;
    }

    .w1440 { display: none }

    /* LAP TOP */
    @media(max-width: 1440px) {

        .w1440 { display: flex }
    }

    /* TABLET */
    @media(max-width: 1024px) {
        .container { 
            background-color: transparent;
            flex-direction: row; 
            border: none;
        }
        .layout { 
            padding-top: 0; 
            padding-right: 0; 
        }
        .title-bar {padding-bottom: 0.75em; }
        .w1440 { display: none }
    }
    
    /* MOBILE */
    @media(max-width: 425px) {
        .container { 
            flex-direction: column; 
            padding-top: 0;
            padding-right: 0.5em;
            padding-left: 1em;
            background-color: transparent;
            border: none;
            max-width: 100%;
            min-width: 100%;
            width: auto;
        }
        .layout {  padding: 0;  }
        .map { max-height: 13em;  }

    }

</style>