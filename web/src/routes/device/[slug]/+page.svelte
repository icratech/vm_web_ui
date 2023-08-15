<script>

    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import DeviceControls from '../../device/DeviceControls.svelte'
    import BarGaugeCard from "../../../lib/components/gauge/BarGaugeCard.svelte"
    import EventCard from "../../../lib/components/event/EventCard.svelte"
    import ConfigCard from "../../../lib/components/config/ConfigCard.svelte"
    
    export let data
</script>

<dvi class="flx-col container">

    <div class="flx-row title">     
        <div class="flx-row sn">
            <h3 class="g">SN:</h3>
            <h3>{ data.device.reg.des_dev_serial }</h3>
        </div>  
        <div class="flx-col cv">
            <div class="flx-row" style="justify-content: flex-end;">
                <div class="sml">class</div>
                <div class="g">{ data.device.reg.des_dev_class }</div>
            </div>
            <div class="flx-row" style="justify-content: flex-end;">
                <div class="sml">version</div>
                <div class="g">{ data.device.reg.des_dev_version }</div>
            </div>
        </div>
    </div>

    <div class="flx-row layout">

        <DeviceControls bind:device={ data.device }/>

        <div class="flx-col content">

            <div class="flx-row panel">
                <div class="flx-col card">
                    <BarGaugeCard />
                </div>
                
                <ConfigCard bind:config={ data.device.job.configs[0] } />
                
                <EventCard bind:event={ data.device.job.events[0]  } />
            </div>
        
            <div class="flx-row tabs">
        
                <PillButton 
                    cls={ 'bg-blue' }
                    on:click={ ( ) => { data.device.job.cht.options.scales.y_hi_flow.display = !data.device.job.cht.options.scales.y_hi_flow.display } }
                >?</PillButton>
        
                <PillButton
                    cls={ 'bg-purple_a' }
                    on:click={ ( ) => { data.device.job.cht.options.scales.y_mot_volt.display = !data.device.job.cht.options.scales.y_mot_volt.display } }
                >?</PillButton>
        
                <PillButton
                    cls={ 'bg-aqua_a' }
                >?</PillButton>
        
                <PillButton
                    cls={ 'bg-red' }
                    on:click={ ( ) => { data.device.job.cht.options.scales.y_bat_amp.display = !data.device.job.cht.options.scales.y_bat_amp.display } }
                >?</PillButton>
        
            </div>
            
            <div class="flx-col card-content chart">
                <LineChart bind:chartdata={ data.device.job.cht } />
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
    .title {
        justify-content: space-between;
        padding-bottom: 0.5em;
        width: 20em;
    }
    .sn {
        padding-top: 0;
    }
    .cv {
        width: auto;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 0em;
    }
    .g { color: var(--green_a); }


    .content {
        border-top: solid 0.05em var(--grey_aa);
        border-right: solid 0.05em var(--grey_aa);
        background-color: var(--light_aa);
        border-radius: 0.5em;
        padding: 1em;
        height: 100%;
        overflow: hidden;
    }

    .chart {
        height: 70%;
    }
    .panel {
        justify-content: space-between;
        height: 30%;
    }

</style>