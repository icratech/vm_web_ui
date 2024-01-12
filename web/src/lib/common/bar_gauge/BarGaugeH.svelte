<script>
    import { RGBA, BASE } from "../colors";
    export let title = "Title"
    export let unit = "Unit"
    export let base_color = BASE.AQUA
    export let max = 100
    export let min = 0
    export let num
    let width = 0
    $: { 
        let val = num / ( max - min ) * 100
        width = ( val < 0 ? 0 : val ) 
    }

    const bar_color = RGBA(base_color, 0.15)
    const bar_border_color = RGBA(base_color, 0.45)
    const title_color = RGBA(base_color, 0.65)

</script>

<div class="flx-row container">

    <div class="flx-row title">
        <div style="color: { title_color }">{ title }</div>
    </div>

    <div class="vert-line"/>

    <dvi class="flx-row gauge-contatiner">

        <div class="flx-row bar"  
            style="
                width:{ width }%; 
                background-color: { bar_color }; 
                border: solid 0.1em { bar_border_color };
            ">
        </div>

        <div style="width:{ 100 - width }%"></div>

        <div class="flx-row value">
            <div class="num" style="color: { title_color };">
                { num.toFixed( 2 ) }
            </div>
            
            <div class="unit">{ unit }</div>
        </div>
        

    </dvi>

</div>

<style>
    .container {
        width: 100%;
        gap: 0;
    }

    .title {
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }
    .value {   
        align-items: center;
        width: 9.5em;
        gap: 0.5em;
        padding-left: 1em;
    }

    .gauge-contatiner {
        justify-content: left;
        align-items: center;
        width: 100%;
        gap: 0;
    }

    .bar {
        height: 0.9em;
        /* border-radius: 0.2em; */
        /* border-top-left-radius: 0.25em;
        border-bottom-left-radius: 0.25em; */
    }

    .num {
        font-size: 1.125em;
        width: 6em;
        height: 1.6em;
        text-align: right;
    }
    .unit {
        text-align: left;
        color: var(--grey_a);
        font-size: 0.9em;
        width: 3.5em;
    }

</style>