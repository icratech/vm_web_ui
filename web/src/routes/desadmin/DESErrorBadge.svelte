<script>

    import { createEventDispatcher } from 'svelte'

    import DateTimeDisplay from '../../lib/common/date_time/DateTimeDisplay.svelte'
    import { DESError } from '../../lib/des/api'

    export let err = new DESError( )

    const dispatch = createEventDispatcher( )

</script>

<div class="flx-row" on:click={ ( ) => { dispatch( "err_selected", err ) } } on:keyup>
    <DateTimeDisplay bind:date={ err.des_err_time } />
    <div>{ err.des_err_msg }</div>
</div>