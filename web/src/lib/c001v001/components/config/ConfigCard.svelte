<script>

    import { getContext } from "svelte"
    
    import UserBadge from "../../../des/components/UserBadge.svelte"
    import DateTimeDisplay from "../../../common/date_time/DateTimeDisplay.svelte"

    import { Config } from '../../models'
    
    export let cfg = new Config( )

    $: USERS = getContext( 'users' )
    $: user = $USERS.filter( u  => { return u.id == cfg.cfg_user_id } )[0]

</script>

<div class="flx-col container">

    <!-- <br>
    <div class="flx-row sec-head">Surface Casing Vent Depth Settings</div> -->
    <div class="flx-row field">
        <div class="flx-row title">SCVD</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ Number( cfg.cfg_scvd ).toFixed(3) }<div class="unit">m</div></div>
        <div class="flx-row value">{ Number( cfg.cfg_scvd_mult ).toFixed(3) }<div class="unit">kPa/m</div></div>
        <div class="flx-row value"></div>
    </div>
    
    <!-- <br>
    <div class="flx-row sec-head">Stabilized Shut-in Pressure Settings</div> -->
    <div class="flx-row field">
        <div class="flx-row title">SSP</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ Number( cfg.cfg_ssp_rate ).toFixed(3) }<div class="unit">kPa/hr</div></div>
        <div class="flx-row value">{ Number( cfg.cfg_ssp_dur / 3600000 ).toFixed(3) }<div class="unit">hrs</div></div>
        <div class="flx-row value"></div>
    </div>
    
    <br>
    <div class="flx-row field">
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
    
    <br>
    <!-- <div class="flx-row sec-head">Measurement Settings</div>  -->
    <div class="flx-row field">
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
    
    <br>
    <div class="flx-col footer">
        <div style="padding-right: 0.5em;"><DateTimeDisplay date={ cfg.cfg_time } /></div>
        <UserBadge bind:user={ user } />
    </div>

</div>

<style>

    .container { 
        border-radius: 0.5em;
        height: 100%;
        padding: 0;
        gap: 0;
    }

    /* .sec-head {
        padding-left: 1em;
        font-size: 1.1em;
    } */
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

    .col-head { 
        color: var(--accent_a); 
        justify-content: flex-start; 
        align-items: center; 
        padding-left: 2em;
        max-width: 9em;
        min-width: 9em;
        width: 9em;
    }
    .value { 
        justify-content: flex-end; 
        align-items: center; 
        max-width: 9em;
        min-width: 9em;
        width: 9em;
    }
    .unit { 
        color: var(--orange_a); 
        max-width: 3em;
        min-width: 3em;
        width: 3em;
    }

    .footer {
        align-items: flex-end;
        padding-right: 1em;
        gap: 0.5em;
    }

    /* .date { color: var(--orange_a); } */

</style>