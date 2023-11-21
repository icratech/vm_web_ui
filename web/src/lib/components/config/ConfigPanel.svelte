<script>

    import PillButton from "../../common/button/PillButton.svelte"
    import ConfigBuilder from "./ConfigBuilder.svelte"
    import ConfigCard from "./ConfigCard.svelte"
    import { Device, debug } from "../../des_api"

    import btn_img_edit from "$lib/images/btn-img-edit.svg"
    import btn_img_cancel from "$lib/images/btn-img-cancel.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm.svg"

    export let device = new Device( )
    $: cfg = device.cfg
    let clone_cfg = structuredClone( cfg )

    $: edit = false
    $: editButtonColor = ( edit ? 'bg-red' : 'bg-accent' )
    $: editButtonImg = ( edit ? btn_img_cancel : btn_img_edit )
    $: editButtonHint = ( edit ? "Cancel" : "Edit Configuration" )
    $: editButtonFunc = ( ) => {
        clone_cfg = structuredClone( cfg )
        edit = !edit
    }
    $: title = ( edit ? "Edit Configuration" : "Current Configuration" )

    const editConfig = ( ) => {
        device.cfg = clone_cfg
        device.setConfig( )
        edit = !edit
    }

</script>

<div class="flx-col container">

    <div class="flx-row panel-title-bar">
        <div class="flx-row panel-title-btns">

            <PillButton
                cls={ editButtonColor }
                img={ editButtonImg }
                on:click={ editButtonFunc }
                hint={ editButtonHint }
            />

            { #if edit }

                <PillButton
                    cls={ 'bg-green' }
                    img={ btn_img_confirm }
                    on:click={ editConfig }
                    hint={ "Confirm" }
                />

            { /if }

        </div>
        <h3 class="panel-title">{ title }</h3>
    </div>
    { #if edit }

    <div class="flx-col">
        <ConfigBuilder bind:cfg={ clone_cfg } />
    </div>

    { :else }

    <div class="flx-col">
        <ConfigCard bind:cfg />
     </div>

    { /if }

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