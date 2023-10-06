<script>

    export let txt = null
    export let place = ""
    export let lbl = null
    export let cls = "fg-aqua"
    export let enabled = false
    export let auto = ""

</script>

<div class="flx-col container">

    { #if lbl != null }
        <p class="{ cls } lbl">{ lbl }</p>
    { /if }

    <input 
        type="password" 
        bind:value={ txt }
        spellcheck=value
        placeholder= { place }
        disabled = { !enabled }
        autocomplete={ auto }
    >

</div>

<style>

    .container {
        gap: 0.25rem;
    }

    .lbl {
        font-size: 0.9rem;
        width: 35%;
        padding-left: 0.75rem;
        text-align: end;
    }

    input {
        color: var(--light);
        background-color: var(--aqua_01);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
        width: 100%;
    }

    input:disabled {
        color: var(--grey);
		border: 0.1rem solid transparent;
    }

</style>