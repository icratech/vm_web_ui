<script>

    import PillButton from "../../common/button/PillButton.svelte"
    import HeaderBuilder from "./HeaderBuilder.svelte"
    import HeaderCard from "./HeaderCard.svelte"
    import DeviceConn from "../../../routes/device/DeviceConn.svelte"
    import { Device, OP_CODES, debug } from "../../des_api"

    import btn_img_edit from "$lib/images/btn-img-edit.svg"
    import btn_img_cancel from "$lib/images/btn-img-cancel.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm.svg"

    export let device = new Device( )
    $: hdr = device.hdr
    let clone_hdr = structuredClone( hdr )

    $: edit = false
    $: editButtonColor = ( edit ? 'bg-red' : 'bg-accent' )
    $: editButtonImg = ( edit ? btn_img_cancel : btn_img_edit )
    $: editButtonHint = ( edit ? "Cancel" : "Edit Job Header" )
    $: editButtonFunc = ( ) => {
        clone_hdr = structuredClone( hdr )
        edit = !edit
    }
    $: title = ( edit ? "Edit Job Header" : "Current Job Header" )

    const editHeader = ( ) => {
        device.hdr = clone_hdr
        device.setHeader( )
        edit = !edit
    }


</script>

<div class="flx-col container">

    <div class="flx-row panel-title-bar">
        <div class="flx-row panel-title-btns">

            { #if device.sta.sta_logging > OP_CODES.JOB_START_REQ }
            <PillButton
                cls={ editButtonColor }
                img={ editButtonImg }
                on:click={ editButtonFunc }
                hint={ editButtonHint }
            />
            { /if }

            { #if edit }

                <PillButton
                    cls={ 'bg-green' }
                    img={ btn_img_confirm }
                    on:click={ editHeader }
                    hint={ "Confirm" }
                />

            { /if }

        </div>
        <h3 class="panel-title">{ title }</h3>
    </div>
    { #if edit }

    <div class="flx-col">
        <HeaderBuilder bind:hdr={ clone_hdr } />
    </div>

    { :else }

    <div class="flx-col">
        <HeaderCard bind:hdr />
     </div>

    { /if }

    <!-- <div></div>
    <DeviceConn bind:device /> -->
</div>

<style>

    .container {
        overflow-y: auto;
        padding-right: 0.5em;
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

</style>