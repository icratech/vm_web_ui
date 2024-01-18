<script>
    import { createEventDispatcher } from "svelte"

    import { RGBA, BASE } from '../../../common/colors'

    import { Report } from '../../models'

    import PillButton from '../../../common/button/PillButton.svelte'

    export let rep = new Report( )
    export let highlight = true
    

    let color = BASE.PINK
    $: textColor = ( rep.selected && highlight ? RGBA(color, 0.7) : RGBA(BASE.LIGHT, 0.5) )
    $: lineColor = ( rep.selected && highlight ? RGBA(color, 0.30) : RGBA(BASE.LIGHT, 0.15) )
    $: bgColor = ( rep.selected && highlight ? RGBA(color, 0.15) : RGBA(BASE.LIGHT, 0) )

    let dispatch = createEventDispatcher( )

</script>

<div class="flx-col container" style="
    border-right: solid 0.05em { ( rep.selected && highlight ? lineColor : 'transparent' ) };" 
    on:keydown on:click={ ( ) => { 
        dispatch( "report-selected", rep ) 
        rep.selected = true
    } } >
        
    <div class="flx-col title-block">
        <!-- <div class="flx-row title" style="border-bottom: solid 0.05em { lineColor };">{ rep.rep_title }</div> -->
        <div class="flx-row title" style="
            background-color: { bgColor };
            border-bottom: solid 0.05em { lineColor };
        ">{ rep.rep_title }</div>
            
        <!-- <div class="flx-row sub-title">
            <div class="flx-row btns"> 
                { #if rep.selected }
                <div class="flx-row btn fg-red_08" on:click={ ( ) => { dispatch( "generate-pdf", rep ) } } on:keyup>PDF</div>
                <div class="flx-row btn fg-green_08" on:click={ ( ) => { dispatch( "generate-csv", rep ) } } on:keyup>CSV</div>
                { /if }
            </div>

            <div class="flx-row secs">
                <div class="lbl">Sections:</div>
                <div class="val" style="color: { textColor };">{ rep.rep_secs.length }</div> 
            </div>
        </div> -->
    </div>


</div>


<style>

    .container {
        justify-content: space-between;
        align-items: flex-start; 
        border-bottom-right-radius: 0.25em;
        padding: 0;
    }
    .container:hover {
        background-color: var(--light_005);
    }
    .title-block {
        justify-content: space-between;
        padding-top: 0;
        padding: 0;
        width: 100%;
        gap: 0.35em;
    }

    .title {
        border-bottom-right-radius: 0.25em;
        color: var(--light_07);
        font-size: 1.2em;
        padding: 0.5em;
    }

    /* .sub-title {
        justify-content: space-between;
    }

    .btns { 
        align-items: flex-start; 
        padding-left: 0.5em;
        width: auto;
        gap: 0.75em;
    }
    .btn {
        cursor: pointer;
        padding: 0 0.75em;
        border-radius: 0.25em;
        border: solid 0.05em transparent;
    }
    .btn:hover {
        border: solid 0.05em var(--light_03);
    }

    .secs {
        justify-content: flex-end;
        padding-right: 0.5em;
        gap: 0.5em;
    }
    .lbl {
        color: var(--light_a);
    }
    .val {
        font-size: 1.1em;
    } */

</style>