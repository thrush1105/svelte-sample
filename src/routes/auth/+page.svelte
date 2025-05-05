<script lang="ts">
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();

  let email = $state(form?.email ?? '');
  let password = $state('');
</script>

<div class="space-y-2">
  <p class="text-2xl font-bold">ログイン</p>
  <div>
    {#if form?.error}
      <p class="text-red-500">{form.error.message}</p>
    {/if}
  </div>
  <form method="POST" action="?/login">
    <div class="space-y-2">
      <input
        type="text"
        name="email"
        class="block w-full rounded border px-2 py-1"
        bind:value={email}
        placeholder="メールアドレス"
      />
      <input
        name="password"
        type="password"
        class="block w-full rounded border px-2 py-1"
        bind:value={password}
        placeholder="パスワード"
      />
      <button class="block w-full rounded border py-1 hover:cursor-pointer hover:bg-slate-100">
        ログイン
      </button>
      <button
        formaction="?/signup"
        class="block w-full rounded border py-1 hover:cursor-pointer hover:bg-slate-100"
      >
        新規登録
      </button>
    </div>
  </form>
</div>

<div class="space-y-2">
  <p class="text-2xl font-bold">OAuth</p>
  <form method="POST" action="?/signInWithOAuth">
    <div class="space-y-2">
      <input type="hidden" name="provider" value="google" />
      <button class="block w-full rounded border px-3 py-1 hover:cursor-pointer hover:bg-slate-100">
        Google
      </button>
    </div>
  </form>
  <form method="POST" action="?/signInWithOAuth">
    <div class="space-y-2">
      <input type="hidden" name="provider" value="github" />
      <button class="block w-full rounded border px-3 py-1 hover:cursor-pointer hover:bg-slate-100">
        GitHub
      </button>
    </div>
  </form>
</div>
