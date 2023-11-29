<script>

    import PillButton from '../../common/button/PillButton.svelte'
    import InputText from '$lib/common/input_text/InputText.svelte'
    import ReportCardTitle from './ReportCardTitle.svelte'
    import ReportCard from './ReportCard.svelte'
    import { Job, Report, debug } from "../../des_api"

    import btn_img_add from '$lib/images/btn-img-add-pink.svg'
    import btn_img_new_report from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"

    export let job = Job( )

    $: show_rep_list = true
    $: title = ( show_rep_list ? "Report List" : "Create Report" )
    $: reportButtonHint = ( show_rep_list ? "New Report" : "Reports" )
    // $: btn_img_new_report = btn_img_report

    const reloadReports = ( ) => {
        job.getReports( )
        show_rep_list = !show_rep_list
    }
    
    let cur_rep = new Report( )
    let new_rep = new Report( )
    const makeReport = ( ) => {
        debug(  "new report title: ", new_rep.rep_title )
        job.newReport( new_rep )
        cur_rep = new_rep
        new_rep = new Report( )
        reloadReports( )
    }

</script>

<div class="flx-col container">

    <div class="flx-row panel-title-bar">
        <div class="flx-row panel-title-btns">
            
            { #if show_rep_list }
            <PillButton
                img={ btn_img_add }
                on:click={ ( ) => { show_rep_list = !show_rep_list } }
                hint={ reportButtonHint }
            />
            { :else }
            <PillButton 
                on:click={ ( ) => { show_rep_list = true } }
                img={ btn_img_cancel }
                hint={ 'Cancel' } 
            />
            { /if }

        </div>
        <h3 class="panel-title">{ title }</h3>
    </div>

    { #if show_rep_list }
    <div class="flx-col reps">
        { #each job.reports as rep ( rep.rep_id ) }
        <ReportCard bind:job bind:rep on:section-selected on:report-selected />
        { /each }
    </div>
    { :else }
    
    <div class="flx-col">
        <!-- <ReportBuilder bind:job bind:rep on:complete={ reloadReports }/> -->
        <div class="flx-row new-rep">

            <PillButton 
                on:click={ ( new_rep.rep_title != "" ? makeReport : debug( "enter a report title" ) ) }
                img={ btn_img_confirm }
                hint={ 'Confirm' } 
            />

            <InputText bind:txt={ new_rep.rep_title } place={ "Please enter a report title" } enabled={ true } />

        </div>

    </div>
    
    { /if }

</div>


<style>

    .container {
        height: 100%;
        gap: 1rem;
    }

    .panel-title-bar {
        justify-content: space-between;
        /* padding-left: 1em; */
        padding-top: 0;
        padding-right: 0.5em;
        width: 100%;
    }
    .panel-title-btns {
        flex-direction: row;
        width: auto;
    }
    .panel-title {
        align-items: flex-end;
        width: 100%;
    }

    .reps {
        overflow: auto;
        padding-right: 0.5em;
        gap: 0.75em;
    }

    .new-rep {
        gap: 0.5em;
    }

</style>