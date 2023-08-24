
<script>
	import { Header } from "../../des_api";

    import PillButton from "../../common/button/PillButton.svelte";
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte"
    import InputText from "../../common/input_text/InputText.svelte";
    import UserBadge from "../user/UserBadge.svelte"

    export let header = new Header( )

    $: sendButtonLabel = 'SEND'    
    $: sendButtonColor = 'bg-green'
    const sendHeader = async( ) => { 
        // console.log( "sending header..." )
        // SendHeaderToDevice( )
        editEnabled = false
    }

    let editEnabled = false
    $: editButtonLabel = ( editEnabled ? "CANCEL" : "EDIT" )
    $: editButtonColor = ( editEnabled ? 'bg-red' : 'bg-accent_a' )
    const cancelEdit = ( ) => { // console.log( "cancel editing..." )
        // GetConfigFromDevice( )
        editEnabled = false
    }
    const enableEdit = ( ) => { // console.log( "enable editing..." )
        editEnabled = true
    }


</script>

<div class="flx-col">
       
    <!-- <div class="flx-col card"> -->
        <div class="flx-row card-title">
            <h4>{ header.hdr_well_name }</h4> 
            <div><DateTimeDisplay date={ header.hdr_job_start } /></div>
        </div>
    <!-- </div> -->

    <div class="flx-col  card-content">

        <div class="flx-row bet">
            <h3>Well Information:</h3>
            <div class="flx-row { ( editEnabled ? 'send-cancel' : 'edit' ) }">
                
                { #if editEnabled }
                <PillButton
                    on:click={ ( ) => { sendHeader( ) } }
                    cls={ sendButtonColor }
                >{ sendButtonLabel }</PillButton>
                { /if }

                <PillButton
                    on:click={ ( editEnabled ? cancelEdit : enableEdit ) }
                    cls={ editButtonColor }
                >{ editButtonLabel }</PillButton>

            </div>
        </div>
        
        <div class="flx-col card">
            <div class="flx-row">
                <p class="lbl">Company:</p>
                <InputText bind:enabled={ editEnabled } bind:txt={ header.hdr_well_co } />
            </div>
            
            <div class="flx-row">
                <p class="lbl">Well Name:</p>
                <InputText bind:enabled={ editEnabled } bind:txt={ header.hdr_well_name }  />
            </div>
            
            <div class="flx-row">
                <p class="lbl">Surface Loc:</p>
                <InputText bind:enabled={ editEnabled } bind:txt={ header.hdr_well_sf_loc } />
            </div>
            
            <div class="flx-row">
                <p class="lbl">Bottom-Hole Loc:</p>
                <InputText bind:enabled={ editEnabled } bind:txt={ header.hdr_well_bh_loc } />
            </div>
            
            <div class="flx-row">
                <p class="lbl">License:</p>
                <InputText bind:enabled={ editEnabled } bind:txt={ header.hdr_well_lic } />
            </div>
        </div>
        
    </div>
    
    <UserBadge uid={ header.hdr_user_id } />

</div>

<style>

    
    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        font-size: 0.9rem;
        width: 13em;
    }

    .edit {
        width: 3em;
    }
    .send-cancel {
        width: 7em;
    }

</style>