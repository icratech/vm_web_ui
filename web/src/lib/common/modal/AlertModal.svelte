<script context="module"> const modalList = [ ]; </script>


<script>

    import { openModals, ALERT, ALERT_CODE, ALERT_CODES, debug } from "../../des/utils"
    import { RGBA, BASE } from "../colors"

    import PillButton from "../button/PillButton.svelte"

    const store = openModals( false ) 

    let isOpen = store.isOpen
    export const open = store.open
    export const close = store.close

    const keydown = ( e ) => {
        e.stopPropagation( ) 
        clear_alert( ) 
    }

    const transitioned = ( e ) => {
        const node = e.target 
        node.focus( )
    }

    const modalAction = ( node ) => {
        const returnFn = [ ]
        if( document.body.style.overflow !== 'hidden' ) {
            const original = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            returnFn.push( ( ) => { document.body.style.overflow = original } )
        }
        node.addEventListener( 'keydown', keydown )
        node.addEventListener( 'transitioned', transitioned )
        
        modalList.push( node )
        returnFn.push( ( ) =>{
            node.removeEventListener( 'keydown', keydown )
            node.removeEventListener( 'transitioned', transitioned )
            modalList.pop( )
        } )

        return {
            destroy: ( ) => returnFn.forEach( ( fn ) => fn( ) ),
        }

    }

    let alert_interval_id = null
    const showAlert = ( alert_timeout ) => {
        open( )
        alert_interval_id = setInterval( clear_alert, alert_timeout )
    }
    const clear_alert = ( ) => { 

        if ( alert_interval_id !== null ) { 
            clearInterval( alert_interval_id )
            alert_interval_id = null
        }

        ALERT_CODE.set( 0 )
        ALERT.set( "" )
        close( )
    }

    $: title = ""
    $: color_code = BASE.AQUA
    // $: color_code_txt_alpha = 0.8
    $: color_code_txt = BASE.LIGHT //RGBA(color_code, color_code_txt_alpha)
    $: color_code_bg = RGBA(color_code, 0.2)
    $: color_code_border = RGBA(color_code, 0.4)

    $: { 
        if ( $ALERT !== "" ) {  
            switch ( $ALERT_CODE ) {
                case ALERT_CODES.SUCCESS:
                    title = "SUCCESS:"
                    color_code = BASE.AQUA
                    showAlert( 3000 )
                    break
                case ALERT_CODES.WARNING:
                    title = "WARNING:"
                    color_code = BASE.YELLOW
                    showAlert( 5000 )
                    break
                case ALERT_CODES.ERROR:
                    title = "ERROR:"
                    color_code = BASE.RED
                    open( )
                    break
            }
        } 
    }

</script>

{ #if $isOpen }
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div class="modal" use:modalAction tabindex="0">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="backdrop" />

        <div class="flx-col alert-content">

            <div class="flx-row alert-title" style="color: { color_code_txt };">{ title }</div>

            <div class="flx-row alert-msg" style="
                color: { color_code_txt };
                background-color: { color_code_bg };
                border-right: solid 0.1em { color_code_border };
                border-bottom: solid 0.1em { color_code_border };
                border: solid 0.1em { color_code_border };
            ">{ $ALERT }</div>

            <div class="flx-row alert-btn">
                OK
                <PillButton cls={ 'bg-light' } on:click={ close } />
            </div>

        </div>

    </div>
{ :else }
    <slot />
{ /if }

<style>

    div.modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        padding: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        z-index: 3;
    }
    div.backdrop {
        background-image: url( "$lib/images/bg-img-blue.svg" );
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 4;
        opacity: 0.9;
    }
    .alert-content {
        justify-content: center;
        min-width: 30em;
        max-width: 30em;
        gap: 0.5em;
        z-index: 11;
    }
    .alert-title {
        font-size: 1.8em;
        font-weight: 300; 
        font-style: oblique;
        padding: 0;
    }
    .alert-msg { 
        border-radius: 0.5em;
        font-size: 1.2em;
        padding: 1em;
    }
    .alert-btn {
        justify-content: flex-end;
        align-items: center;
        gap: 0.75em;
    }
    
        
    /* LAP TOP */
    @media(max-width: 1440px) {

        /* .flx-col.content-wrapper {
            width: 70%;
 
        } */
    }

    /* TABLET */
    @media(max-width: 1024px) {
        /* .flx-col.content-wrapper {
            background-image: none;
            background-color: transparent;
            border: none;
            width: 100%;
            margin: 2em;
            padding: 0;
            gap:0;
        } */
        /* div.content {
            border:none;
            padding: 0.5em;
        } */
    }

    /* MOBILE */
    @media(max-width: 425px) { 
         /* .flx-col.content-wrapper {
            width: 70%;
 
        } */
        /* .flx-col.content-wrapper {
            margin: 1em;
        } */
        /* div.content {
            flex-direction: column;
        } */
    }
</style>