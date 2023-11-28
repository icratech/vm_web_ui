<script>
    export let cls 
    import def from "$lib/images/btn-img-default.svg"
    export let img = def
    export let hint 

    $: { if ( img == null ) { img = def } }

</script>


    <div class="icon img { cls }"  style="background-image: url( { img } );" on:click  on:keydown >
        { #if hint != null }
        <div class="hint">{ hint }</div>
        { /if }
    </div>


<style>

    .icon {
        /* outline: 0.2em solid var(--dark_a); outline-offset: -0.1em; */
        background-size: cover;
        cursor: pointer;
        border-radius: 50%;
        min-width: 2.5em;
        max-width: 2.5em;
        width: 2.5em;
        min-height: 2.5em;
        max-height: 2.5em;
        height: 2.5em;
        opacity: 0.8;
    }
    .icon .hint {
        display: none;
        position: relative;
        color: var(--light_a);
        background-color: var(--dark);
        border-bottom: solid 0.1em var(--light_01);
        border-right: solid 0.1em var(--light_01);
        border-radius: 0.5em;
        font-size: 1.2em;
        top: 1.5em;
        left: 1.5em;
        height: 2em;
        /* width:max-content; */
    }
    .icon:hover {
        opacity: 1;
    }
    .icon:hover .hint {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 0.5em;
        padding-right: 0.5em;
        width:max-content;
        /* visibility: visible; */
        /* opacity: 1; */
    }


    /* LAP TOP */
    @media(max-width: 1440px) {

    }

    /* TABLET */
    @media(max-width: 1024px) {
        /* .icon:hover .hint { display: none; } */
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        
    }

</style>
