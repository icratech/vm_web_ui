<script>

    import { createEventDispatcher } from "svelte"

    import { RGBA, BASE } from '../../../common/colors'
    import InputText from '../../../common/input_text/InputText.svelte'
    import PillButton from '../../../common/button/PillButton.svelte'
    
    import { Report } from '../../models'

    import btn_img_edit from "$lib/images/btn-img-edit-pink.svg"

    export let rep = new Report( )
    export let highlight = true
    export let selected = false

    export let edit = false
    const startEdit = ( ) => { edit = true }
    const saveEdit = async( ) => {  dispatch( "edit-rep-title", rep ); endEdit( ) }
    const cancelEdit = async( ) => {  /* get original rep data... */ endEdit( ) }
    const endEdit = ( ) => { edit = false }

    let color = BASE.PINK
    $: textColor = RGBA(color, 0.7)
    $: lineColor = RGBA(color, 0.45)

    let dispatch = createEventDispatcher( )

</script>

<div class="flx-col container" style="
    border-right: solid 0.05em { ( rep.selected && highlight ? lineColor : 'transparent' ) }; 
    background-color: { ( selected ? RGBA(color, 0.1) : '' ) };" 
        on:keydown on:click={ ( ) => { 
            dispatch( "report-selected", rep ) 
            rep.selected = true
        } } >   

    <div class="flx-col title-block">
        <div class="flx-row title" style="border-bottom: solid 0.05em { lineColor };">
            { #if edit }
                <InputText bind:txt={ rep.rep_title } place={ "Please enter a report title" } enabled={ edit } />
            { :else }
                { rep.rep_title }
            { /if }
        </div>
        
        <div class="flx-row sub-title">
            <!-- { #if edit }
            <div class="flx-row btns"> 
                <div class="flx-row btn fg-red_08" on:click={ cancelEdit } on:keyup>CANCEL</div>
                <div class="flx-row btn fg-green_08" on:click={ saveEdit } on:keyup>SAVE</div>
            </div>
            { :else }
            <div class="flx-row btns"> 
                <div class="flx-row btn" style="color: { textColor };" on:click={ startEdit } on:keyup>EDIT</div>
                <div class="flx-row btn" style="color: { textColor };" on:click={ ( ) => { dispatch( "generate-pdf", rep ) } } on:keyup>PDF</div>
                <div class="flx-row btn" style="color: { textColor };" on:click={ ( ) => { dispatch( "generate-csv", rep ) } } on:keyup>CSV</div>
            </div>
            { /if } -->
            
            <div class="flx-row btns"> 
                <div class="flx-row btn fg-red_08" on:click={ ( ) => { dispatch( "generate-pdf", rep ) } } on:keyup>PDF</div>
                <div class="flx-row btn fg-green_08" on:click={ ( ) => { dispatch( "generate-csv", rep ) } } on:keyup>CSV</div>
            </div>
            
            <div class="flx-row secs">
                <div class="lbl">Report Sections:</div>
                <div class="val" style="color: { textColor };">{ rep.rep_secs.length }</div> 
            </div>
        </div>
    </div>

<!--         
    <div class="flx-row title-bar" style="border-bottom: solid 0.05em { borderColor } ">

        <PillButton 
            on:click={ toggleEdit }
            img={ btn_img_edit }
            hint={ 'Edit' }
        />

        <div class="flx-col title-block">
            <div class="flx-row title">{ rep.rep_title }</div>
            <div class="flx-row secs">
                <div class="lbl">Sections:</div>
                <div class="val">{ rep.rep_secs.length }</div> 
            </div>
        </div>

        <div class="flx-row btns"> 
            <div class="flx-row fg-red" on:click={ ( ) => { dispatch( "generate-pdf", rep ) } } on:keyup>PDF</div>
            <div class="flx-row fg-green" on:click={ ( ) => { dispatch( "generate-csv", rep ) } } on:keyup>CSV</div>
        </div>
        
    </div> -->
       

</div>

<style>

    .container{
        justify-content: space-between;
        align-items: flex-start; 
        padding: 0.5em;
    }
    .container:hover {
        background-color: var(--light_005);
    }
    .title-block {
        justify-content: space-between;
        padding-top: 0;
        padding-right: 0.5em;
        width: 100%;
        gap: 0.35em;
    }

    .title {
        color: var(--light_05);
        font-size: 1.2em;
        padding: 0.5em;
        padding-top: 0;
    }

    .sub-title {
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
    }


</style>