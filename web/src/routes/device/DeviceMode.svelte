
<script>
    
    import { RGBA, BASE } from "../../lib/common/colors"
    
    import { OP_CODES, MODES, Sample, getMode } from '../../lib/c001v001/models'
    import { Device } from '../../lib/c001v001/device'
    import { CHT_COLORS } from '../../lib/c001v001/chart_display'
    
    export let device = new Device( )
    $: hdr = device.hdr
    $: evt = device.evt
    $: cfg = device.cfg
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    let arrStyle = `style="font-size: 2.5em; margin-top: -0.25em; padding: 0 0.1em;"`
    let rarr = `<span ${ arrStyle }>&rarr;</span>`
    let larr = `<span ${ arrStyle }>&larr;</span>`
    let moveColor = BASE.BLUE
    $: color_code = BASE.LIGHT
    $: color_code_txt_alpha = 0.79
    $: color_code_txt = RGBA(color_code, color_code_txt_alpha)
    $: color_code_bg = RGBA(color_code, 0.15)
    $: color_code_border = RGBA(color_code, 0.25)
    $: lbl = 'OFF'
    $: {
            lbl = 'OFF'
            color_code = BASE.CHAR

            switch ( device.sta.sta_logging ) {

                case OP_CODES.DES_REG_REQ:
                case OP_CODES.JOB_START_REQ:
                case OP_CODES.JOB_END_REQ:
                    if ( device.sta.sta_logging == OP_CODES.JOB_START_REQ && device.evt.evt_code == OP_CODES.GPS_ACQ ) {
                        lbl = 'GPS'
                        color_code = BASE.PINK
                    } else {
                        lbl = 'CMD'
                        color_code = BASE.PURPLE
                    }
                    break

                case OP_CODES.JOB_STARTED: 
                    if ( device.ping.ok ) {

                        switch ( getMode( cfg, smp ) ) {

                            case MODES.BUILD: 
                                lbl = 'BUILD'
                                color_code = CHT_COLORS.PRESS
                                break

                            case MODES.VENT: 
                                lbl = 'VENT'
                                color_code = BASE.AQUA
                                break
                            
                            case MODES.HI_FLOW:
                                lbl = 'FLOW'
                                color_code = CHT_COLORS.HI_FLOW
                                break
                            
                            case MODES.LO_FLOW:
                                lbl = 'FLOW'
                                color_code = CHT_COLORS.LO_FLOW
                                break

                            
                            case MODES.MOVE_BV:
                                color_code = moveColor
                                if ( cfg.cfg_vlv_pos === MODES.BUILD ) 
                                    lbl = `BUILD ${ rarr } VENT`
                                else
                                    lbl = `BUILD ${ larr } VENT`
                                break

                            case MODES.MOVE_VF:
                                color_code = moveColor
                                if ( cfg.cfg_vlv_pos === MODES.VENT || cfg.cfg_vlv_pos === MODES.BUILD )
                                    lbl = `VENT ${ rarr } FLOW`
                                else 
                                    lbl = `VENT ${ larr } FLOW`
                                break

                            case MODES.MOVE_HL:
                                color_code = moveColor
                                if ( cfg.cfg_vlv_pos === MODES.HI_FLOW ) 
                                    lbl = `FLOW Hi ${ rarr } Lo`
                                else 
                                    lbl = `FLOW Hi ${ larr } Lo`
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
        border: solid 0.1em { color_code_border };
    "
>{ @html lbl }</div>

<style>
    .mode { 
        display: flex;
        flex-direction: row;
        justify-content: center; 
        align-items: center;
        border-radius: 0.25em; 
        max-width: 9em;
        min-width: 9em;
        width: 9em;
        height: 2em
    }
</style>