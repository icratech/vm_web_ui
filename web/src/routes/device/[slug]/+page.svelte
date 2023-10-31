<script>

    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import DeviceInfo from '../DeviceInfo.svelte'

    import Modal from '../../../lib/common/modal/Modal.svelte'
    import DeviceStartPanel from '../DeviceStartPanel.svelte'
    import HeaderBuilder from '../../../lib/components/header/HeaderBuilder.svelte'
    import ConfigBuilder from '../../../lib/components/config/ConfigBuilder.svelte'
    import EventBuilderOp from '../../../lib/components/event/EventBuilderOp.svelte'
    
    import btn_img_adm from "$lib/images/btn-img-adm.svg"
    import btn_img_hdr from "$lib/images/btn-img-hdr.svg"
    import btn_img_cfg from "$lib/images/btn-img-cfg.svg"
    import btn_img_vlv_vent from "$lib/images/btn-img-vlv-vent.svg"
    import btn_img_vlv_flow from "$lib/images/btn-img-vlv-flow.svg"
    import btn_img_vlv_build from "$lib/images/btn-img-vlv-build.svg"

    export let data
    import { DEVICES } from '../../../lib/des_api'
    $: device = $DEVICES.filter( ( d ) => { return d.reg.des_dev_serial == data.serial } )[0]

    /* USED TO EXPOSE THE MODAL'S OPEN( ) METHOD 
    SO IT CAN BE CALLED FROM OTHER COMPONENTS */
    let modal

</script>
<dvi class="flx-col container">

    <div class="flx-row content">

        <Modal bind:this={ modal } on:confirm={ async( ) => { device.startJob( ) } }>
            <h3 class='fg-accent' slot="title">Start a new job</h3>
            <div slot="content" class="flx-row">
                <DeviceStartPanel bind:device />
            </div>
            <div slot="footer">Send command</div>
        </Modal>
     
        <div class="flx-col status">
            <DeviceInfo bind:device on:start={ async( ) => { modal.open( ) } }/>
        </div>
        
        <div class="flx-col panel">
    
            <div class="flx-col chart">
                <LineChart bind:chartdata={ device.cht } />
            </div>
    
            <div class="flx-row action">

                <div class="flx-col panel-cont">
                    <div class="flx-row panel-title-bar">
                        <div class="flx-row panel-title-btns">
                            <PillButton
                                cls={ 'bg-light' } 
                                img={ btn_img_adm }
                                on:click={ device.setAdmin }
                                hint='Send Admin'
                            />
                            <PillButton
                                cls={ 'bg-light' }
                                img={ btn_img_hdr }
                                on:click={ device.setHeader }
                                hint='Send Header'
                            />
                        </div>
                        <h3 class="panel-title">Job Header</h3>
                    </div>
                    <HeaderBuilder bind:header={ device.hdr }/>
                    <div class="flx-row" style="padding-left: 1em;">
                        <div class="flx-row">
                            <p>Logger FW: </p><p style="color: var(--orange)">{ device.hw.hw_log_fw }</p>
                        </div>
                        <div class="flx-row">
                            <p>Modem FW: </p><p style="color: var(--orange)">{ device.hw.hw_mod_fw }</p>
                        </div>
                    </div>
                </div>

                <div class="flx-col panel-cont">
                    <div class="flx-row panel-title-bar">
                        <div class="flx-row panel-title-btns">   
                            <PillButton
                                cls={ 'bg-light' }
                                img={ btn_img_cfg }
                                on:click={ device.setConfig }
                                hint='Send Config'
                            />
                            <PillButton
                                cls={ 'bg-aqua' }
                                img={ btn_img_vlv_vent }
                                on:click={ ( ) => { device.setMode( 2 ) } }
                                hint='VENT'
                            />    
                            <PillButton
                                cls={ 'bg-orange' }
                                img={ btn_img_vlv_flow }
                                on:click={ ( ) => { device.setMode( 4 ) } }
                                hint='FLOW'
                            />
                            <PillButton
                                cls={ 'bg-green' }
                                img={ btn_img_vlv_build }
                                on:click={ ( ) => { device.setMode( 0 ) } }
                                hint='BUILD'
                            />
                        </div>
                        <h3 class="panel-title">Job Configuration</h3>
                    </div>
                    <ConfigBuilder bind:config={ device.cfg }/>
                </div>
                <div class="flx-col panel-cont">
                    <div class="flx-row panel-title-bar">
                        <h3 class="panel-title">Event ( Comment )</h3>
                    </div>
                    <EventBuilderOp bind:device />
                </div>

            </div>

        </div>
      
    </div>

</dvi>

<style>

    .container {
        overflow: hidden;
        height: 100%;
        gap: 1rem;
    }

    .content { 
        height: 100%;
    }

    .status {
        max-width: 25%;
        min-width: 25%;
        width: auto;
        padding-right: 0.5em;
    }

    .panel {
        padding: 0 1em;
        padding-left: 0;
        height: auto;
    }

    .chart { min-height: 38em; }

    .action {
        justify-content: space-between;
        height: 100%;
    }

    .panel-cont { gap: 0.5em; }

    .panel-title-bar {
        justify-content: space-between;
        padding-left: 1em;
        padding-top: 0;
        padding-right: 0.5em;
        width: 100%;
    }
    .panel-title-btns {
        flex-direction: row;
        width: auto;
    }
    .panel-title {
        align-items: flex-end;
        width: 100%;
    }


    /* LAP TOP */
    @media(max-width: 1440px) {
        .status {
            max-width: 33%;
            min-width: 33%;
        }
        .panel { max-width: 67%;  }
        .chart { min-height: 30em; }
    }

    /* TABLET */
    @media(max-width: 1024px) { 
        .container { 
            padding-right: 0.5em; 
        }
        .content { 
            flex-direction: column; 
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0;
        }
        .status {
            max-width: 100%;
            min-width: 100%;
        }
        .panel { 
            padding-right: 0.5em; 
            max-width: 100%;  
            gap: 0.5em;
        }
        .chart { min-height: 23em; }
        .action {
            flex-direction: row;
            border: none;
            padding: 0;
        }
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        .container { 
            padding-right: 0.5em; 
        }
        .content { 
            flex-direction: column; 
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0;
        }
        .status {
            max-width: 100%;
            min-width: 100%;
            height: 300em;
        }
        .panel { 
            padding-right: 0.5em; 
            max-width: 100%;  
            gap: 0.5em;
        }
        .chart { display:none; padding: 0; }
        .action {
            flex-direction: column;
            border: none;
            padding: 0;
            padding-left: 0.5em;
        }
        .panel-title-bar { padding-top: 1em; }
    }


</style>