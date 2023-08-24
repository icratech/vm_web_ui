
<script>
    export let date = 0
    export let d = new Date(date)
    $: ye = d.getFullYear()
    $: mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    $: da = d.getDay()
    $: hr =  String(d. getHours()). padStart(2, "0")
    $: mn = String(d. getMinutes()). padStart(2, "0")
    $: sc = String(d. getSeconds()). padStart(2, "0")
</script>

<div class="flx-row container">

    <div class="flx-row seg">
        <div >{ ye }</div>
        <div>-</div>
        <div class="fg-accent">{ mo }</div>
        <div>-</div>
        <div >{ da }</div>
    </div>
    
    <div class="flx-row seg">
        <div >{ hr }</div>
        <div class="fg-accent">:</div>
        <div>{ mn }</div>
        <div class="fg-accent">:</div>
        <div >{ sc }</div>
    </div>
    
</div>

<style>
    .container {
        /* justify-content: flex-end; */
        gap: 1em;
    }
    .seg {
        width: auto;
        justify-content: flex-end;
        gap: 0.15em;
    }
</style>