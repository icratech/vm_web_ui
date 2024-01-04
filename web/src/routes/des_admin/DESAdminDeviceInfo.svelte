<script>
    
    import { createEventDispatcher } from "svelte"

    import { debug } from '../../lib/des/utils'
    import { Device } from '../../lib/c001v001/device'

    import DeviceMode from "../device/DeviceMode.svelte"
    import DeviceConn from "../device/DeviceConn.svelte"
    
    export let device = new Device( )

    $: highlight = ( device.highlight ? 'highlight' : '' ) 
    let dispatch = createEventDispatcher( )

</script>



<div class="flx-col container { highlight }"
    on:keydown on:click={ ( ) => { dispatch( "device-selected", device ) } } >

    <div class="flx-col layout">

        <div class="flx-row title-bar">   

            <div class="flx-row ser-cont">
                <div class="flx-row fg-accent ser-lbl">Serial #</div>
                <div class="vert-line"/>
                <div class="flx-row ser">{ device.reg.des_dev_serial }</div>
            </div>

            <DeviceMode bind:device={ device } />

        </div>

    </div>

    <DeviceConn bind:device={ device } />

</div>

<style>
    
    .container {
        padding: 1em;
        gap: 0.5em;
    }
    .layout {  
        padding: 0; 
        padding-right: 0.5em;
        gap: 0.5em; 
    }
    .title-bar {
        justify-content: space-between;
        align-items: center;
    }
    
    .ser-cont { 
        justify-content: flex-start;
        width: 15em; 
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
        gap: 1em;
    }
    

</style>