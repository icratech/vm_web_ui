
<script>
    import { COLORS, Device, MODES, getMode } from "../../lib/des_api"
    import { RGBA, BASE } from "../../lib/common/colors"
    
    export let device = new Device( )
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: color_code = BASE.LIGHT
    $: color_code_txt = RGBA(color_code,1)
    $: color_code_bg = RGBA(color_code, 0.2)
    $: color_code_border = RGBA(color_code, 0.5)
    $: lbl = 'OFF'
    $: {
        if ( !device.ping.ok ) { 
            lbl = 'OFF'
            color_code = BASE.RED  
        }
        else if ( hdr.hdr_job_start == 0 ) { 
            lbl = 'READY'
            color_code = BASE.LIGHT  
        }
        else {
            switch ( getMode( cfg, smp ) ) {

                case MODES.BUILD: 
                    lbl = 'BUILD'
                    color_code = COLORS.PRESS
                    break

                case MODES.VENT: 
                    lbl = 'VENT'
                    color_code = BASE.AQUA
                    break

                case MODES.HI_FLOW:
                    lbl = 'FLOW'
                    color_code = COLORS.HI_FLOW
                    break

                case MODES.LO_FLOW:
                    lbl = 'FLOW'
                    color_code = COLORS.LO_FLOW
                    break
            }
        }
    }
</script>

<div class="mode" 
    style="
        color: { color_code_txt };
        background-color: { color_code_bg };
        border-right: solid 0.1em { color_code_border };
        border-bottom: solid 0.1em { color_code_border };
        border: solid 0.1em { color_code_border };
    "
>{ lbl }</div>

<style>
    .mode { 
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 1em; 
        border-radius: 0.25em; 
        font-size: 1.3em; 
        font-weight: 500;
    }
</style>