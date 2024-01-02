<script>

    import { debug } from '../../lib/des/utils'

    import { Device } from '../../lib/c001v001/device'
    import { DemoDevice } from "../../lib/des_api"
    import PillButton from "../../lib/common/button/PillButton.svelte"
    
    import btn_img_cmd_red from "$lib/images/btn-img-cmd-red.svg"
    import btn_img_cmd_orange from "$lib/images/btn-img-cmd-orange.svg"
    import btn_img_cmd_yellow from "$lib/images/btn-img-cmd-yellow.svg"
    import btn_img_cmd_green from "$lib/images/btn-img-cmd-green.svg"
    import btn_img_cmd_aqua from "$lib/images/btn-img-cmd-aqua.svg"
    import btn_img_cmd_blue from "$lib/images/btn-img-cmd-blue.svg"
    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_cmd_pink from "$lib/images/btn-img-cmd-pink.svg"

    import btn_img_disconnect_red from "$lib/images/btn-img-disconnect-red.svg"
    import btn_img_connect_green from "$lib/images/btn-img-connect-green.svg"
    import btn_img_reset_aqua from "$lib/images/btn-img-reset-aqua.svg"

    export let device = new Device( )

    const downloadDeviceFiles = async( ) => {
        let files = await device.getDeviceFiles( )
        debug( "DESAdminDeviceCMD.svelte -> downloadDeviceFiles( ) -> FILES: ", files )

        await jsonDownload( files.adm, "adm" )
        await jsonDownload( files.sta, "sta" )
        await jsonDownload( files.hdr, "hdr" )
        await jsonDownload( files.cfg, "cfg" )
        await jsonDownload( files.evt, "evt" )

    }

    /* JSON FILE -> DOWNLOAD & SAVE */
    const jsonDownload = async( obj, name ) => {

        let file = `[${ JSON.stringify( obj ) }]`
        // let bytes = await doc.save( ) 
        let blob = new Blob( [ file ], { type: 'data:text/json; charset=utf-8;' } )
        // let fileName = `${ name }-${ FormatTimeCodeDashed( Date.now( ) ) }.json`
        let fileName = `${ name }.json`
        let saveOptions = { description: "JSON", accept: { "tex/plain" : [ ".json" ] } }

        await saveBlobToFile( blob, fileName, saveOptions )

    }
    /* JSON -> SAVE */
    const saveBlobToFile = async( blob, fileName, saveOptions ) => {

        if ( window.navigator && window.navigator.msSaveOrOpenBlob ) {

            window.navigator.msSaveOrOpenBlob( blob )

        } else {

            // if ( window.showSaveFilePicker ) {

            //     /* ALLOW USER TO CHOOSE NAME & LOCATION */
            //     let handle = await showSaveFilePicker( {
            //         suggestedName: fileName,
            //         types: [ saveOptions ]
            //     } )

            //     let writable = await handle.createWritable( )
            //     await writable.write( blob )
            //     writable.close( )

            // } else {

                /* SAVE IN DEFAULT DOWNLOADS FOLDER */
                const url = window.URL.createObjectURL( blob )
                let link = document.createElement( 'a' )
                link.href = url
                link.download = fileName
                link.target="_blank"
                link.click( )

                // For Firefox it is necessary to delay revoking the ObjectURL.
                setTimeout( ( ) => { window.URL.revokeObjectURL( url ) }, 250)

            // }
        }
    }

</script>


<div class="flx-row container">

    <div class="flx-col btns">
        <PillButton 
            img={ btn_img_cmd_pink }
            on:click={ downloadDeviceFiles }
            hint="Get Files"
        />
        <!-- <PillButton 
            img={ btn_img_disconnect_red }
            hint="Disconnect DES"
        />
        <PillButton 
            img={ btn_img_connect_green }
            hint="Connect DES"
        />
        <PillButton 
            img={ btn_img_reset_aqua }
            hint="Reset DES"
        /> -->
    </div>

    <div class="flx-col btns">
        <PillButton 
            img={ btn_img_cmd_red }
            on:click={ device.setAdmin }
            hint="Admin"
        />
        <PillButton 
            img={ btn_img_cmd_orange }
            on:click={ device.setState }
            hint="State"
        />
        <PillButton 
            img={ btn_img_cmd_yellow }
            on:click={ device.setHeader }
            hint="Header"
        />
        <PillButton 
            img={ btn_img_cmd_green }
            on:click={ device.setConfig }
            hint="Config"
        />
    </div>

    <div class="flx-col btns">
        <!-- <PillButton 
            img={ btn_img_cmd_aqua }
        />
        <PillButton 
            img={ btn_img_cmd_blue }
        />
        <PillButton 
            img={ btn_img_cmd_purple }
        />
        <PillButton 
            img={ btn_img_cmd_pink }
        /> -->
    </div>

</div>

<style>
        
    .container {
        /* background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01); */
        border-radius: 0.5em;
        height:100%;
        padding: 1em;
        gap: 0.5em;
    }
    
    .btns { 
        /* justify-content: flex-end;  */
        width: 7em;
        gap: 1em;
    }

</style>