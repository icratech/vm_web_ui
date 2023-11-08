
<script>
    
    import DateTimeDisplay from "$lib/common/date_time/DateTimeDisplay.svelte"
	import { Report } from "../../des_api"

    export let rep = new Report( )

</script>


<div class="flx-col container">

    { rep.rep_title }

</div>