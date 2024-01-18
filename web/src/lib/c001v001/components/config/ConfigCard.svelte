<script>

    import { getContext } from "svelte"
    
    import { RGBA, BASE } from "../../../common/colors"
    import UserBadge from "../../../des/components/UserBadge.svelte"
    import DateTimeDisplay from "../../../common/date_time/DateTimeDisplay.svelte"

    import { Config, MODES } from '../../models'
    
    export let cfg = new Config( )

    $: USERS = getContext( 'users' )
    $: user = $USERS.filter( u  => { return u.id == cfg.cfg_user_id } )[0]

    $: color_code = BASE.LIGHT
    $: color_code_txt_alpha = 0.85
    $: color_code_txt = RGBA(color_code, color_code_txt_alpha)
    $: color_code_bg = RGBA(color_code, 0.15)
    $: color_code_border = RGBA(color_code, 0.25)
    $: mode_lbl = 'VENT'
    $: {
        switch ( cfg.cfg_vlv_tgt ) {

            case MODES.BUILD:
                color_code = BASE.GREEN
                mode_lbl = 'BUILD'
                break

            case MODES.VENT:
                color_code = BASE.AQUA
                mode_lbl = 'VENT'
                break

            case MODES.HI_FLOW:
            case MODES.LO_FLOW:
                color_code = BASE.ORANGE
                mode_lbl = 'FLOW'
                break

            default: color_code = BASE.LIGHT
        }
    }

</script>

<div class="flx-col container">

    <div class="flx-col sec">
        <div class="flx-row field">
            <div class="flx-row title">Mode</div>
            <div class="vert-line"/>
            <div class="flx-col mode" 
                style="color: { color_code_txt };
                background-color: { color_code_bg };
                border: solid 0.1em { color_code_border };
            ">{ mode_lbl }</div>
            <div class="flx-col operator">
                <div style="padding-right: 0.5em;"><DateTimeDisplay date={ cfg.cfg_time } /></div>
                <UserBadge bind:user={ user } />
            </div>
        </div>
        <br>
        <!-- <div class="flx-row field"><div class="flx-row title"></div><div class="vert-line"/></div> -->
    </div>

    <div class="flx-col sec">
        <div class="flx-row field">
            <div class="flx-row title">SCVD</div>
            <div class="vert-line"/>
            <div class="flx-row value">{ Number( cfg.cfg_scvd ).toFixed(3) }<div class="unit">m</div></div>
            <div class="flx-row value">{ Number( cfg.cfg_scvd_mult ).toFixed(3) }<div class="unit">kPa/m</div></div>
            <div class="flx-row value"></div>
        </div>

        <div class="flx-row field">
            <div class="flx-row title">SSP</div>
            <div class="vert-line"/>
            <div class="flx-row value">{ Number( cfg.cfg_ssp_rate ).toFixed(3) }<div class="unit">kPa/hr</div></div>
            <div class="flx-row value">{ Number( cfg.cfg_ssp_dur / 3600000 ).toFixed(3) }<div class="unit">hrs</div></div>
            <div class="flx-row value"></div>
        </div>
    </div>
    
    <div class="flx-col sec">
        <div class="flx-row col-head-row">
            <div class="flx-row title"></div>
            <div class="vert-line"/>
            <div class="flx-row col-head">Max </div>
            <div class="flx-row col-head">Toggle</div>
            <div class="flx-row col-head">Stable</div>
        </div>
        <div class="flx-row field">
            <div class="flx-row title">Flow</div>
            <div class="vert-line"/>
            <div class="flx-row value">{ Number( cfg.cfg_hi_scvf ).toFixed(3) }<div class="unit">L/min</div></div>
            <div class="flx-row value">{ Number( cfg.cfg_flow_tog ).toFixed(3) }<div class="unit">L/min</div></div>
            <div class="flx-row value">{ Number( cfg.cfg_sscvf_dur / 3600000 ).toFixed(3) }<div class="unit">hrs</div></div>
        </div>
    </div>
    
    <!-- <div class="flx-col sec"> -->
        <div class="flx-row col-head-row">
            <div class="flx-row title"></div>
            <div class="vert-line"/>
            <div class="flx-row col-head">Sample </div>
            <div class="flx-row col-head">Log</div>
            <div class="flx-row col-head">Transmit</div>
        </div>
        
        <div class="flx-row field">
            <div class="flx-row title">Operation</div>
            <div class="vert-line"/>
            <div class="flx-row value">{ cfg.cfg_op_sample / 1000 }<div class="unit">sec</div></div>
            <div class="flx-row value">{ cfg.cfg_op_log / 1000 }<div class="unit">sec</div></div>
            <div class="flx-row value">{ cfg.cfg_op_trans / 1000 }<div class="unit">sec</div></div>
        </div>
        
        <div class="flx-row field">
            <div class="flx-row title">Diagnostic</div>
            <div class="vert-line"/>
            <div class="flx-row value">{ cfg.cfg_diag_sample / 1000 }<div class="unit">sec</div></div>
            <div class="flx-row value">{ cfg.cfg_diag_log / 1000 }<div class="unit">sec</div></div>
            <div class="flx-row value">{ cfg.cfg_diag_trans / 1000 }<div class="unit">sec</div></div>
        </div>
    <!-- </div> -->

</div>

<style>

    .container { 
        border-radius: 0.5em;
        height: 100%;
        padding: 0;
        gap: 0;
    }

    .sec { 
        border-bottom: solid 0.05em var(--light_01); 
        padding-bottom: 0.25em;
        margin-bottom: 0.5em;
        gap: 0;
    }

    .mode { 
        border-radius: 0.25em; 
        justify-content: center; 
        align-items: center; 
        max-width: 9em;
        min-width: 9em;
        width: 9em;
        height: 2em;
    }
    .operator {
        align-items: flex-end;
        padding-right: 1em;
        gap: 0;
    }

    .field { 
        height: 2em; 
        gap: 0;         
    }

    .title {
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }

    .col-head-row {
        height: 1.5em; 
        gap: 0;   
    }
    .col-head { 
        color: var(--accent_a); 
        justify-content: flex-start; 
        align-items: center; 
        padding: 0;
        padding-left: 2em;
        max-width: 8.5em;
        min-width: 8.5em;
        width: 8.5em;
    }
    .value { 
        justify-content: flex-end; 
        align-items: center; 
        max-width: 8.5em;
        min-width: 8.5em;
        width: 8.5em;
    }
    .unit { 
        color: var(--orange_a); 
        max-width: 3em;
        min-width: 3em;
        width: 3em;
    }


    /* .date { color: var(--orange_a); } */

</style>