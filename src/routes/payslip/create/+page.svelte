<script lang="ts">
  import CreatePayslipForm from '../create-payslip-form.svelte';
  import type { PageProps } from './$types.js';

  let { data }: PageProps = $props();
</script>

<CreatePayslipForm data={data.form} />
