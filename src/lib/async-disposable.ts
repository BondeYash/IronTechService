type Disposable = { dispose: () => void };

/** Cancel pending startup and dispose even if an async creator completes late. */
export function startDisposable<T extends Disposable>(
  create: (signal: AbortSignal) => Promise<T>,
  onReady: (resource: T) => void,
  onError: (error: unknown) => void,
) {
  const controller = new AbortController();
  let resource: T | undefined;
  void Promise.resolve()
    .then(() => create(controller.signal))
    .then((result) => {
      if (controller.signal.aborted) result.dispose();
      else {
        resource = result;
        onReady(result);
      }
    })
    .catch((error: unknown) => {
      if (!controller.signal.aborted) onError(error);
    });
  return () => {
    controller.abort();
    resource?.dispose();
    resource = undefined;
  };
}
