<script>
    
    import LineChart from '../../../lib/common/chart/LineChart.svelte'
    import DeviceInfo from '../DeviceInfo.svelte'

    import Modal from '../../../lib/common/modal/Modal.svelte'
    import DeviceStartPanel from '../DeviceStartPanel.svelte'
    import HeaderPanel from "../../../lib/components/header/HeaderPanel.svelte"
    import ConfigPanel from "../../../lib/components/config/ConfigPanel.svelte"
    import EventPanel from "../../../lib/components/event/EventPanel.svelte"

    export let data
    import { DEVICES } from '../../../lib/des_api'
    $: device = $DEVICES.filter( ( d ) => { return d.reg.des_dev_serial == data.serial } )[0]

    /* USED TO EXPOSE THE MODALS' OPEN( ) METHOD 
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
                    <HeaderPanel bind:device />
                </div>

                <div class="flx-col panel-cont">
                    <ConfigPanel bind:device />
                </div>

                <div class="flx-col panel-cont">
                    <EventPanel bind:device />
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
        overflow: hidden;
        justify-content: space-between;
        height: 100%;
    }

    .panel-cont { 
        background-color: var(--light_002);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        padding: 1em;
        gap: 0.5em; 
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
    }


</style>