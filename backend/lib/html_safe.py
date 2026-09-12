"""HTML-escaping helpers for outbound email rendering (SEC-003).

Every user-supplied value that is interpolated into an HTML email template must
be run through :func:`esc` (or :func:`esc_default`) so that a submitter cannot
inject `<script>`, `<a href="phish">`, HTML entities, or attribute-breakouts
into an admin's inbox.

Kept intentionally tiny so it can be imported from every route without pulling
in a templating engine. The wrapper always calls :func:`html.escape` with
``quote=True`` so both single and double quotes are neutralized (important for
values interpolated inside HTML attributes).
"""

from __future__ import annotations

import html
from typing import Any, Iterable


def esc(value: Any) -> str:
    """Return an HTML-safe string for ``value``.

    ``None`` becomes an empty string. Non-strings are coerced via ``str()``
    before escaping so callers do not need to pre-stringify ints, floats, etc.
    """
    if value is None:
        return ""
    return html.escape(str(value), quote=True)


def esc_default(value: Any, default: str = "&mdash;") -> str:
    """Escape ``value``. When it is empty / whitespace, emit ``default`` as-is.

    The default is trusted (caller-controlled markup, e.g. ``&mdash;``) so it is
    NOT escaped. Only the user-supplied value is escaped.
    """
    if value is None:
        return default
    coerced = str(value).strip()
    if not coerced:
        return default
    return html.escape(coerced, quote=True)


def esc_join(values: Iterable[Any], sep: str = ", ", default: str = "&mdash;") -> str:
    """Escape each item in ``values`` and join with ``sep``.

    ``sep`` is trusted markup, ``default`` is emitted when the iterable is empty.
    """
    parts = [esc(v) for v in (values or []) if str(v or "").strip()]
    if not parts:
        return default
    return sep.join(parts)
