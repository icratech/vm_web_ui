<script>

    export let name = "x" // without a name, chrome sometimes thinks it should suggest a password...
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
        on:input
        on:focusout
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

</style>