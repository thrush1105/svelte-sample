<script lang="ts">
  import SearchInput from '$lib/components/search-input.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Select from '$lib/components/ui/select/index.js';
  import { updateUrlQuery } from '$lib/url';
  import type { SearchParams } from '../schema';
  import Combobox from './combobox.svelte';

  type Props = {
    params: SearchParams;
    categories: { label: string; value: string }[];
  };

  let { params = $bindable(), categories }: Props = $props();
</script>

<div class="grid gap-4 sm:grid-cols-4">
  <div class="space-y-2">
    <Label>キーワード</Label>
    <SearchInput
      bind:value={params.q}
      onEnter={() => {
        updateUrlQuery({ q: params.q || null });
      }}
      onReset={() => {
        updateUrlQuery({ q: null });
      }}
    />
  </div>
  <div class="space-y-2">
    <Label>カテゴリー</Label>
    <Combobox
      options={categories}
      bind:value={params.category}
      noSelect="カテゴリーを選択"
      onSelect={(value) => {
        updateUrlQuery({ category: value || null });
      }}
    />
  </div>
  <div class="space-y-2">
    <Label>この日以前</Label>
    <Input
      type="date"
      bind:value={params.since}
      onchange={() => {
        updateUrlQuery({ since: params.since || null });
      }}
    />
  </div>
  <div class="space-y-2">
    <Label>この日以降</Label>
    <Input
      type="date"
      bind:value={params.until}
      onchange={() => {
        updateUrlQuery({ until: params.until || null });
      }}
    />
  </div>

  <div class="space-y-2">
    <Label>並び替え</Label>
    <Select.Root
      type="single"
      bind:value={params.sort}
      onValueChange={() => {
        updateUrlQuery({ sort: params.sort || null });
      }}
    >
      <Select.Trigger class="w-auto">
        {params.sort === 'newest' ? '新しい順' : '古い順'}
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="newest">新しい順</Select.Item>
        <Select.Item value="oldest">古い順</Select.Item>
      </Select.Content>
    </Select.Root>
  </div>
</div>
