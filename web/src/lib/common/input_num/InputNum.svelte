<script>

    export let num = 0.0
    export let width = "7em"
    export let enabled = false
    export let is_integer = false
    $: place = ( is_integer ? 0 : 0.0 )

    const format = ( ) => {
        if (num !== null && num !== undefined ) { 
            num = ( is_integer ? Math.floor( Number(num) ) : Number(num).toFixed(3) )
        } // debug( "num: ", num )
    }
</script>


<input style="width: { width }; text-align: center"
    type="number" 
    bind:value={ num }
    placeholder= { place }
    disabled={ !enabled }
    on:focusout={ format }
>

