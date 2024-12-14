declare module "cloudflare:test" {
    interface ProvidedEnv extends Env {
        dbInit: D1Migration[]
    }
}