
<script>

    import InputText from "../../common/input_text/InputText.svelte"
    import InputPW from "../../common/input_pw/InputPW.svelte"

    export let email = ""
    export let password = ""
    
</script>

<div class="flx-col container">

    <div class="flx-row">
        <div class="flx-row fg-accent lbl">Email:</div>
        <InputText enabled={ true } bind:txt={ email } place="Email address"/>
    </div>

    <div class="flx-row">
        <div class="flx-row fg-accent lbl">Password:</div>
        <InputPW enabled={ true } bind:txt={ password } auto="new-password" place="Password"/>
    </div>

</div>

<style>
    .container {
        padding: 0;
        width: 28em;
        gap: 0.75em;
    }
    .lbl {
        width: 5.5em;
        font-size: 1rem;
        align-items: center;
        text-align: end;
    }
</style>