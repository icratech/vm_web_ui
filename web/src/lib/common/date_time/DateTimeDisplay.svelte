
<script>
    
    import { debug } from "../../des/utils"
    import { validateUnixMilli } from "../format";

    export let cls = 'fg-accent'
    export let showTime = true
    export let showDate = true
    export let date = 0

    $: date = validateUnixMilli( date )

    $: d = new Date( date )
    $: ye = ( date == 0 ? 'yyyy' : d.getFullYear( ) )
    $: mo = ( date == 0 ? 'MMM' : new Intl.DateTimeFormat( 'en', { month: 'short' } ).format( date ) )
    $: da = ( date == 0 ? 'dd' : d.getDate( ) )
    $: hr = ( date == 0 ? 'hh' : String( d. getHours( ) ).padStart( 2, "0") )
    $: mn = ( date == 0 ? 'mm' : String( d. getMinutes( ) ).padStart( 2, "0" ) )
    $: sc = ( date == 0 ? 'ss' : String( d. getSeconds( ) ).padStart( 2, "0" ) )

    $: col = ( date == 0 ? 'off' :  'val' ) 
</script>

<div class="flx-row container">

    { #if showDate }
    <div class="flx-row seg">
        <div class={ col }>{ ye }</div>
        <div>-</div>
        <div class={ ( date == 0 ? 'off' :  cls ) }>{ mo.toLocaleUpperCase( ) }</div>
        <div>-</div>
        <div class={ col }>{ da }</div>
    </div>
    { /if }
    
    { #if showTime }
    <div class="flx-row seg">
        <div class={ col }>{ hr }</div>
        <div class={ cls }>:</div>
        <div class={ col }>{ mn }</div>
        <div class={ cls }>:</div>
        <div class={ col }>{ sc }</div>
    </div>
    { /if }
    
</div>

<style>
    .container {
        gap: 1em;
        width: auto;
        align-items: center;
    }
    .seg {
        width: auto;
        justify-content: flex-end;
        gap: 0.15em;
    }
    .val {
        color: var(--light_a);
    }
    .off {
        color: var(--light_02);
    }
</style>