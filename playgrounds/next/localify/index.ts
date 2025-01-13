// eslint-disable-next-line antfu/no-import-dist
import Localify from "../../../dist";

let __LOCALIFY_INSTANCE__: Localify | null = null;

export async function initLocalify() {
  if (__LOCALIFY_INSTANCE__) {
    return __LOCALIFY_INSTANCE__;
  }

  const localify = new Localify(process.cwd(), {
    localDb: true,
    draft: true,
    excerpt: "",
  });
  await localify.init();
  __LOCALIFY_INSTANCE__ = localify;
  return localify;
}
