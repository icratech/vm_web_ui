<script>

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    import { debug } from '../../../des/utils'
    import { RGBA, BASE } from '../../../common/colors'
    import PillButton from '../../../common/button/PillButton.svelte'
    import DateTimeDisplay from '../../../common/date_time/DateTimeDisplay.svelte'

    import { Job } from '../../job'
    import { Section, MODES, getMode } from '../../models'
    import { CHT_COLORS } from '../../chart_display'
    
    import btn_img_edit_green from "$lib/images/btn-img-edit-green.svg"
    import btn_img_edit_aqua from "$lib/images/btn-img-edit-aqua.svg"
    import btn_img_edit_orange from "$lib/images/btn-img-edit-orange.svg"
    import btn_img_edit_yellow from "$lib/images/btn-img-edit-yellow.svg"
    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"

    export let job = new Job( )
    export let sec = new Section( )
    $: cfg = job.configs.reduce( ( pre, cur ) => { return ( 
        pre &&
        pre.cfg_time >= sec.sec_start &&
        pre.cfg_time < sec.sec_end &&
        pre.cfg_vlv_tgt == pre.cfg_vlv_pos //&&
        // cur.cfg_vlv_tgt == cur.cfg_vlv_pos
    ) ? pre : cur } )

    $: smp = job.samples.reduce( ( pre, cur ) => { return ( 
        pre && 
        pre.smp_time > sec.sec_start && 
        pre.smp_time < sec.sec_end && 
        pre.smp_hi_flow > cur.smp_hi_flow 
    ) ? pre : cur } )

    $: color = BASE.LIGHT
    $: textColor = RGBA(color, 0.7)
    $: color_code_fg = 'fg-accent'
    $: color_code_btn = btn_img_edit_aqua
    $: color_code_border = RGBA(color, 0.25)
    $: {
        let mode = getMode( cfg, smp )
        // debug( "ReportSecTitle -> mode: ", mode )
        switch ( mode ) {

            case MODES.BUILD: 
                color = CHT_COLORS.PRESS
                color_code_fg = 'fg-green'
                color_code_btn = btn_img_edit_green
                break

            case MODES.VENT: 
                color = BASE.AQUA
                color_code_fg = 'fg-aqua'
                color_code_btn = btn_img_edit_aqua
                break

            case MODES.HI_FLOW:
                color = CHT_COLORS.HI_FLOW
                color_code_fg = 'fg-orange'
                color_code_btn = btn_img_edit_orange
                break

            case MODES.LO_FLOW:
                color = CHT_COLORS.LO_FLOW
                color_code_fg = 'fg-yellow'
                color_code_btn = btn_img_edit_yellow
                break
        }
    }

    let edit = false
    const toggleEdit = ( ) => { 
        edit = !edit
    }

</script>

<div class="flx-col container" style="
    border-right: solid 0.1em { ( sec.selected ? color_code_border : 'transparent' ) };  
    background-color: { ( sec.selected ? RGBA(color, 0.1) : '' ) };" 
    on:keydown on:click={ ( ) => { 
        dispatch( "section-selected", sec )
        sec.selected = true
    } } 
>

    <div class="flx-row">

        <div class="flx-row title" style="color: { textColor }; border-bottom: solid 0.1em { color_code_border };">
            { sec.sec_name }
        </div>

    </div>

    <div class="flx-row sub-title">
        <!-- <div class="flx-col"></div> -->
        <div class="flx-col  sec-dates">
            <div class="flx-row start">
                <div class="flx-row field">
                        <div class="flx-row field-title { color_code_fg }">Start</div>
                    <div class="vert-line"/> 
                    <div class="flx-row date"><DateTimeDisplay date={ sec.sec_start } cls={ color_code_fg } /></div>
                </div>        
            </div>
    
            <div class="flx-row end">
                <div class="flx-row field">
                    <div class="flx-row field-title { color_code_fg }">End</div>
                    <div class="vert-line"/> 
                    <div class="flx-row date"><DateTimeDisplay date={ sec.sec_end } cls={ color_code_fg } /></div>
                </div>      
            </div>
        </div>

        <!-- <div class="flx-col btn">
            { #if edit }
            <PillButton 
                on:click={ toggleEdit }
                img={ btn_img_cancel }
                hint={ 'Cancel' }
            />
            <PillButton 
                img={ btn_img_confirm }
                hint={ 'Confirm' }
            />
            { :else }
            <PillButton 
                on:click={ toggleEdit }
                img={ color_code_btn }
                hint={ 'Edit' }
            />
            { /if }
        </div> -->

        <!-- <div class="flx-row start">
            <div class="flx-row field">
                    <div class="flx-row field-title { color_code_fg }">Start</div>
                    <div class="vert-line"/> 
                    <div class="flx-row date"><DateTimeDisplay date={ sec.sec_start } cls={ color_code_fg } showTime={ false } /></div>
            </div>        
            <div class="flx-row field">
                    <div class="flx-row field-title"></div>
                    <div class="vert-line"/> 
                    <div class="flx-row date"><DateTimeDisplay date={ sec.sec_start } cls={ color_code_fg } showDate={ false } /></div>
            </div>
        </div>

        <div class="flx-row end">
            <div class="flx-row field">
                    <div class="flx-row field-title { color_code_fg }">End</div>
                    <div class="vert-line"/> 
                    <div class="flx-row date"><DateTimeDisplay date={ sec.sec_end } cls={ color_code_fg } showTime={ false } /></div>
                </div>        
                <div class="flx-row field">
                    <div class="flx-row field-title"></div>
                    <div class="vert-line"/> 
                    <div class="flx-row date"><DateTimeDisplay date={ sec.sec_end } cls={ color_code_fg } showDate={ false } /></div>
            </div>
        </div> -->
        


    </div>
    
</div>

<style>
    .container {
        /* border-radius: 0.5em; */
        padding: 0.5em;
        gap: 0;
    }
    .container:hover {
        background-color: var(--light_007);
    }
    .title {
        font-size: 1.2em;
        padding: 0.5em;
        padding-top: 0;
        padding-bottom: 0.25em;
    }
    .sub-title {
        padding-left: 3em;
    }
    
    .sec-dates {
        justify-content: space-between;
        padding: 0;
        gap:0;
    }

    .btn {
        width:auto;
        padding-right: 0.75em;
        gap: 0.5em;
    }

    .field { 
        height: 2em; 
        gap: 0;         
    }
    
    .field-title {
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 3em;
        min-width: 3em;
        width: 3em;
    }
    .start {
        align-items: flex-start;
        padding-bottom: 0.25em;
        gap: 0;
    }
    .end {
        align-items: flex-start;
        margin-top: -0.25em;
        gap: 0;
    }

</style>