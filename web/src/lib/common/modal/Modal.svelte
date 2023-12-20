<script context="module"> const modalList = [ ]; </script>

<script>

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    
    import PillButton from "../button/PillButton.svelte";
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

    export let valid = true

</script>

{ #if $isOpen }
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div class="modal" use:modalAction tabindex="0">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="backdrop" />

        <div class="flx-col content-wrapper">

            <div class="flx-row title">
                <slot name="title" { store } >
                    <h3>Modal Title...</h3>
                </slot>
                
                <PillButton 
                    img={ btn_img_cancel }
                    on:click={ close }
                    hint={ 'Cancel' } 
                />
            </div>

            <div class="flx-row content">
                <slot name="content" { store } />
            </div>
            
            <div class="flx-row footer">
                <slot name="footer" { store } >
                    <div>Confirm</div>
                </slot>
                    
                { #if valid }
                <PillButton 
                    img={ btn_img_confirm }
                    on:click={ confirm }
                    hint={ 'Confirm' } 
                />
                { /if }

            </div>

        </div>

    </div>
{ :else }
    <slot />
{ /if }

<style>
    
    .title {
        justify-content: space-between;
    }

    div.modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        /* padding: 1em; */
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
    }
   .content {
        align-items: center;
        width: auto;
        padding:1.5em;
        overflow: hidden;
    }
    .footer {
        justify-content: flex-end;
        align-items: center;
    }

    /* LAP TOP */
    @media(max-width: 1440px) {

        /* .flx-col.content-wrapper {
            min-width: 70%;
 
        } */
    }

    /* TABLET */
    @media(max-width: 1024px) {

        .content {
            border:none;
            padding: 0.5em;
        }
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        .title {
            padding: 0 1em;
        }
        .flx-col.content-wrapper {
            max-width: 100%;
            padding: 0;
            background-color: transparent;
            border: none;
        }
        .content {
            flex-direction: column;
            border:none;
            padding: 0.5em;
        }
        .footer { 
            padding-right: 1em;
        }
    }
</style>