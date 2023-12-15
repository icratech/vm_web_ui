<script>

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    import PillButton from '../../common/button/PillButton.svelte'
    import btn_img_remove from "$lib/images/btn-img-remove-red.svg"
    import btn_img_edit from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_add from "$lib/images/btn-img-add-pink.svg"
    import btn_img_exp from "$lib/images/btn-img-exp-orange.svg"
    import btn_img_collapse from "$lib/images/btn-img-collapse-orange.svg"
	import { Job, Report } from "../../des_api"
    import { RGBA, BASE } from '$lib/common/colors'
    // export let job = new Job( )
    export let rep = new Report( )
    export let highlight = true

    let edit = false
    const toggleEdit = ( ) => {
        edit = !edit
        dispatch( "edit" )
    }

    let color = BASE.PINK
    let border_color = RGBA(color, 0.7)
    let bg_color = RGBA(color, 0.1)

</script>

<div class="flx-row container"
    style="border: solid 0.1em { ( rep.selected && highlight ? border_color : 'transparent' ) };  
    background-color: { ( rep.selected && highlight ? bg_color : '' ) };" 
    on:keydown on:click={ ( ) => { 
        dispatch( "report-selected", rep ) 
        rep.selected = true
    } } 
>   

    <div class="flx-row">


        <div class="flx-row btns"> 

            <PillButton 
                on:click={ toggleEdit }
                img={ btn_img_edit }
                hint={ 'Edit' }
            />

            <PillButton 
                on:click={ ( ) => { dispatch( "generate-pdf", rep ) } }
                cls={ 'bg-red' }
                hint={ 'Download PDF' }
            />
            
            <PillButton 
                on:click={ ( ) => { dispatch( "generate-csv", rep ) } }
                cls={ 'bg-light' }
                hint={ 'Download CSV' }
            />

        </div>
        
        <div class="flx-col title-block">

            <div class="flx-row title">{ rep.rep_title }</div>
            <div class="flx-row secs">
                <div class="lbl">Sections:</div>
                <div class="val">{ rep.rep_secs.length }</div> 
            </div>
        </div>
    
    </div>
       

</div>

<style>

    .container{
        justify-content: space-between;
        align-items: flex-start; 
        border-radius: 0.5em;
        padding: 0.5em;
    }
    .container:hover {
        background-color: var(--light_007);
    }

    .title-block {
        gap: 0.35em;
    }

    .title {
        font-size: 1.4em;
        font-style: oblique;
        color: var(--pink_a);
    }

    .secs {
        justify-content: flex-start;
        gap: 0.5em;
    }
    .lbl {
        color: var(--light_a);
    }
    .val {
        font-size: 1.1em;
        color: var(--pink_a);
    }

    .btns { 
        align-items: flex-start; 
        width: auto;
        gap: 0.75em;
    }

</style>