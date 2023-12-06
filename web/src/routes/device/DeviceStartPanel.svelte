
<script>

    import { onMount } from 'svelte'
    
    import HeaderBuilder from '../../lib/components/header/HeaderBuilder.svelte'
    import ConfigBuilder from '../../lib/components/config/ConfigBuilder.svelte'

    import { Device } from '../../lib/des_api'

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
    <HeaderBuilder bind:hdr={ device.hdr }/>
    <ConfigBuilder bind:cfg={ device.cfg }/>
</div>

<style>

    /* LAP TOP */
    @media(max-width: 1440px) {

    }

    /* TABLET */
    @media(max-width: 1024px) {
        
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        .panel { flex-direction: column; }
    }

</style>