<script>

    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import DeviceControls from '../../device/DeviceControls.svelte'

    import DeviceCard from '../DeviceCard.svelte'
    import BarGaugeCard from "../../../lib/components/gauge/BarGaugeCard.svelte"
    import EventCard from "../../../lib/components/event/EventCard.svelte"
    import ConfigCard from "../../../lib/components/config/ConfigCard.svelte"
    
    export let data
    import { DEVICES, Admin, Header, Config } from '../../../lib/des_api'
    $: device = $DEVICES.filter( ( d ) => { return d.reg.des_dev_serial == data.serial } )[0]
 
    import Modal from '../../../lib/common/modal/Modal.svelte'
    import DeviceStartPanel from '../DeviceStartPanel.svelte'

    $: open = ( ) => { }
    $: adm = new Admin( )
    $: hdr = new Header( )
    $: cfg  = new Config( )

</script>

<dvi class="flx-col container">

    <div class="flx-row layout">

        <Modal bind:open on:confirm={ ( ) => { device.startJob( ) } }>
            <h3 class='fg-accent' slot="title">Start a new job</h3>
            <div slot="content" class="flx-row">
                <DeviceStartPanel bind:device />
            </div>
            <div slot="footer">Send command</div>
        </Modal>
     
        <DeviceControls bind:device on:start={ ( ) =>{ open( ) } }/>
            
        <div class="flx-col content">

            <div class="flx-col panel">

                <!-- <EventCard bind:event={ data.device.job.events[0]  } />
                
                <ConfigCard bind:config={ data.device.job.configs[0] } />
                
                <EventCard bind:event={ data.device.job.events[0]  } /> -->
                
                <div class="flx-row">
            


                    <div class="flx-col tabs">

                        <PillButton
                            cls={ 'bg-blue' } 
                            hint={ null } 
                            />
                
                        <PillButton
                            cls={ 'bg-aqua' }
                            hint={ null } 
                            />
                
                        <PillButton
                            cls={ 'bg-green' }
                            hint={ null } 
                            />
                
                        <PillButton
                            cls={ 'bg-yellow' }
                            hint={ null } 
                            />
                
                        <PillButton
                            cls={ 'bg-orange' }
                            hint={ null } 
                            />
                
                        <PillButton
                            cls={ 'bg-red' }
                            hint={ null } 
                        />
                
                    </div>
                



                    <PillButton 
                        cls={ 'bg-blue' }
                        on:click={ ( ) => { device.job.cht.options.scales.y_hi_flow.display = !device.job.cht.options.scales.y_hi_flow.display } }
                        hint={ null } 
                    />
            
                    <PillButton
                        cls={ 'bg-purple' }
                        on:click={ ( ) => { device.job.cht.options.scales.y_mot_volt.display = !device.job.cht.options.scales.y_mot_volt.display } }
                        hint={ null } 
                    />
            
                    <PillButton
                        cls={ 'bg-aqua' }
                        hint={ null } 
                    />
            
                    <PillButton
                        cls={ 'bg-red' }
                        on:click={ ( ) => { device.job.cht.options.scales.y_bat_amp.display = !device.job.cht.options.scales.y_bat_amp.display } }
                        hint={ null } 
                    />
            
                </div>

            </div>
    
            <div class="flx-col chart">
                <LineChart bind:chartdata={ device.job.cht } />
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