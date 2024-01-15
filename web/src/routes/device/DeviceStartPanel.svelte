
<script>

    import { onMount } from 'svelte'

    import { debug } from '../../lib/des/utils'
    
    import { Device } from '../../lib/c001v001/device'
    import HeaderBuilder from '../../lib/c001v001/components/header/HeaderBuilder.svelte'
    import ConfigBuilder from '../../lib/c001v001/components/config/ConfigBuilder.svelte'

    export let device = new Device( )

    onMount( ( ) => {

        /* UPDATES THE TIME... I'M SURE I HAD A REASON AT SOME POINT... */
        const interval = setInterval( ( ) => { 
            let time = Date.now( ) //  debug( "T: ", header.hdr_time )
            device.adm.adm_time = time
            device.sta.sta_time = time
            device.hdr.hdr_time = time
            device.cfg.cfg_time = time
        }, 1000 )
        return ( ) => { clearInterval( interval ) }

    } )


</script>


<div class="flx-row panel">
    <div class="flx-col sec">
        <h3 class="panel-title">Header</h3>
        <HeaderBuilder bind:hdr={ device.hdr }/>
    </div>
    <div class="flx-col sec">
        <h3 class="panel-title">Configuration</h3>
        <ConfigBuilder bind:cfg={ device.cfg }/>
    </div>
    
</div>

<style>

    .panel { 
        gap: 1.5em;
    }
    .sec {
        padding: 0;
        height: 100%;
        width: 355px;
    }

    .panel-title {
        border-bottom: solid 0.05em var(--light_01);
        align-items: flex-end;
        min-height: 1.6em;
        width: 100%;
    }

    /* LAP TOP */
    @media(max-width: 1440px) {

    }

    /* TABLET */
    @media(max-width: 1100px) {
    }

    /* MOBILE */
    @media(max-width: 450px) { 
        .panel { 
            flex-direction: column; 
        }
        
        .sec {
            width: 100%;
        }
    }

</style>