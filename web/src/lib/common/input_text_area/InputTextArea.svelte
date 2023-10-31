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
        <label for={ guid } class="accent" id="lbl">
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

    #lbl {
        font-size: 0.9rem;
    }
	.disp {
        background-color: transparent;
		border-radius: 0.5rem;
	}
    .grow-wrap {
        display: grid;
    }
    .grow-wrap::after {
        content: attr(data-replicated-value) " ";
        white-space: pre-wrap;
        visibility: hidden;
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
