
<script>

    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import PillButton from "../../common/button/PillButton.svelte"
    import btn_img_vlv_vent from "$lib/images/btn-img-vlv-vent.svg"
    import btn_img_vlv_flow from "$lib/images/btn-img-vlv-flow.svg"
    import btn_img_vlv_build from "$lib/images/btn-img-vlv-build.svg"

    import { Config, MODES, MIN_SAMPLE_PERIOD, debug } from '../../des_api'
    export let cfg = new Config( )

    let ssp_dur = cfg.cfg_ssp_dur / 3600000

    let op_sample = cfg.cfg_op_sample / 1000
    let op_log = cfg.cfg_op_log / 1000
    let op_trans = cfg.cfg_op_trans / 1000
    let diag_sample = cfg.cfg_diag_sample / 1000
    let diag_log = cfg.cfg_diag_log / 1000
    let diag_trans = cfg.cfg_diag_trans / 1000
    $: { 
        /* SSP SETTINGS */
        cfg.cfg_ssp_dur = Math.floor(ssp_dur * 3600000) //  debug( "config.cfg_ssp_dur: ", cfg.cfg_ssp_dur )

        /* MESUREMENT SETTINGS */
        if ( op_sample < MIN_SAMPLE_PERIOD / 1000 ) { op_sample = Math.floor( MIN_SAMPLE_PERIOD / 1000 ) } 
        cfg.cfg_op_sample = op_sample * 1000 // debug( "cfg.cfg_op_sample: ", config.cfg_op_sample )
        
        if ( op_log < cfg.cfg_op_sample / 1000 ) { op_log = Math.floor( cfg.cfg_op_sample / 1000 ) } 
        cfg.cfg_op_log = op_log * 1000  // debug( "cfg.cfg_op_log: ", config.cfg_op_log )
        
        if ( op_trans < cfg.cfg_op_sample / 1000 ) { op_trans = Math.floor( cfg.cfg_op_sample / 1000 ) } 
        cfg.cfg_op_trans = op_trans * 1000 // debug( "cfg.cfg_op_trans: ", config.cfg_op_trans )
   
        
        /* DIAGNOSTIC SETTINGS */
        if ( diag_sample < MIN_SAMPLE_PERIOD / 1000 ) { diag_sample = Math.floor( MIN_SAMPLE_PERIOD / 1000 ) } 
        cfg.cfg_diag_sample = diag_sample * 1000 // debug( "cfg.cfg_diag_sample: ", config.cfg_diag_sample )
        
        if ( diag_log < cfg.cfg_diag_sample / 1000 ) { diag_log = Math.floor( cfg.cfg_diag_sample / 1000 ) } 
        cfg.cfg_diag_log = Math.floor( diag_log ) * 1000  // debug( "cfg.cfg_diag_log: ", config.cfg_diag_log )
        
        if ( diag_trans < cfg.cfg_diag_sample / 1000 ) { diag_trans = Math.floor( cfg.cfg_diag_sample / 1000 ) } 
        cfg.cfg_diag_trans = diag_trans * 1000 // debug( "cfg.cfg_diag_trans: ", config.cfg_diag_trans )
      
    }

    $: ventButtonColor = ( cfg.cfg_vlv_tgt == MODES.VENT ? 'bg-aqua' : 'bg-grey')
    $: flowButtonColor = ( cfg.cfg_vlv_tgt == MODES.HI_FLOW ? 'bg-orange' : 'bg-grey')
    $: buildButtonColor = ( cfg.cfg_vlv_tgt == MODES.BUILD ? 'bg-green' : 'bg-grey')

</script>

<div class="flx-col container">
    
    <div class="flx-col card-content cont">

        <div class="flx-row in">Valve Position</div>
        <div class="flx-row panel-title-btns">   
            <PillButton
                cls={ ventButtonColor }
                img={ btn_img_vlv_vent }
                on:click={ ( ) => { cfg.cfg_vlv_tgt = MODES.VENT } }
                hint='VENT'
            />    
            <PillButton
                cls={ flowButtonColor }
                img={ btn_img_vlv_flow }
                on:click={ ( ) => { cfg.cfg_vlv_tgt = MODES.HI_FLOW } }
                hint='FLOW'
            />
            <PillButton
                cls={ buildButtonColor }
                img={ btn_img_vlv_build }
                on:click={ ( ) => { cfg.cfg_vlv_tgt = MODES.BUILD } }
                hint='BUILD'
            />
        </div>

        <!-- <br> -->
        <div class="flx-row in">Surface Casing Vent Depth - Max Pressure 
            <span class="fg-orange">{ Number( cfg.cfg_scvd * cfg.cfg_scvd_mult ).toFixed( 3 ) }</span> kPa
        </div>
        <div class="flx-row field">
            <div class="flx-row title">SCVD</div>
            <div class="vert-line"/>
            <div class="flx-row value">
                <InputNum
                    enabled={true}
                    is_integer={false}
                    bind:num={cfg.cfg_scvd}
                    width=6em
                />
            </div>
            <div class="flx-row unit">m</div>

            <div class="vert-line"/>
            <div class="flx-row value">
                <InputNum 
                    enabled={true}
                    is_integer={false}
                    bind:num={ cfg.cfg_scvd_mult }
                    width=6em
                />
            </div>
            <div class="flx-row unit">kPa/m</div>

            <div class="flx-row value"></div>
        </div>

        <!-- <br> -->
        <div class="flx-row in">Stabilized Shut-In Pressure</div>
        <div class="flx-row field">
            <div class="flx-row title">SSP</div>
            <div class="vert-line"/>
            <div class="flx-row value">
                <InputNum
                    enabled={true}
                    bind:num={cfg.cfg_ssp_rate}
                    width=6em
                />
            </div>
            <div class="flx-row unit">Rate kPa/hr</div>
            
            <div class="vert-line"/>
            <div class="flx-row value">
                <InputNum 
                    enabled={true}
                    bind:num={ssp_dur}
                    width=6em
                />
            </div>
            <div class="flx-row unit">Duration hrs</div>
            <div class="flx-row value"></div>
        </div>

        <!-- <br> -->
        <div class="flx-row in">Flow Alarm Settings </div>
    
        <div class="flx-row field">
            <div class="flx-row title">Flow</div>
            <div class="vert-line"/>
            <div class="flx-row value">
                <InputNum 
                    enabled={true}
                    is_integer={false}
                    bind:num={cfg.cfg_hi_scvf}
                    width=6em
                />
            </div>
            <div class="flx-row unit">Max L/min</div>
            <div class="flx-row value">
                <InputNum 
                    enabled={true}
                    is_integer={false}
                    bind:num={cfg.cfg_flow_tog}
                    width=6em
                />
            </div>
            <div class="flx-row unit">Toggle L/min</div>
            <div class="flx-row value"></div>
        </div>
        
        <!-- <br> -->
        <div class="flx-row in">Measurements</div>
        <div class="flx-row field">
            <div class="flx-row title"></div>
            <div class="vert-line"/>
            <div class="flx-row col-head">Sample</div>
            <div class="flx-row col-head">Log</div>
            <div class="flx-row col-head">Transmit</div>
        </div>
        <div class="flx-row field"><div class="flx-row title">Operation</div>
            <div class="vert-line"/>
            <div class="flx-row value">
                <InputNum
                    enabled={true}
                    is_integer={true}
                    bind:num={op_sample}
                    width=6em
                />
                <div class="flx-row sec">sec</div>
            </div>
            <div class="flx-row value">    
              <InputNum 
                    enabled={true}
                    is_integer={true}
                    bind:num={op_log}
                    width=6em
                />
                <div class="flx-row sec">sec</div>
            </div>
            <div class="flx-row value">    
              <InputNum 
                    enabled={true}
                    is_integer={true}
                    bind:num={op_trans}
                    width=6em
                />
                <div class="flx-row sec">sec</div>
            </div>
        </div>
        <div class="flx-row field"> <div class="flx-row title">Diagnostic</div>
            <div class="vert-line"/>
            <div class="flx-row value">
                <InputNum
                    enabled={true}
                    is_integer={true}
                    bind:num={diag_sample}
                    width=6em
                />
                <div class="flx-row sec">sec</div>
            </div>
            <div class="flx-row value">
                <InputNum 
                    enabled={true}
                    is_integer={true}
                    bind:num={diag_log}
                    width=6em
                />
                <div class="flx-row sec">sec</div>
            </div>
            <div class="flx-row value">
                <InputNum 
                    enabled={true}
                    is_integer={true}
                    bind:num={diag_trans}
                    width=6em
                />
                <div class="flx-row sec">sec</div>
            </div>
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
    
    .field { 
        height: 2em; 
        gap: 0;   
        padding-bottom: 1em;      
    }

    .title {
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
        width: 6em;
    }

    .col-head { 
        color: var(--accent_a); 
        justify-content: flex-start; 
        align-items: center; 
        padding-left: 0.5em;
        max-width: 9em;
        min-width: 9em;
        width: 9em;
    }
    .value { 
        align-items: center; 
        padding-left: 0.5em;
        gap: 0.5em;
    }
    .unit { 
        color: var(--orange_a); 
        align-items: center; 
        justify-content: flex-start;
        padding-left: 0.5em;
    }

    .sec { 
        color: var(--orange_a); 
        align-items: center; 
        justify-content: flex-start;
    }


</style>