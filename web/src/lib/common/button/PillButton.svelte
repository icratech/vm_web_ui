<script>
    export let cls = 'bg-accent'
    export let type = 'button'
    export let enabled = true
    export let width = "2.5em"
    export let height = "2.5em"
</script>

<button style="width: { width }; height: { height };"
    class={ cls }
    type={ type }
    disabled = { !enabled }
    on:click
>
    <slot></slot>
</button>

<style>

	button {
        cursor: pointer;
        border-radius: 1.25em;
        border: 0.1rem solid var( --light_aa);
        min-width: 2.5em;
        min-height: 2.5em;
        margin: 0.2em;
        padding-left: 0.3em;
	}

</style>