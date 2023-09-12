<script context="module"> const modalList = [ ]; </script>

<script>

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
                    on:click={ close }
                    hint={ 'Close' } 
                />
            </div>

            <div class="content">
                <slot name="content" { store } />
            </div>
            
            <div class="flx-row footer">
                <slot name="footer" { store } >
                    <div>Confirm</div>
                </slot>
                    
                <PillButton 
                    cls={ 'bg-green' }
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
        opacity: 0.9;
    }
    /* div.modal:not( :focus-within ) {
        transition: opacity 0.5ms;
        opacity: 0.9;
    } */
    div.backdrop {
        background-image: url( "$lib/images/bg-img-blue.png" );
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 4;
    }
    .flx-col.content-wrapper {
        z-index: 11;
        width: auto;
        /* max-width: 70vw; */
        border-radius: 0.5em;
        padding: 1.5em;
        background-color: var(--light_003);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    div.content {
        background-image: url( "$lib/images/bg-img-blue.png" );
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        /* max-height: 50vh; */
        border-radius: 0.5em;
        padding:1.5em;
        gap: 1.5em;
        overflow: hidden;
    }
</style>