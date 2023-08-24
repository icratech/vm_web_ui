<script>

    export let txt = null
    export let place = ""
    export let lbl = null
    export let cls = "fg-aqua"
    export let enabled = false
    export let right = false

    
</script>

<div class="flx-row container">

    { #if lbl != null && !right }
        <p class="{ cls } lbl-left">{ lbl }</p>
    { /if }

    <input 
        type="text" 
        bind:value={ txt }
        spellcheck=value
        placeholder= { place }
        disabled = { !enabled }
    >
    { #if lbl != null && right }
        <p class="{ cls } lbl-right">{ lbl }</p>
    { /if }

</div>

<style>

    .container {
        gap: 0.25rem;
    }

    .lbl {
        font-size: 0.9rem;
    }

    .lbl-left {
        font-size: 0.9rem;
        width: 35%;
        padding-left: 0.75rem;
        text-align: end;
    }


    .lbl-right {
        font-size: 0.9rem;
        width: 35%;
        padding-right: 0.75rem;
        text-align: start;
    }

    input {
        color: var(--light);
        background-color: var(--dark);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border-top: solid 0.05em var(--dark);
        border-right: solid 0.05em var(--dark);
        border-bottom: solid 0.05em var(--grey_aa);
        border-left: solid 0.05em var(--grey_aa);
        width: 100%;
    }

    input:disabled {
        color: var(--grey);
		border: 0.1rem solid transparent;
    }

</style>