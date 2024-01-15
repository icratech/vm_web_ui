
<script>

    import { debug } from '../../../des/utils'
    import InputNum from "../../../common/input_num/InputNum.svelte"
    import PillButton from "../../../common/button/PillButton.svelte"

    import { Config, MODES, MIN_SAMPLE_PERIOD } from '../../models'

    import btn_img_vlv_vent_grey from "$lib/images/btn-img-vlv-vent-grey.svg"
    import btn_img_vlv_vent_aqua from "$lib/images/btn-img-vlv-vent-aqua.svg"
    import btn_img_vlv_flow_grey from "$lib/images/btn-img-vlv-flow-grey.svg"
    import btn_img_vlv_flow_orange from "$lib/images/btn-img-vlv-flow-orange.svg"
    import btn_img_vlv_build_grey from "$lib/images/btn-img-vlv-build-grey.svg"
    import btn_img_vlv_build_green from "$lib/images/btn-img-vlv-build-green.svg"

    export let cfg = new Config( )

    let ssp_dur = cfg.cfg_ssp_dur / 3600000
    let sscvf_dur = cfg.cfg_sscvf_dur / 3600000

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

    $: btn_img_vlv_vent = ( cfg.cfg_vlv_tgt == MODES.VENT ? btn_img_vlv_vent_aqua : btn_img_vlv_vent_grey)
    $: btn_img_vlv_flow = ( cfg.cfg_vlv_tgt == MODES.HI_FLOW ? btn_img_vlv_flow_orange : btn_img_vlv_flow_grey)
    $: btn_img_vlv_build = ( cfg.cfg_vlv_tgt == MODES.BUILD ? btn_img_vlv_build_green : btn_img_vlv_build_grey)

</script>

<div class="flx-col container">
    
    <div class="flx-col cont">

        <div class="flx-col sec">
            <div class="flx-row in">Valve Position</div>

            <div class="flx-row field">
                <div class="flx-row title">Mode</div>
                <div class="vert-line"/>
                <div class="flx-row panel-title-btns">   
                    <PillButton
                        img={ btn_img_vlv_build }
                        on:click={ ( ) => { cfg.cfg_vlv_tgt = MODES.BUILD } }
                        hint='BUILD'
                    />
                    <PillButton
                        img={ btn_img_vlv_vent }
                        on:click={ ( ) => { cfg.cfg_vlv_tgt = MODES.VENT } }
                        hint='VENT'
                    />    
                    <PillButton
                        img={ btn_img_vlv_flow }
                        on:click={ ( ) => { cfg.cfg_vlv_tgt = MODES.HI_FLOW } }
                        hint='FLOW'
                    />
                </div>
            </div>
        </div>

        <div class="flx-col sec">
            <div class="flx-row in">Surface Casing Vent Depth - Max Pressure 
                <span class="fg-accent">{ Number( cfg.cfg_scvd * cfg.cfg_scvd_mult ).toFixed( 3 ) }</span> kPa
            </div>
            <div class="flx-row unit">
                <div class="flx-row title"></div>
                <div class="vert-line"/>
                <div class="flx-row col-head">Depth (m)</div>
                <div class="flx-row col-head">Multi (kPa/m)</div>
                <div class="flx-row col-head"></div>
            </div>
            <div class="flx-row field">
                <div class="flx-row title">SCVD</div>
                <div class="vert-line"/>
                <div class="flx-row value">
                    <InputNum
                        enabled={true}
                        is_integer={false}
                        bind:num={cfg.cfg_scvd}
                    />
                </div>

                <div class="flx-row value">
                    <InputNum 
                        enabled={true}
                        is_integer={false}
                        bind:num={ cfg.cfg_scvd_mult }
                    />
                </div>

                <div class="flx-row value"></div>
            </div>
        </div>
        

        <div class="flx-col sec">
            <div class="flx-row in">Stabilized Shut-In Pressure</div>
            <div class="flx-row unit">
                <div class="flx-row title"></div>
                <div class="vert-line"/>
                <div class="flx-row col-head">Rate (kPa/hr)</div>
                <div class="flx-row col-head">Duration (hrs)</div>
                <div class="flx-row col-head"></div>
            </div>
            <div class="flx-row field">
                <div class="flx-row title">SSP</div>
                <div class="vert-line"/>
                <div class="flx-row value">
                    <InputNum
                        enabled={true}
                        bind:num={cfg.cfg_ssp_rate}
                    />
                </div>
                
                <div class="flx-row value">
                    <InputNum 
                        enabled={true}
                        bind:num={ssp_dur}
                    />
                </div>
                <div class="flx-row value"></div>
            </div>
        </div>

        <div class="flx-col sec">
            <div class="flx-row in">Flow Alarm Settings </div>
            <div class="flx-row unit">
                <div class="flx-row title"></div>
                <div class="vert-line"/>
                <div class="flx-row col-head">Max (L/min)</div>
                <div class="flx-row col-head">Toggle (L/min)</div>
                <div class="flx-row col-head">Stable (hrs)</div>
            </div>
            <div class="flx-row field">
                <div class="flx-row title">Flow</div>
                <div class="vert-line"/>
                <div class="flx-row value">
                    <InputNum 
                        enabled={true}
                        is_integer={false}
                        bind:num={cfg.cfg_hi_scvf}
                    />
                </div>
                <div class="flx-row value">
                    <InputNum 
                        enabled={true}
                        is_integer={false}
                        bind:num={cfg.cfg_flow_tog}
                    />
                </div>
                <div class="flx-row value">
                    <InputNum 
                        enabled={true}
                        is_integer={false}
                        bind:num={sscvf_dur}
                    />
                </div>
            </div>
        </div>
        
        <!-- <div class="flx-col sec"> -->
            <div class="flx-row in">Measurements</div>
            <div class="flx-row unit">
                <div class="flx-row title"></div>
                <div class="vert-line"/>
                <div class="flx-row col-head">Sample (sec)</div>
                <div class="flx-row col-head">Log (sec)</div>
                <div class="flx-row col-head">Transmit (sec)</div>
            </div>
            <div class="flx-row field"><div class="flx-row title">Operation</div>
                <div class="vert-line"/>
                <div class="flx-row value">
                    <InputNum
                        enabled={true}
                        is_integer={false}
                        bind:num={op_sample}
                    />
                </div>
                <div class="flx-row value">    
                <InputNum 
                        enabled={true}
                        is_integer={true}
                        bind:num={op_log}
                    />
                </div>
                <div class="flx-row value">    
                <InputNum 
                        enabled={true}
                        is_integer={true}
                        bind:num={op_trans}
                    />
                </div>
            </div>
            <!-- <div class="flx-row field"> <div class="flx-row title">Diagnostic</div>
                <div class="vert-line"/>
                <div class="flx-row value">
                    <InputNum
                        enabled={true}
                        is_integer={true}
                        bind:num={diag_sample}
                    />
                </div>
                <div class="flx-row value">
                    <InputNum 
                        enabled={true}
                        is_integer={true}
                        bind:num={diag_log}
                    />
                </div>
                <div class="flx-row value">
                    <InputNum 
                        enabled={true}
                        is_integer={true}
                        bind:num={diag_trans}
                    />
                </div>
            </div> -->
        <!-- </div> -->
        
    </div>  

</div>

<style>

    /* .container {
        min-width: 35em;
    }   */

    .cont {
        gap: 0;
    }

    .panel-title-btns {
        margin-top: 0.5em;
        gap: 2em;
    }

    .sec {
        gap: 0;  
        padding-bottom: 1em;
    }
    .in {
        /* display: none; */
        border-bottom: solid 0.05em var(--light_01); 
        padding-bottom: 0.5em;
        justify-content: flex-start;
        align-items: center;
        gap: 0.5em;
    }
    
    .unit { 
        height: 2em; 
        gap: 0;       
    }
    .col-head { 
        color: var(--orange_08); 
        justify-content: flex-start; 
        align-items: center; 
        padding-right: 0.5em;
        max-width: 8em;
        min-width: 8em;
        width: 9em;
    }

    .field { 
        gap: 0;   
        padding-bottom: 0.25em;      
    }
    .title {
        color: var( --accent);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
        width: 6em;
    }

    .value { 
        align-items: center; 
        justify-content: flex-start;
        padding-right: 1em;
        width: auto;
    }

</style>