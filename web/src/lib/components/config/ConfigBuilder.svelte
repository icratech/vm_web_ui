
<script>

    import InputNum from "$lib/common/input_num/InputNum.svelte"

    import { Config, MIN_SAMPLE_PERIOD, DEFAULT_CFG_SSP_DUR, debug } from '../../des_api'
    export let config = new Config( )

    let ssp_dur = DEFAULT_CFG_SSP_DUR / 3600000
    let op_sample = MIN_SAMPLE_PERIOD / 1000
    let op_log = MIN_SAMPLE_PERIOD * 10 / 1000
    let op_trans = MIN_SAMPLE_PERIOD * 60 / 1000
    let diag_sample = MIN_SAMPLE_PERIOD * 10 / 1000
    let diag_log = MIN_SAMPLE_PERIOD * 100 / 1000
    let diag_trans = MIN_SAMPLE_PERIOD * 600 / 1000
    $: { 
        /* SSP SETTINGS */
        config.cfg_ssp_dur = Math.floor(ssp_dur * 3600000)
        debug( "config.cfg_ssp_dur: ", config.cfg_ssp_dur )

        /* MESUREMENT SETTINGS */
        if ( op_sample < MIN_SAMPLE_PERIOD / 1000 ) { op_sample = MIN_SAMPLE_PERIOD / 1000 } 
        config.cfg_op_sample = op_sample * 1000 // debug( "cfg.cfg_op_sample: ", config.cfg_op_sample )
        
        if ( op_log < config.cfg_op_sample / 1000 ) { op_log = config.cfg_op_sample / 1000 } 
        config.cfg_op_log = op_log * 1000  // debug( "cfg.cfg_op_log: ", config.cfg_op_log )
        
        if ( op_trans < config.cfg_op_log / 1000 ) { op_trans = config.cfg_op_log / 1000 } 
        config.cfg_op_trans = op_trans * 1000 // debug( "cfg.cfg_op_trans: ", config.cfg_op_trans )
        
        /* DIAGNOSTIC SETTINGS */
        if ( diag_sample < MIN_SAMPLE_PERIOD / 1000 ) { diag_sample = MIN_SAMPLE_PERIOD / 1000 } 
        config.cfg_diag_sample = diag_sample * 1000 // debug( "cfg.cfg_diag_sample: ", config.cfg_diag_sample )
        
        if ( diag_log < config.cfg_diag_sample / 1000 ) { diag_log = config.cfg_diag_sample / 1000 } 
        config.cfg_diag_log = diag_log * 1000  // debug( "cfg.cfg_diag_log: ", config.cfg_diag_log )
        
        if ( diag_trans < config.cfg_diag_log / 1000 ) { diag_trans = config.cfg_diag_log / 1000 } 
        config.cfg_diag_trans = diag_trans * 1000 // debug( "cfg.cfg_diag_trans: ", config.cfg_diag_trans )
    }

</script>

<div class="flx-col container">
    
    <div class="flx-col card-content cont">

        <div class="flx-row in">Surface Casing Vent Depth - SCVD High Pressure Alarm</div>
        <div class="flx-row in">
            <div class="lbl-left">Depth ( m ):</div> 
            <InputNum
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_scvd}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_scvd_mult}
                width=6em
            />
            <div class="lbl">Mult.</div> 
        </div>

        <!-- <br> -->
        <div class="flx-row in">Stabilized Shut-In Pressure - SSP Alarm</div>
        <div class="flx-row in">
            <div class="lbl-left">Rate( kPa/hr ):</div> 
            <InputNum
                enabled={true}
                bind:num={config.cfg_ssp_rate}
                width=6em
            />
            <InputNum 
                enabled={true}
                bind:num={ssp_dur}
                width=6em
            />
            <div class="lbl">Dur. ( hr )</div> 
        </div>

        <!-- <br> -->
        <div class="flx-row in">Flow Alarm Settings </div>
        <div class="flx-row in">
            <div class="lbl-left">Max ( L/min ):</div> 
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_hi_scvf}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_flow_tog}
                width=6em
            />
            <div class="lbl">Toggle ( L/min )</div> 
        </div>
        
        <!-- <br> -->
        <div class="flx-row in">
            <div >Measurements  </div>
            <p class="lbl-top">Sample</p>
            <p class="lbl-top">Log</p>
            <p class="lbl-top">Transmit</p>
        </div>
        <div class="flx-row in">
            <div class="lbl-left">Std. ( sec ):</div> 
            <InputNum
                enabled={true}
                is_integer={true}
                bind:num={op_sample}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={op_log}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={op_trans}
                width=6em
            />
        </div>


        <div class="flx-row in">
            <div class="lbl-left">Diag. ( sec ):</div> 
            <InputNum
                enabled={true}
                is_integer={true}
                bind:num={diag_sample}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={diag_log}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={diag_trans}
                width=6em
            />
        </div>
    </div>  

</div>

<style>

    .cont {
        gap: 0.75em;
    }

    .in {
        justify-content: flex-start;
        align-items: center;
        gap: 0.5em;
    }
    .lbl {
        color: var(--accent_a);
    }
    .lbl-left { 
        color: var(--accent_a);
        min-width: 7em;
        text-align: end;
    }
    .lbl-top {
        width: 6em; 
        text-align: center;
    }

</style>