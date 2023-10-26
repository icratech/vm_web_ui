
<script>
    import { COLORS, Device } from "../../lib/des_api"
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
        if ( hdr.hdr_job_start == 0 ) { color_code = BASE.LIGHT  }
        else {
            switch ( cfg.cfg_vlv_tgt ) {

                case 0: 
                    lbl = 'BUILD'
                    color_code = COLORS.PRESS
                    break

                case 2: 
                    lbl = 'VENT'
                    color_code = BASE.AQUA
                    break

                case 4: // HI FLOW
                case 6: // LO FLOW
                    lbl = 'FLOW'
                    if ( smp.smp_lo_flow > cfg.cfg_flow_tog ) {
                        color_code = COLORS.HI_FLOW
                    } else {
                        color_code = COLORS.LO_FLOW
                    }
                    break

                default:
                    lbl = 'OFF'
                    color_code = BASE.LIGHT
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
        padding: 0 1em; 
        border-radius: 0.25em; 
        font-size: 1.3em; 
        font-weight: 500;
    }
</style>