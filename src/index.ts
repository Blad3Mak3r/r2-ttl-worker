/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	R2_BUCKET: R2Bucket;
}

const TTL = 30

export default {
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext
	): Promise<void> {
		const listed = await env.R2_BUCKET.list()

		let truncated = listed.truncated
		let cursor = truncated ? listed.cursor : undefined

		while (truncated) {
			const next = await env.R2_BUCKET.list({
				cursor: cursor
			})
			listed.objects.push(...next.objects)

			truncated = next.truncated
			cursor = next.cursor
		}

		const now = new Date().getTime()

		function getExpired(o: R2Object): boolean {
			return (Math.abs(now - o.uploaded.getTime())) / (1000 * 60 * 60 * 24) > TTL
		}

		const expiredObjects = listed.objects.filter((o) => getExpired(o))

		if (expiredObjects.length < 1) {
			console.info("There are no expired items!")
			return
		}

		console.info(`Following objects will be removed:\n${expiredObjects.map(o => `\n- ${o.key} (${o.size}) [${o.uploaded.getTime()}]`)}`)

		await env.R2_BUCKET.delete(expiredObjects.map(o => o.key))
		console.info(`Deleted a total of ${expiredObjects.length} R2Objects`)
	},
};
