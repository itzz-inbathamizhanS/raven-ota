export const AnalyticsPage = () => {
  return (
    <div className="flex flex-col w-full px-margin-desktop py-space-xl bg-surface min-h-full gap-space-xl">
      <div className="flex flex-col gap-space-xs">
        <span className="font-code-md text-code-md text-secondary uppercase tracking-widest">
          AGGREGATE FLEET DATA
        </span>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Fleet Analytics</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-xs">
          Longitudinal analysis of safety margin drift across software versions and vehicle operating conditions.
        </p>
      </div>

      <div className="flex flex-col gap-space-md items-center justify-center p-space-2xl text-center border border-outline-variant bg-surface-container-low rounded-DEFAULT">
        <span className="material-symbols-outlined text-outline text-[48px]">bar_chart</span>
        <span className="font-headline-md text-headline-md text-secondary">Analytics Module Active</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
          This dashboard requires 30 days of continuous telemetry to populate regression models and drift metrics. 
          Currently collecting baseline data for the RAVEN-OTA evaluation fleet.
        </span>
      </div>
    </div>
  );
};
