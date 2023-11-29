<script>

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    import PillButton from '../../common/button/PillButton.svelte'
    import btn_img_remove from "$lib/images/btn-img-remove-red.svg"
    import btn_img_edit from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_exp from "$lib/images/btn-img-exp-orange.svg"
    import btn_img_collapse from "$lib/images/btn-img-collapse-orange.svg"
	import { 
        // Job, 
        Report 
    } from "../../des_api"

    // export let job = new Job( )
    export let rep = new Report( )

    let exp = false
    const toggleExp = ( ) => {
        exp = !exp
        dispatch( "exp" )
    }

</script>

<div class="flx-row container">

    <div class="flx-row">

        <PillButton 
            img={ btn_img_edit }
            hint={ 'Edit' }
        />

        <div class="flx-col title-block" on:click={ ( ) => { dispatch( "report-selected", rep ) } } on:keydown>
            <div class="flx-row title">{ rep.rep_title }</div>
            <div class="flx-row secs">
                <div class="lbl">Sections:</div>
                <div class="val">{ rep.rep_secs.length }</div> 
            </div>
        </div>

    </div>
       
    <div class="flx-row btns"> 

        <PillButton 
            img={ btn_img_remove }
            hint={ 'Remove' }
        />

        <PillButton 
            on:click={ toggleExp }
            img={ ( exp ? btn_img_collapse : btn_img_exp )  }
            hint={ null }
        />

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
        justify-content: flex-end; 
        /* align-items: flex-start;  */
        width: auto;
        gap: 1em;
    }


</style>