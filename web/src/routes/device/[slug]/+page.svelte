<script>

    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import DeviceControls from '../../device/DeviceControls.svelte'
    import DeviceCard from '../DeviceCard.svelte'
    import BarGaugeCard from "../../../lib/components/gauge/BarGaugeCard.svelte"
    import EventCard from "../../../lib/components/event/EventCard.svelte"
    import ConfigCard from "../../../lib/components/config/ConfigCard.svelte"
    
    export let data
</script>

<dvi class="flx-col container">

    <div class="flx-row layout">

        <DeviceControls bind:device={ data.device }/>

        

        <div class="flx-col content">
        
            <div class="flx-col card-content chart">
                <LineChart bind:chartdata={ data.device.job.cht } />
            </div>
            

            <!-- <DeviceCard bind:device={ data.device }/> -->
            <div class="flx-col card-content panel">

                <!-- <EventCard bind:event={ data.device.job.events[0]  } />
                
                <ConfigCard bind:config={ data.device.job.configs[0] } />
                
                <EventCard bind:event={ data.device.job.events[0]  } /> -->
                
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
        border-top: solid 0.05em var(--grey_aa);
        border-right: solid 0.05em var(--grey_aa);
        background-color: var(--light_aa);
        border-radius: 0.5em;
        padding: 1em;
        height: 100%;
        overflow: hidden;
    }

    .chart {
        height: 65%;
    }
    .panel {
        justify-content: space-between;
        height: 35%;
    }

</style>