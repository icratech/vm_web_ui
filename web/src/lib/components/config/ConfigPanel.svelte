
<script>

    import InputNum from "$lib/common/input_num/InputNum.svelte"

    import { Config } from '../../des_api'
    export let config = new Config( )

</script>

<div class="flx-col container">
    
    <div class="flx-col  card-content">

        <div class="flx-row in">
            <div class="lbl-left">Surface Casing Vent Depth ( m ):</div> 
            <InputNum
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_scvd}
            />
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_scvd_mult}
            />
            <div class="lbl">SCVD Multiplier</div> 
        </div>

        <div class="flx-row in">
            <div class="lbl-left">Stabilized Shut-In Pressure Rate ( kPa / hour ):</div> 
            <InputNum
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_ssp_rate}
            />
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_ssp_dur}
            />
            <div class="lbl">SSP Duration ( hours )</div> 
        </div>

        <div class="flx-row in">
            <div class="lbl-left">Serious Flow Alarm Limit ( L/min ):</div> 
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_hi_scvf}
            />
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_flow_tog}
            />
            <div class="lbl">Flow Toggle ( L/min )</div> 
        </div>
        
        <br>
        <div class="flx-row in">
            <div class="lbl-left"></div>
            <p class="lbl-top">Sample</p>
            <p class="lbl-top">Log</p>
            <p class="lbl-top">Transmit</p>
        </div>
        <div class="flx-row in">
            <div class="lbl-left">Standard Measurement Periods ( ms ):</div> 
            <InputNum
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_op_sample}
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_op_log}
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_op_trans}
            />
            <!-- <div class="lbl">Transmit Period ( ms )</div>  -->
        </div>


        <div class="flx-row in">
            <div class="lbl-left">Diagnostic Measurement Periods ( ms ):</div> 
            <InputNum
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_diag_sample}
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_diag_log}
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_diag_trans}
            />
            <!-- <div class="lbl">Transmit Period ( ms )</div>  -->
        </div>
    </div>  

</div>

<style>

    .container {
        width: 50em;
    }

    .in {
        justify-content: flex-start;
        align-items: center;
        gap: 1em;
    }
    .lbl {
        color: var(--accent_a);
    }
    .lbl-left { 
        color: var(--accent_a);
        min-width: 20.5em;
        text-align: end;
    }
    .lbl-top {
        width: 7em; 
        text-align: center;
    }

</style>