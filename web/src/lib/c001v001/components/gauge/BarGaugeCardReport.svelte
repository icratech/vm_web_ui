
<script>

    import { debug } from '../../../des/utils'
    import { AUTH, RoleCheck } from '../../../des/api'

    import BarGaugeH from '../../../common/bar_gauge/BarGaugeH.svelte'

    import { Config, Sample, MODES } from '../../models'
    import { CHT_COLORS } from '../../chart_display'

    export let cfg = new Config( )
    export let smp = new Sample( )

    const role = new RoleCheck( )

</script>



<div class="flx-col container">

    <BarGaugeH title="CH4"
        base_color={ CHT_COLORS.CH4 }
        bind:num={ smp.smp_ch4 }
        max={ 100 }
        unit={ "%" }
    />
    
    { #if role.isSuper( $AUTH.user.role )  }
    <BarGaugeH title="H-Flow"
        base_color={ CHT_COLORS.HI_FLOW }
        bind:num={ smp.smp_hi_flow }
        max={ 250 }
        unit={ "L/min" }
    />
    <BarGaugeH title="L-Flow"
        base_color={ CHT_COLORS.LO_FLOW }
        bind:num={ smp.smp_lo_flow }
        max={ 2 }
        unit={ "L/min" }
    />
    { :else if smp.smp_hi_flow > cfg.cfg_flow_tog }
    <BarGaugeH title="Flow"
        base_color={ CHT_COLORS.HI_FLOW }
        bind:num={ smp.smp_hi_flow }
        max={ 250 }
        unit={ "L/min" }
    />
    { :else }
    <BarGaugeH title="Flow"
        base_color={ CHT_COLORS.LO_FLOW }
        bind:num={ smp.smp_lo_flow }
        max={ 2 }
        unit={ "L/min" }
    />
    { /if }
    
    <BarGaugeH title="Pressure"
        base_color={ CHT_COLORS.PRESS }
        bind:num={ smp.smp_press }
        max={ 7000 }
        unit={ "kPa" }
    />
    
    <BarGaugeH title="Battery"
        base_color={ CHT_COLORS.BAT_VOLT }
        bind:num={ smp.smp_bat_volt }
        max={ 14 }
        unit={ "Volts" }
    />
    
    <BarGaugeH title="Motor"
        base_color={ CHT_COLORS.MOT_VOLT }
        bind:num={ smp.smp_mot_volt }
        max={ 14 }
        unit={ "Volts" }
    />
    
</div>

<style>
    .container {
        justify-content: center;
        padding: 0;
        border-radius: 0.5em;
        height: 100%;
        gap: 0;
    }
    
    /* LAP TOP */
    @media(max-width: 1440px) {
        
    }

    /* TABLET */
    @media(max-width: 1100px) {
        .container { 
            background-color: transparent;
            border: none;
        }
    }

    /* MOBILE */
    @media(max-width: 450px) { 
    
    }
</style> 
