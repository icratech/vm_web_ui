<script>

    import { Guid } from 'js-guid' // npm install js-guid
    import { onMount } from 'svelte'
    
    export let txt = ""
    export let place = ""
    export let lbl = null
    export let enabled = false
    export let remMinHeight = 1.5  
    export let guid = Guid.newGuid( ).StringGuid
    
    let init = null

    onMount( ( ) => { init = true } )
    
    $: { if( init != false & txt != "" ) { resize( ) } }
    
    const resize = async( ) => { // console.log( `Resizing textarea: ${ guid }`)
        let txtArea = document.getElementById( guid )
        txtArea.parentNode.dataset.replicatedValue = txt
    }
    
</script>

<div class="flx-col" id="container">

    { #if lbl != null }
        <label for={ guid } class="accent lbl">
            { lbl }
        </label>
    { /if }

	<div class="disp">

        <div class="grow-wrap">

            <textarea id={ guid } 
                type="text" 
                bind:value={ txt }
                spellcheck=value
                placeholder= { place }
                disabled = { !enabled }
                style="min-height: { remMinHeight }rem;"
                ></textarea>

        </div>

    </div>

</div>

<style>

    #container {    
        gap: 0.25rem;    
    }

    .lbl {
        font-size: 0.9rem;
    }
	.disp {
        background-color: transparent;
		border-radius: 0.5rem;
	}
    
    textarea {
        color: var(--light);
        background-color: var(--aqua_01);
        padding: 0.35em 0.5rem;
        border-radius: 0.5rem;
        border-left: solid 0.15em transparent;
        border-top: solid 0.15em transparent;
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
        width: 100%;
        height: 100%;
        outline: none;
        overflow: hidden;
        white-space: pre-wrap;
    }
    textarea:disabled {
        color: var(--grey);
        border: 0.1rem solid transparent;        
    }
    textarea:focus { outline: 0.05rem solid var(--accent_aa); outline-offset: 0.15rem; }

    .grow-wrap {
        display: grid;
    }
    .grow-wrap::after {
        content: attr(data-replicated-value) " ";
        white-space: pre-wrap;
        visibility: hidden;
        overflow-x: hidden;
    }
    .grow-wrap > textarea {
        resize: none;
        overflow: hidden;
    }
    .grow-wrap > textarea,
    .grow-wrap::after {
        padding: 0.5rem;
        font: inherit;
        grid-area: 1 / 1 / 2 / 2;
    }

</style>
