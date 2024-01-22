<script>

    export let lbl = null
    export let cls = "fg-orange"
    export let group
    export let name = null
    export let value
    export let enabled = true

</script>

<div class="flx-col stack">
    <p class={ cls }>{ lbl }</p>
    <input class="radio" type="radio"
        bind:group={ group }
        name={ name }
        value={ value }
        disabled={ !enabled }
    >
</div>

<style>
    .stack{
        gap: 0.25em;
        padding: 0.25em 0;
        align-items: center;
    }
</style>