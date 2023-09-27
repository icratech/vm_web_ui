<script>

    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import DeviceControls from '../../device/DeviceControls.svelte'

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

    <div class="flx-row layout">

        <Modal bind:this={ modal } on:confirm={ async( ) => { device.startJob( ) } }>
            <h3 class='fg-accent' slot="title">Start a new job</h3>
            <div slot="content" class="flx-row">
                <DeviceStartPanel bind:device />
            </div>
            <div slot="footer">Send command</div>
        </Modal>
     
        <DeviceControls bind:device on:start={ async( ) => { modal.open( ) } }/>
            
        <div class="flx-col content">

            <div class="flx-col panel">

                <div class="flx-row">

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
                
                    <div class="flx-row">

                        <HeaderPanel bind:header={ device.hdr }/>

                        <ConfigPanel bind:config={ device.cfg }/>

                    </div>

                </div>

            </div>
    
            <div class="flx-col chart">
                <LineChart bind:chartdata={ device.cht } />
            </div>
    
        </div>
      
    </div>

</dvi>

<style>

    .container {
        height: 100%;
        gap: 1rem;
        overflow-y: hidden;
    }

    .layout {
        height: 100%;
        overflow-y: auto;
    }

    .content {
        /* background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01); */
        border-radius: 0.5em;
        padding: 0 1em;
        height: 100%;
        overflow: hidden;
    }

    .tabs {
        /* justify-content: flex-end; */
        align-items: center;
        width: 2.5em;
        padding: 0;
    }

    .chart {
        height: 65%;
    }
    .panel {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        padding: 1em;
        border-radius: 0.5em;
        gap: 0.5em;
        justify-content: space-between;
        height: 35%;
    }

</style>