<script context="module"> const modalList = [ ]; </script>

<script>

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    
    import PillButton from "../button/PillButton.svelte"
    import InputText from "../input_text/InputText.svelte"
    import InputPW from "../input_pw/InputPW.svelte"
    import { openModals } from "../../des/utils"

    const store = openModals( false ) 

    let isOpen = store.isOpen
    export const open = store.open
    export const close = store.close

    const keydown = ( e ) => {
        e.stopPropagation( ) 
        if ( e.key === 'Escape' ) { close( ) }
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

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )
    const confirm = ( ) => { 
        dispatch( 'confirm' ), 
        close( ) 
    }

    export let email = ""
    export let password = ""

</script>

{ #if $isOpen }
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div class="modal" use:modalAction tabindex="0">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="backdrop" />

        <div class="flx-col content-wrapper">

            <h3 class='fg-accent'>Enter your cedentials</h3>

            <div class="flx-col content">

                <div class="flx-row">
                    <div class="flx-row lbl fg-accent">Email:</div>
                    <InputText enabled={ true } bind:txt={ email } place="Email address"/>
                </div>
            
                <div class="flx-row">
                    <div class="flx-row lbl fg-accent">Password:</div>
                    <InputPW enabled={ true } bind:txt={ password } auto="new-password" place="Password"/>
                </div>
            
            </div>
            
            <div class="flx-row confirm"> Login 
                <PillButton 
                    img={ btn_img_confirm }
                    on:click={ confirm }
                    hint={ 'Confirm' } 
                />
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
    .flx-col.content-wrapper {
        z-index: 11;
        width: auto;
        border-radius: 0.5em;
        padding: 1.5em;
        background-color: var(--light_003);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        gap: 0;
    }
   .content {
        align-items: center;
        width: 28em;
        padding:1em 0;
        overflow: hidden;
        /* opacity: 0.9; */
        /* gap: 0.75em; */
    }
    .confirm {
        justify-content: flex-end;
        align-items: center;
        padding: 0;
    }
    .lbl {
        max-width: 4.5em;
        font-size: 1rem;
        align-items: center;
        text-align: end;
    }
        
    /* LAP TOP */
    @media(max-width: 1440px) {

    }

    /* TABLET */
    @media(max-width: 1100px) {

    }

    /* MOBILE */
    @media(max-width: 450px) { 

    }
</style>