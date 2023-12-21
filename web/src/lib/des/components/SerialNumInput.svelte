<script>

    import { debug } from "../utils"
    import { formatSerialNumber } from "../device"
    import InputText from "../../common/input_text/InputText.svelte"
    
    export let txt = null
    export let place = ""
    export let cls = "fg-aqua"
    export let enabled = false

    /* WE ACCEPT UPTO 10, ALPHANUMERIC, UPPERCASE CHARACTERS */

</script>

<InputText bind:cls bind:enabled bind:txt bind:place 
    on:input={ ( ) => { txt = formatSerialNumber( txt ) } }
/>