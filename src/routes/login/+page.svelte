<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { ActionData, PageData } from './$types';
	import { goto } from '$app/navigation';

	interface Props {
		form?: ActionData;
		data: PageData;
	}

	let { form, data }: Props = $props();

	let email = $state(form?.email || '');
	let password = $state('');
	let loading = $state(false);
	let successMessage = $state('');

	onMount(() => {
		const urlMessage = page.url.searchParams.get('message');
		if (urlMessage) {
			successMessage = urlMessage;
		}
	});
</script>

<svelte:head>
	<title>로그인</title>
	<meta name="description" content="로그인 페이지" />
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4"
>
	<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
		<h1 class="mb-2 text-center text-3xl font-bold text-gray-800">로그인</h1>
		<p class="mb-8 text-center text-sm text-gray-600">계정에 로그인하세요</p>

		{#if successMessage}
			<div class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
				{successMessage}
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					await update();
					loading = false;

					// 성공 시 리다이렉트
					if (result.type === 'success' && result.data?.success) {
						const message = encodeURIComponent(result.data.message as string);
						goto(`/sverdle?message=${message}`);
					}
				};
			}}
		>
			<div class="mb-6">
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700"> 이메일 </label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					placeholder="이메일을 입력하세요"
					required
					disabled={loading}
					class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
					비밀번호
				</label>
				<input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					placeholder="비밀번호를 입력하세요"
					required
					disabled={loading}
					class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				/>
			</div>

			<div class="mb-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
				<label class="flex cursor-pointer items-center">
					<input type="checkbox" name="remember" class="mr-2" />
					로그인 상태 유지
				</label>
				<a href="/forgot-password" class="text-blue-500 hover:underline">비밀번호 찾기</a>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:transform hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
			>
				{loading ? '로그인 중...' : '로그인'}
			</button>
		</form>

		<div class="mt-6 text-center text-sm text-gray-600">
			계정이 없으신가요?
			<a href="/signup" class="font-semibold text-blue-500 hover:underline">회원가입</a>
		</div>
	</div>
</div>
