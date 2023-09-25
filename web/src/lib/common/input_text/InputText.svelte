<script>

    export let name = "not-a-password" // without a name, chrome sometimes thinks it should suggest a password...
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
        name = { name }
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
        background-color: var(--aqua_01);
        padding: 0.5rem;
        border-radius: 0.5rem;
        /* border-top: solid 0.05em var(--dark); */
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
        /* border-left: solid 0.05em var(--dark); */
        width: 100%;
    }

    input:disabled {
        color: var(--grey);
		border: 0.1rem solid transparent;
    }

</style>