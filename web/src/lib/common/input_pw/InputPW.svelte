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

</style>