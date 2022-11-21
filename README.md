# R2 TTL WORKER

Use this template to create a [Cloudflare Worker][workers] that will allow you to automatically delete objects older than 30 days in a [R2 Bucket][r2].

## Getting started
1. Install [wrangler][wrangler] using npm ``npm i -g wrangler@latest``.
2. Login with your Cloudflare account using [``wrangler login``][wrangler_login]
3. Create an ``.env`` file following the [guide][workers_docs_system_env_vars] in the [Cloudflare Workers documentation][workers_docs] (env file will not be commited).
4. Get the name of the bucket you want to use with the ``wrangler r2 bucket list`` command.
5. Edit your [wrangler.toml](/wrangler.toml) file and change ``YOUR BUCKET NAME`` with the name of the bucket you want to bind.
6. Run ``wrangler publish`` and the worker will be created.

### Changing the Worker name
You can change the name of the Worker simply by changing the ``name=`` variable in your [wrangler.toml](/wrangler.toml) file

### Changing cron scheduled time
Just go to [wrangler.toml](/wrangler.toml) and replace ``crons = [ "0 8 * * *" ]`` with your needed crons ([crons tutorial][crons_tutorial])


[workers]: https://workers.cloudflare.com/
[workers_docs]: https://developers.cloudflare.com/workers/
[r2]: https://www.cloudflare.com/es-es/products/r2/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/
[wrangler_login]: https://developers.cloudflare.com/workers/wrangler/commands/#login
[workers_docs_system_env_vars]: https://developers.cloudflare.com/workers/wrangler/system-environment-variables/
[crons_tutorial]: https://crontab.guru/#0_8_*_*_*