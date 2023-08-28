<script>

    export let num = 0
    export let width = "7em"
    export let enabled = false
    export let is_integer = false
    $: place = ( is_integer ? 0 : 0.0 )

    $:  {
        if (num === null || num === undefined ) { num = 0 } // console.log( "num: ", num )
        num = Number( is_integer ? num.toFixed(0) : num.toFixed(3) )
    }
</script>


<input style="width: { width }; text-align: center"
    type="number" 
    bind:value={ num }
    placeholder= { place }
    disabled = { !enabled }
>


<style>


    input {
        color: var(--light);
        background-color: var(--aqua_01);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
    }

    input:disabled {
        color: var(--grey_a);
        padding: 0.25rem 0.5rem;
		border: 0.1rem solid transparent;
    }

</style>