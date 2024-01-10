
<script>
    
    import { RGBA, BASE } from "../../lib/common/colors"
    
    import { OP_CODES, MODES, getMode } from '../../lib/c001v001/models'
    import { Device } from '../../lib/c001v001/device'
    import { CHT_COLORS } from '../../lib/c001v001/chart_display'
    
    export let device = new Device( )
    $: hdr = device.hdr
    $: cfg = device.cfg
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: color_code = BASE.LIGHT
    $: color_code_txt_alpha = 1
    $: color_code_txt = RGBA(color_code, color_code_txt_alpha)
    $: color_code_bg = RGBA(color_code, 0.2)
    $: color_code_border = RGBA(color_code, 0.5)
    $: lbl = 'OFF'
    $: {
            lbl = 'OFF'
            color_code = BASE.CHAR
            switch ( device.sta.sta_logging ) {

                case OP_CODES.DES_REG_REQ:
                case OP_CODES.JOB_START_REQ:
                case OP_CODES.JOB_END_REQ:
                    lbl = 'CMD'
                    color_code = BASE.PURPLE
                    break

                case OP_CODES.GPS_ACQ:
                    lbl = 'GPS'
                    color_code = BASE.PINK
                    break

                case OP_CODES.JOB_STARTED: 
                    if ( device.ping.ok ) {

                        switch ( getMode( cfg, smp ) ) {

                            case MODES.BUILD: 
                                lbl = 'BUILD'
                                color_code = CHT_COLORS.PRESS
                                break
                            
                            case MODES.MOVE_BV:
                                color_code = BASE.BLUE
                                if ( cfg.cfg_vlv_pos === MODES.BUILD ) 
                                    lbl = 'B to V'
                                else
                                    lbl = 'V to B'
                                break

                            case MODES.VENT: 
                                lbl = 'VENT'
                                color_code = BASE.AQUA
                                break
                            
                            case MODES.MOVE_VF:
                                color_code = BASE.BLUE
                                if ( cfg.cfg_vlv_pos === MODES.VENT )
                                    lbl = 'V to F'
                                else 
                                    lbl = 'F to V'
                                break

                            case MODES.HI_FLOW:
                                lbl = 'FLOW'
                                color_code = CHT_COLORS.HI_FLOW
                                break
                            
                            case MODES.MOVE_HL:
                                color_code = BASE.BLUE
                                if ( cfg.cfg_vlv_pos === MODES.HI_FLOW )
                                    lbl = 'HF to LF'
                                else 
                                    lbl = 'LF to HF'
                                break

                            case MODES.LO_FLOW:
                                lbl = 'FLOW'
                                color_code = CHT_COLORS.LO_FLOW
                                break

                            default: 
                                lbl = 'ERR'
                                color_code = BASE.RED
                        }
                    }
                    break

                case OP_CODES.DES_REGISTERED:
                case OP_CODES.JOB_ENDED:
                    if ( device.ping.ok ) {
                        lbl = 'READY'
                        color_code = BASE.LIGHT
                        color_code_txt_alpha = 0.9
                    }
                    break

                case OP_CODES.JOB_OFFLINE_START: 
                case OP_CODES.JOB_OFFLINE_END:
                    if ( device.ping.ok ) {  
                        lbl = 'SYNC'
                        color_code = BASE.PINK
                    }
                    break

                default :
                    lbl = 'OFF'
                    color_code = BASE.GREY
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