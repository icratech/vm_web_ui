
<script>

    import InputNum from "$lib/common/input_num/InputNum.svelte"

    import { Config } from '../../des_api'
    export let config = new Config( )

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
                is_integer={false}
                bind:num={config.cfg_ssp_rate}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={false}
                bind:num={config.cfg_ssp_dur}
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
            <div class="lbl-left">Std. ( ms ):</div> 
            <InputNum
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_op_sample}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_op_log}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_op_trans}
                width=6em
            />
            <!-- <div class="lbl">Transmit Period ( ms )</div>  -->
        </div>


        <div class="flx-row in">
            <div class="lbl-left">Diag. ( ms ):</div> 
            <InputNum
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_diag_sample}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_diag_log}
                width=6em
            />
            <InputNum 
                enabled={true}
                is_integer={true}
                bind:num={config.cfg_diag_trans}
                width=6em
            />
            <!-- <div class="lbl">Transmit Period ( ms )</div>  -->
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