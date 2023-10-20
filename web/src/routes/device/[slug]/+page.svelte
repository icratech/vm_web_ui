<script>

    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import DeviceControls from '../../device/DeviceControls.svelte'
    import DeviceControlsMobile from '../../device/DeviceControlsMobile.svelte'

    import Modal from '../../../lib/common/modal/Modal.svelte'
    import DeviceStartPanel from '../DeviceStartPanel.svelte'
    import HeaderPanel from '../../../lib/components/header/HeaderPanel.svelte'
    import ConfigPanel from '../../../lib/components/config/ConfigPanel.svelte'
    
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
            <DeviceControls bind:device on:start={ async( ) => { modal.open( ) } }/>
        </div>
        
            
        <div class="flx-col panel">
    
            <div class="flx-col chart">
                <LineChart bind:chartdata={ device.cht } />
            </div>
    
            <div class="flx-row action">

                    <div class="flx-col tabs">

                        <PillButton
                            cls={ 'bg-light' } 
                            on:click={ device.setAdmin }
                            hint='ADM'
                        />
                
                        <PillButton
                            cls={ 'bg-light' }
                            on:click={ device.setHeader }
                            hint='HDR'
                        />
                
                        <PillButton
                            cls={ 'bg-light' }
                            on:click={ device.setConfig }
                            hint='CFG'
                        />
            
                        <PillButton
                            cls={ 'bg-aqua' }
                            on:click={ ( ) => { device.setMode( 2 ) } }
                            hint='VENT'
                        />    

                        <PillButton
                            cls={ 'bg-orange' }
                            on:click={ ( ) => { device.setMode( 4 ) } }
                            hint='FLOW'
                        />
            
                        <PillButton
                            cls={ 'bg-green' }
                            on:click={ ( ) => { device.setMode( 0 ) } }
                            hint='BUILD'
                        />
            
                    </div>
                
                    <HeaderPanel bind:header={ device.hdr }/>

                    <ConfigPanel bind:config={ device.cfg }/>

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

    .tabs {
        align-items: center;
        width: 3.5em;
        padding: 0;
    }

    .action {
        justify-content: space-between;
        height: 100%;
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
        .chart { min-height: 27em; }
        .action {
            flex-direction: row;
            border: none;
            padding: 0;
        }
        .tabs {
            flex-direction: column;
            padding-left: 0.5em;
            width: 3.5em;
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
        .chart { padding: 0; }
        .action {
            flex-direction: column;
            border: none;
            padding: 0;
        }
        .tabs {
            flex-direction: row;
            padding-left: 1em;
        }
    }


</style>