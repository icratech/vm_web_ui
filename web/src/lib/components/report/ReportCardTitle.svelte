<script>

    import PillButton from '../../common/button/PillButton.svelte'
    import btn_img_remove from "$lib/images/btn-img-remove.svg"
    import btn_img_edit from "$lib/images/btn-img-edit.svg"
    import btn_img_view from "$lib/images/btn-img-view.svg"
	import { 
        // Job, 
        Report 
    } from "../../des_api"

    // export let job = new Job( )
    export let rep = new Report( )


</script>

<div class="flx-row container">

    <div class="flx-row title">{ rep.rep_title }</div>

    <div class="flx-row secs">
        <div class="lbl">Sections:</div>
        <div class="val">{ rep.rep_secs.length }</div> 
    </div>
       
    <div class="flx-row btns"> 

        <PillButton 
            img={ btn_img_remove }
            hint={ 'Remove' }
            cls={ 'bg-red' }
        />
        
        <PillButton 
            img={ btn_img_edit }
            hint={ 'Edit' }
            cls={ 'bg-yellow' }
        />
        
        <PillButton 
            img={ btn_img_view }
            hint={ 'View' }
            cls={ 'bg-accent' }
        />

    </div>

</div>

<style>

    .container{
        justify-content: space-between;
        align-items: center;
    }

    .title {
        font-size: 1.3em;
        font-style: oblique;
        color: var(--accent_a);
    }

    .secs {
        justify-content: flex-start;
        gap: 0.5em;
    }
    .lbl {
        color: var(--orange_a);
    }

    .btns { 
        justify-content: flex-end; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }


</style>