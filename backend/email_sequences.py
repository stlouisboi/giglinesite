"""
GigLine Safety Check — Email Follow-Up Drip System

3 flows based on score:
  GO (0-1 gaps)   → 3 emails over 4 days
  WAIT (2-3 gaps) → 4 emails over 7 days
  NOGO (4-6 gaps) → 4 emails over 7 days
"""

SITE_URL = "https://www.giglinecompliance.com"
CTA_LINK = f'<a href="{SITE_URL}/contact" style="color:#B8972C;font-weight:bold;">Request a Walkthrough or Review</a>'

SIGNATURE = """<br>
<p style="margin:0;">&mdash; Vince</p>
<p style="color:#666;font-size:13px;margin-top:4px;">
  GigLine Safety &amp; Compliance<br>
  <a href="mailto:vince@giglinecompliance.com" style="color:#B8972C;">vince@giglinecompliance.com</a> &middot; 
  <a href="tel:336-329-8899" style="color:#B8972C;">336-329-8899</a>
</p>"""


def wrap_email(body_html):
    return f"""<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1C2B2B;line-height:1.7;font-size:15px;">
{body_html}
{SIGNATURE}
</div>"""


# ── GO SEQUENCE (Strong Results: 0-1 gaps) ──────────────────────────

GO_EMAILS = [
    {
        "delay_days": 0,
        "subject": "Your Safety Check Result",
        "html": wrap_email("""
<p>{name},</p>

<p>You answered "yes" to most of the six questions.</p>

<p>That tells me your operation likely has basic controls in place where many others do not.</p>

<p>That matters.</p>

<p>But it does not mean everything holds under review.</p>

<p>Most operations that score well here still have gaps in:</p>

<ul style="padding-left:20px;color:#444;">
  <li>documentation detail</li>
  <li>consistency of execution</li>
  <li>what actually happens on the floor</li>
</ul>

<p>This check is a signal, not a full picture.</p>

<p>If you want to confirm what holds and what doesn't, the next step is a walkthrough or documentation review.</p>
"""),
    },
    {
        "delay_days": 2,
        "subject": "Where strong operations still get exposed",
        "html": wrap_email("""
<p>{name},</p>

<p>Even well-run operations tend to miss the same things:</p>

<ul style="padding-left:20px;color:#444;">
  <li>training records that are incomplete or outdated</li>
  <li>inspections that are done but not documented</li>
  <li>programs that exist but are not followed consistently</li>
</ul>

<p>On paper, everything looks in place.</p>

<p>Under review, it doesn't hold.</p>

<p>That's usually the difference between:<br>
"we've got this covered"<br>
and<br>
"we need to fix this now"</p>

<p>If you want a clear answer, I can take a look.</p>
"""),
    },
    {
        "delay_days": 4,
        "subject": "If you want a second set of eyes",
        "html": wrap_email("""
<p>{name},</p>

<p>You don't need a long-term consultant.</p>

<p>You just need a clear read on:</p>

<ul style="padding-left:20px;color:#444;">
  <li>what is exposed</li>
  <li>what actually matters</li>
  <li>what should be fixed first</li>
</ul>

<p>That's what the walkthrough and review are built for.</p>

<p>If you want that, you can request it here:</p>

<p>{cta}</p>
"""),
    },
]


# ── WAIT SEQUENCE (Mixed Results: 2-3 gaps) ─────────────────────────

WAIT_EMAILS = [
    {
        "delay_days": 0,
        "subject": "Your Safety Check shows a pattern",
        "html": wrap_email("""
<p>{name},</p>

<p>Your answers show a mix.</p>

<p>Some areas look controlled.<br>
Others likely need attention.</p>

<p>That's where most operations sit.</p>

<p>Not failing.<br>
But not fully protected either.</p>

<p>The risk is not obvious until something happens or someone looks closely.</p>

<p>This is the stage where small gaps become bigger problems later.</p>
"""),
    },
    {
        "delay_days": 2,
        "subject": "The gaps that usually get missed",
        "html": wrap_email("""
<p>{name},</p>

<p>The issues that come up most often:</p>

<ul style="padding-left:20px;color:#444;">
  <li>programs that exist but are not current</li>
  <li>inspections that are not documented</li>
  <li>training that is assumed but not verified</li>
  <li>equipment conditions that drift over time</li>
</ul>

<p>None of these feel urgent.</p>

<p>Until they are.</p>

<p>This is where a simple review helps — just to see what's actually there.</p>
"""),
    },
    {
        "delay_days": 4,
        "subject": "What to fix first",
        "html": wrap_email("""
<p>{name},</p>

<p>The hardest part is not knowing something is wrong.</p>

<p>It's knowing:<br>
what matters first<br>
and what can wait</p>

<p>That's what the walkthrough or documentation review solves.</p>

<p>It gives you:</p>

<ul style="padding-left:20px;color:#444;">
  <li>a clear list</li>
  <li>in priority order</li>
  <li>with no guesswork</li>
</ul>

<p>If you want that clarity:</p>

<p>{cta}</p>
"""),
    },
    {
        "delay_days": 7,
        "subject": "Most operations stay in this stage too long",
        "html": wrap_email("""
<p>{name},</p>

<p>Most operations stay in the "mostly fine" stage.</p>

<p>Things work.<br>
Nothing urgent.<br>
No major issues.</p>

<p>Until something forces attention.</p>

<p>The goal is not perfection.</p>

<p>It's knowing where you are exposed before that happens.</p>

<p>If you want a clean read on your operation, I can help with that.</p>

<p>{cta}</p>
"""),
    },
]


# ── NOGO SEQUENCE (Weak Results: 4-6 gaps) ──────────────────────────

NOGO_EMAILS = [
    {
        "delay_days": 0,
        "subject": "Your Safety Check result",
        "html": wrap_email("""
<p>{name},</p>

<p>Based on your answers, there are likely gaps in areas that are commonly cited.</p>

<p>That's not unusual.</p>

<p>It just means the system isn't fully in place yet.</p>

<p>This is where most small operations start.</p>

<p>The important part is recognizing it early.</p>
"""),
    },
    {
        "delay_days": 2,
        "subject": "Where this usually leads",
        "html": wrap_email("""
<p>{name},</p>

<p>When these areas are not in place, the same patterns show up:</p>

<ul style="padding-left:20px;color:#444;">
  <li>inconsistent practices</li>
  <li>missing documentation</li>
  <li>exposure that goes unnoticed</li>
  <li>problems discovered too late</li>
</ul>

<p>None of it happens all at once.</p>

<p>It builds quietly.</p>

<p>Until something forces attention.</p>
"""),
    },
    {
        "delay_days": 4,
        "subject": "What needs to happen next",
        "html": wrap_email("""
<p>{name},</p>

<p>At this stage, guessing is the problem.</p>

<p>What you need is:</p>

<ul style="padding-left:20px;color:#444;">
  <li>a clear picture</li>
  <li>of what is missing</li>
  <li>and what matters first</li>
</ul>

<p>That's what the walkthrough or documentation review provides.</p>

<p>No system build.<br>
No long-term contract.<br>
Just clarity.</p>

<p>{cta}</p>
"""),
    },
    {
        "delay_days": 7,
        "subject": "Before it turns into a bigger problem",
        "html": wrap_email("""
<p>{name},</p>

<p>Most issues are manageable early.</p>

<p>They become expensive when they are:</p>

<ul style="padding-left:20px;color:#444;">
  <li>documented by someone else</li>
  <li>tied to an incident</li>
  <li>or required under pressure</li>
</ul>

<p>The goal is to address them before that point.</p>

<p>If you want help identifying what needs attention first:</p>

<p>{cta}</p>
"""),
    },
]


def get_flow_for_score(score_gaps):
    """Return flow type and email sequence based on number of gaps"""
    if score_gaps <= 1:
        return "GO", GO_EMAILS
    elif score_gaps <= 3:
        return "WAIT", WAIT_EMAILS
    else:
        return "NOGO", NOGO_EMAILS


def render_email(template, name):
    """Replace placeholders in email template"""
    html = template["html"].replace("{name}", name).replace("{cta}", CTA_LINK)
    subject = template["subject"]
    return subject, html
