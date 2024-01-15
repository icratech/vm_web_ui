<script>

    import { debug } from '../../../des/utils'
    import { AUTH, RoleCheck } from '../../../des/api'
    import { OP_CODES } from '../../models'
    import { Device } from "../../device"

    import PillButton from '../../../common/button/PillButton.svelte'
    import ConfigBuilder from "./ConfigBuilder.svelte"
    import ConfigCard from "./ConfigCard.svelte"
    
    import btn_img_edit from "$lib/images/btn-img-edit-aqua.svg"
    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"

    const role = new RoleCheck( )
    export let device = new Device( )
    $: cfg = device.cfg
    let clone_cfg = structuredClone( cfg )

    $: edit = false
    $: editButtonImg = ( edit ? btn_img_cancel : btn_img_edit )
    $: editButtonHint = ( edit ? "Cancel" : "Edit Configuration" )
    $: editButtonFunc = ( ) => {
        clone_cfg = structuredClone( cfg )
        edit = !edit
    }
    $: title = ( edit ? "Edit Configuration" : "Configuration" )

    const editConfig = ( ) => {
        device.cfg = clone_cfg
        device.setConfig( )
        edit = !edit
    }

</script>

<div class="flx-col container">

    <div class="flx-row panel-title-bar">

        { #if device.isActive( ) && role.isOperator( $AUTH.user.role ) }
        <div class="flx-row panel-title-btns">
            <PillButton
                img={ editButtonImg }
                on:click={ editButtonFunc }
                hint={ editButtonHint }
            />
            { #if edit }
            <PillButton
                img={ btn_img_confirm }
                on:click={ editConfig }
                hint={ "Confirm" }
            />
            { /if }
        </div>
        { /if }

        <h3 class="panel-title">{ title }</h3>
    </div>
    { #if edit }

    <div class="flx-col cfg">
        <ConfigBuilder bind:cfg={ clone_cfg } />
    </div>

    { :else }

    <div class="flx-col cfg">
        <ConfigCard bind:cfg />
     </div>

    { /if }

</div>

<style>

    .container {
        padding-right: 0.5em;
        height: 100%;
        gap: 1rem;
    }
    .panel-title-bar {
        border-bottom: solid 0.05em var(--light_01);
        justify-content: space-between;
        padding-top: 0;
        padding-right: 0.5em;
        width: 100%;
        height: 2.75em;
    }
    .panel-title-btns {
        flex-direction: row;
        width: auto;
        gap: 1rem;
    }
    .panel-title {
        align-items: flex-end;
        width: 100%;
        height: 2.75em;
    }

    .cfg {
        overflow-y: auto;
        padding-right: 0.5em;
        gap: 1.5rem;
    }


</style>