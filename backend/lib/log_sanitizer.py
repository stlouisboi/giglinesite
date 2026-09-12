"""Access-log sanitization filter (SEC-002 defence-in-depth).

Every uvicorn access log line looks like:

    INFO: 127.0.0.1:0 - "GET /api/admin/stats?token=SECRET HTTP/1.1" 200

The `?token=SECRET` portion leaks the admin password into Railway/Vercel logs
whenever the frontend uses legacy query-string auth. This filter rewrites the
`token=` query parameter to `token=<redacted>` on any uvicorn log record so
the raw secret never touches disk-persisted logs, regardless of whether the
admin dashboard has migrated to header auth yet.

Install by calling :func:`install_access_log_redaction` at application
startup. Safe to call multiple times.
"""

from __future__ import annotations

import logging
import re

# Match `token=<value>` in either a full URL path or a bare query string.
# Value continues until the next `&`, whitespace, quote, or end of string.
_TOKEN_PATTERN = re.compile(r'(?i)(?:^|(?<=[?&]))token=([^&\s"\'>]+)')


class _RedactTokenFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        # Uvicorn passes the log message via record.args (positional). Rewrite
        # both the pre-formatted message and any string args defensively.
        try:
            if isinstance(record.args, tuple):
                record.args = tuple(
                    _TOKEN_PATTERN.sub("token=<redacted>", a) if isinstance(a, str) else a
                    for a in record.args
                )
            if isinstance(record.msg, str):
                record.msg = _TOKEN_PATTERN.sub("token=<redacted>", record.msg)
        except Exception:
            # Never break logging on redaction failure.
            pass
        return True


def install_access_log_redaction() -> None:
    """Attach the redaction filter to every uvicorn logger (idempotent)."""
    for name in ("uvicorn.access", "uvicorn", "uvicorn.error", "gigline"):
        lg = logging.getLogger(name)
        if not any(isinstance(f, _RedactTokenFilter) for f in lg.filters):
            lg.addFilter(_RedactTokenFilter())
