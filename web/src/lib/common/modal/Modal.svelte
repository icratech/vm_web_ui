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

            <div class="flx-col slots">
                <div class="flx-row title">
                    <slot name="title" { store } >
                        <h3>Modal Title...</h3>
                    </slot>

                </div>
    
                <div class="flx-row content">
                    <slot name="content" { store } />
                </div>
                
                <div class="flx-row footer">
                    
                    <slot name="footer" { store } >
                        <!-- <div>Confirm</div> -->
                    </slot>
                    
                    <div class="flx-row btns">
                        <PillButton 
                            img={ btn_img_cancel }
                            on:click={ close }
                            hint={ 'Cancel' } 
                        />
                            
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
        opacity: 0.95;
    }
    .flx-col.content-wrapper {
        z-index: 11;
        width: auto;
        height: auto;
        border-radius: 0.5em;
        padding: 1.5em;
        background-color: var(--light_003);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    .slots {
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    .title {
        width: 100%;
        justify-content: space-between;
    }
    .btns {
        width: auto;
    }
   .content {
        justify-content: center;
        width: 100%;
        padding: 0.5em;
        overflow-y: auto;
    }
    .footer {
        width: 100%;
        justify-content: flex-end;
        align-items: center;
    }

    /* LAP TOP */
    @media(max-width: 1500px) {

    }

    /* TABLET */
    @media(max-width: 1100px) {
        .content {
            border:none;
        }
    }
    @media(max-width: 1100px) {

        .flx-col.content-wrapper {
            max-width: 90%;
        }
    }

    @media(max-width: 950px) and (max-height: 600px) {

        .flx-col.content-wrapper {
            background-color: transparent;
            border: none;
            height: 80%;
            max-width: 90%;
        }
    }


    /* MOBILE */
    @media(max-width: 450px) { 
        .title {
            padding: 0 1em;
        }
        .flx-col.content-wrapper {
            padding: 0.25em;
            background-color: transparent;
            border: none;
            width: auto;
            height: auto;
        }
        .content {
            flex-direction: column;
            border:none;
            padding: 0.25em;
        }
        .footer { 
            padding-right: 1em;
        }
    }
</style>