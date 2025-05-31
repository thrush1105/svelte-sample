<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import { Plus } from '@lucide/svelte';

  let { children } = $props();
</script>

<div class="flex justify-between">
  <div class="flex gap-4">
    <a href="/payslip/monthly" class="font-medium hover:underline">月別</a>
    <a href="/payslip/yearly" class="font-medium hover:underline">年別</a>
  </div>
  <Button variant="outline" href="/payslip/create">
    <Plus />
    追加
  </Button>
</div>

<div class="mx-auto space-y-4">
  {@render children()}
</div>
