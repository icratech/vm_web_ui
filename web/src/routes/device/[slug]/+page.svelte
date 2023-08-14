
<script>

    import { onMount } from 'svelte'
    import { Device, DEVICES, Job, NewChartData } from "../../../lib/des_api";
    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import DeviceControls from './DeviceControls.svelte'

    export let data
    let device = data.resp.devices.filter( ( d ) => { return d.reg.des_dev_serial == data.serial } )[0]
    let chartdata = device.job.cht
    // $: { console.log( "/device/[slug]/+page device", device ) }
    let ready = true
    // onMount( ( ) => { 
    //         // console.log( "/device/[slug]/+page device", device )
    //         // device.job.cht = NewChartData()
            
    //         // device.job.cht_ch4 = device.job.cht.data.datasets[0]
    //         // device.job.cht_ch4.data = device.job.xypoints.ch4

    //         // device.job.cht_hi_flow = device.job.cht.data.datasets[1]
    //         // device.job.cht_hi_flow.data = device.job.xypoints.hi_flow
        
    //         // device.job.cht_lo_flow = device.job.cht.data.datasets[2]
    //         // device.job.cht_lo_flow.data = device.job.xypoints.lo_flow
        
    //         // device.job.cht_press = device.job.cht.data.datasets[3]
    //         // device.job.cht_press.data = device.job.xypoints.press
        
    //         // device.job.cht_bat_amp = device.job.cht.data.datasets[4]
    //         // device.job.cht_bat_amp.data = device.job.xypoints.bat_amp
        
    //         // device.job.cht_bat_volt = device.job.cht.data.datasets[5]
    //         // device.job.cht_bat_volt.data = device.job.xypoints.bat_volt
        
    //         // device.job.cht_mot_volt = device.job.cht.data.datasets[6]
    //         // device.job.cht_mot_volt.data = device.job.xypoints.mot_volt

    // //     ready = false
    // //     device = data.resp.devices.filter( ( d ) => { return d.reg.des_dev_serial == data.serial } )[0]
    // //     // data.resp.devices.forEach( ( d ) => { if ( d.reg.des_dev_serial == data.serial ) { device = d } } )
    // //     console.log( "/device/[slug]/+page Device", device )
    //     ready = true
    // } )


</script>


<dvi class="flx-col container">

    <h3>SN: { ( device ? device.reg.des_dev_serial : "" ) }</h3>
    <!-- <p>CLASS: { device.des_dev_class }</p>
    <p>VERSION: { device.des_dev_version }</p> -->
    <div class="flx-row layout">

        <DeviceControls bind:device={ device }/>

        <div class="flx-col content">
            { #if ready }
            <div class="flx-col card-content">
                <LineChart bind:chartdata={ chartdata } />
            </div>
            { /if }
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
        height:100%;
        overflow: hidden;
    }

</style>