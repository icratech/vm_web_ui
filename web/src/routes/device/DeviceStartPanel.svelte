
<script>

    import { onMount } from 'svelte'
    
    import HeaderPanel from '../../lib/components/header/HeaderPanel.svelte'
    import ConfigPanel from '../../lib/components/config/ConfigPanel.svelte'

    import { Device } from '../../lib/des_api'

    export let device = new Device( )

    onMount( ( ) => {

        const interval = setInterval( ( ) => { 
            let time = Date.now( ) //  console.log( "T: ", header.hdr_time )
            device.adm.adm_time = time
            device.hdr.hdr_time = time
            device.cfg.cfg_time = time
        }, 1000 )
        return ( ) => { clearInterval( interval ) }

    } )


</script>


<div class="flx-row">
    <HeaderPanel bind:header={ device.hdr }/>
    <ConfigPanel bind:config={ device.cfg }/>
</div>