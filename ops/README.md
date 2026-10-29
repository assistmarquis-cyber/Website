# Monitoring Alan (Prometheus style)

Netlify functions are short-lived, so Prometheus cannot scrape them directly. Instead, every request writes one JSON line (`"app":"alan","audit":1`) with numbers only, never anything a visitor typed. The path is:

1. Netlify log drain (Log Drains, on a plan that includes it) sends function logs to a collector.
2. The collector, Vector here, turns each line into counters and a histogram: `ops/vector.toml`.
3. Prometheus scrapes the collector on port 9598: `ops/prometheus/prometheus.yml`.
4. Alertmanager or Grafana alerts from `ops/prometheus/alerts.yml`.
5. The same raw lines also go to write-once storage (for example S3 with Object Lock) as the audit record. Check them with `AUDIT_HMAC_KEY=... npm run audit:verify -- export.log`.

Status: these files are an untested starting point. They have not been run against a live drain. Treat first deployment as a setup task, not a finished one.

Metrics produced: `alan_requests_total{event,status}`, `alan_request_ms` (histogram), `alan_redactions_total`, `alan_crisis_total`, `alan_upstream_errors_total`.
