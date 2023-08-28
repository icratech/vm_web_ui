
<script>

    import { onMount } from 'svelte'
    
    import HeaderPanel from '../../lib/components/header/HeaderPanel.svelte'
    import ConfigPanel from '../../lib/components/config/ConfigPanel.svelte'

    import { Admin, Header, Config } from '../../lib/des_api'

    export let adm = new Admin( )
    export let hdr = new Header( ) 
    export let cfg = new Config( )

    onMount( ( ) => {

        const interval = setInterval( ( ) => { 
            let time = Date.now( ) //  console.log( "T: ", header.hdr_time )
            adm.adm_time = time
            hdr.hdr_time = time
            cfg.cfg_time = time
        }, 1000 )
        return ( ) => { clearInterval( interval ) }

    } )


</script>


<div class="flx-row">
    <HeaderPanel bind:header={ hdr }/>
    <ConfigPanel bind:config={ cfg}/>
</div>