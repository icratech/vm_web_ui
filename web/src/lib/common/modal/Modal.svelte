<script context="module"> const modalList = [ ]; </script>

<script>

    import btn_img_cancel from "$lib/images/btn-img-cancel.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm.svg"
    
    import PillButton from "../button/PillButton.svelte";
    import { openModals } from "../../des_api"

    const store = openModals( false ) 
    // export const { isOpen, open, close } = store

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
        // node.focus( )
        modalList.push( node )
        returnFn.push( ( ) =>{
            node.removeEventListener( 'keydown', keydown )
            node.removeEventListener( 'transitioned', transitioned )
            modalList.pop( )
            // modalList[ modalList.length - 1 ]?.focus( )
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

<!-- <slot name="trigger" { open }>
    <button on:click={ open } >Open</button>
</slot> -->
{ #if $isOpen }
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div class="modal" use:modalAction tabindex="0">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- <div class="backdrop" on:click={ close } /> -->
        <div class="backdrop" />

        <div class="flx-col content-wrapper">

            <div class="flx-row title">
                <slot name="title" { store } >
                    <h3>Modal Title...</h3>
                </slot>
                
                <PillButton 
                    cls={ 'bg-red' }
                    img={ btn_img_cancel }
                    on:click={ close }
                    hint={ 'Cancel' } 
                />
            </div>

            <div class="content">
                <slot name="content" { store } />
            </div>
            
            <div class="flx-row footer">
                <slot name="footer" { store } >
                    <div>Confirm</div>
                </slot>
                    
                { #if valid }
                <PillButton 
                    cls={ 'bg-green' }
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
    .footer {
        justify-content: flex-end;
        align-items: center;
    }
    div.modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        z-index: 3;
        /* opacity: 0.9; */
    }
    /* div.modal:not( :focus-within ) {
        transition: opacity 0.5ms;
        opacity: 0.9;
    } */
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
        width: 50%;
        /* max-width: 70vw; */
        border-radius: 0.5em;
        padding: 1.5em;
        background-color: var(--light_003);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    div.content {
        background-image: url( "$lib/images/bg-img-blue.svg" );
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        /* max-height: 50vh; */
        border-radius: 0.5em;
        padding:1.5em;
        gap: 1.5em;
        overflow: hidden;
        opacity: 0.7;
    }
        
    /* LAP TOP */
    @media(max-width: 1440px) {

        .flx-col.content-wrapper {
            width: 70%;
 
        }
    }

    /* TABLET */
    @media(max-width: 1024px) {
        .flx-col.content-wrapper {
            background-image: none;
            background-color: transparent;
            border: none;
            width: 100%;
            margin: 2em;
            padding: 0;
            gap:0;
        }
        div.content {
            /* flex-direction: column; */
            border:none;
            padding: 0.5em;
        }
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        .flx-col.content-wrapper {
            margin: 1em;
        }
        div.content {
            flex-direction: column;
        }
    }
</style>