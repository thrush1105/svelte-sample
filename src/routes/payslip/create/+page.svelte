<script lang="ts">
  import PayslipForm from '../payslip-form.svelte';
  import type { PageProps } from './$types.js';
  let { data }: PageProps = $props();
</script>

<PayslipForm {data} />
